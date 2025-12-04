#!/usr/bin/env python3
"""
Backfill USGS water data (discharge and gage height) for fishing journal entries.

Station Mapping:
- Spring River → 07069305 (Spring Street Bridge at Hardy, AR)
- Eleven Point River → 07072000 (Near Ravenden Springs, AR)
"""

import json
import re
import requests
import shutil
import time
from datetime import datetime
from pathlib import Path

# USGS Station IDs
STATIONS = {
    'Spring River': '07069305',
    'Eleven Point River': '07072000',
}

# USGS parameter codes
PARAM_DISCHARGE = '00060'  # Discharge (cfs)
PARAM_GAGE_HEIGHT = '00065'  # Gage height (ft)

SAMPLE_DATA_PATH = Path(__file__).parent.parent / 'src' / 'data' / 'sampleData.ts'


def fetch_usgs_data(station_id: str, date: str) -> dict:
    """Fetch daily values from USGS for a specific date."""
    result = {'discharge': None, 'gage_height': None}

    # First try daily values for discharge
    try:
        url = 'https://waterservices.usgs.gov/nwis/dv/'
        params = {
            'sites': station_id,
            'startDT': date,
            'endDT': date,
            'parameterCd': f'{PARAM_DISCHARGE},{PARAM_GAGE_HEIGHT}',
            'format': 'json',
        }
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()

        time_series = data.get('value', {}).get('timeSeries', [])
        for series in time_series:
            var_code = series.get('variable', {}).get('variableCode', [{}])[0].get('value', '')
            values = series.get('values', [{}])[0].get('value', [])

            if values:
                value = values[0].get('value')
                if value and value != '-999999':
                    if var_code == PARAM_DISCHARGE:
                        result['discharge'] = value
                    elif var_code == PARAM_GAGE_HEIGHT:
                        result['gage_height'] = value
    except Exception as e:
        print(f"  Error fetching daily values: {e}")

    # If no gage height from daily values, try instantaneous values (noon reading)
    if not result['gage_height']:
        try:
            url = 'https://waterservices.usgs.gov/nwis/iv/'
            # Fetch the whole day and we'll pick a midday value
            params = {
                'sites': station_id,
                'startDT': f'{date}T00:00-06:00',
                'endDT': f'{date}T23:59-06:00',
                'parameterCd': PARAM_GAGE_HEIGHT,
                'format': 'json',
            }
            response = requests.get(url, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()

            time_series = data.get('value', {}).get('timeSeries', [])
            for series in time_series:
                var_code = series.get('variable', {}).get('variableCode', [{}])[0].get('value', '')
                values = series.get('values', [{}])[0].get('value', [])

                if var_code == PARAM_GAGE_HEIGHT and values:
                    # Pick a midday value (around noon) or first available
                    midday_value = None
                    for v in values:
                        val = v.get('value')
                        dt = v.get('dateTime', '')
                        if val and val != '-999999':
                            # Prefer readings around noon (10:00-14:00)
                            if 'T10:' in dt or 'T11:' in dt or 'T12:' in dt or 'T13:' in dt or 'T14:' in dt:
                                midday_value = val
                                break
                            elif not midday_value:
                                midday_value = val
                    if midday_value:
                        result['gage_height'] = midday_value
        except Exception as e:
            print(f"  Error fetching instantaneous values: {e}")

    return result


def parse_sample_data(content: str) -> list:
    """Extract entry objects from sampleData.ts content."""
    # Find the array content between sampleEntries: FormData[] = [ and ];
    match = re.search(r'export const sampleEntries:\s*FormData\[\]\s*=\s*\[(.*?)\];', content, re.DOTALL)
    if not match:
        raise ValueError("Could not find sampleEntries array in file")

    array_content = match.group(1)

    # Parse each entry object
    entries = []
    # Match each { ... } block
    brace_depth = 0
    current_entry = ""

    for char in array_content:
        if char == '{':
            brace_depth += 1
            current_entry += char
        elif char == '}':
            brace_depth -= 1
            current_entry += char
            if brace_depth == 0 and current_entry.strip():
                entries.append(current_entry.strip())
                current_entry = ""
        elif brace_depth > 0:
            current_entry += char

    return entries


def extract_field(entry: str, field: str) -> str:
    """Extract a field value from an entry string."""
    # Match field: 'value' or field: "value"
    pattern = rf"{field}:\s*['\"]([^'\"]*)['\"]"
    match = re.search(pattern, entry)
    return match.group(1) if match else ""


def update_field(entry: str, field: str, value: str) -> str:
    """Update a field value in an entry string."""
    pattern = rf"({field}:\s*)['\"][^'\"]*['\"]"
    replacement = rf"\1'{value}'"
    return re.sub(pattern, replacement, entry)


def get_station_for_stream(stream_name: str) -> str:
    """Determine which USGS station to use for a given stream."""
    stream_lower = stream_name.lower()
    if 'eleven point' in stream_lower:
        return STATIONS['Eleven Point River']
    else:
        # Default to Spring River
        return STATIONS['Spring River']


def main():
    print("=" * 60)
    print("USGS Water Data Backfill Script")
    print("=" * 60)

    # Read original file
    print(f"\nReading {SAMPLE_DATA_PATH}...")
    content = SAMPLE_DATA_PATH.read_text()

    # Create backup
    backup_path = SAMPLE_DATA_PATH.with_suffix('.ts.backup')
    print(f"Creating backup at {backup_path}...")
    shutil.copy(SAMPLE_DATA_PATH, backup_path)

    # Parse entries
    entries = parse_sample_data(content)
    print(f"Found {len(entries)} entries to process\n")

    updated_count = 0
    no_data_count = 0

    updated_entries = []

    for i, entry in enumerate(entries):
        date = extract_field(entry, 'date')
        stream = extract_field(entry, 'streamName')

        print(f"[{i+1}/{len(entries)}] {date} - {stream}")

        station_id = get_station_for_stream(stream)

        # Fetch USGS data
        usgs_data = fetch_usgs_data(station_id, date)

        updated_entry = entry
        entry_updated = False

        if usgs_data['discharge']:
            updated_entry = update_field(updated_entry, 'flowRate', usgs_data['discharge'])
            print(f"  Discharge: {usgs_data['discharge']} cfs")
            entry_updated = True
        else:
            print(f"  Discharge: No data available")

        if usgs_data['gage_height']:
            updated_entry = update_field(updated_entry, 'riverDepth', usgs_data['gage_height'])
            print(f"  Gage Height: {usgs_data['gage_height']} ft")
            entry_updated = True
        else:
            print(f"  Gage Height: No data available")

        if entry_updated:
            updated_count += 1
        else:
            no_data_count += 1

        updated_entries.append(updated_entry)

        # Rate limiting
        time.sleep(0.5)

    # Rebuild the file content
    print("\nWriting updated data...")

    # Find the original array and replace it
    new_array_content = ',\n'.join(updated_entries)
    new_content = re.sub(
        r'(export const sampleEntries:\s*FormData\[\]\s*=\s*\[).*?(\];)',
        rf'\1\n{new_array_content}\n\2',
        content,
        flags=re.DOTALL
    )

    SAMPLE_DATA_PATH.write_text(new_content)

    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Total entries processed: {len(entries)}")
    print(f"Entries updated with USGS data: {updated_count}")
    print(f"Entries with no USGS data: {no_data_count}")
    print(f"\nBackup saved to: {backup_path}")
    print(f"Updated file: {SAMPLE_DATA_PATH}")
    print("\nDone!")


if __name__ == '__main__':
    main()
