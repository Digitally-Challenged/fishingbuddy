# Water Conditions Backfill Design

## Overview

A one-time Python script to fetch historical USGS water data and update `sampleData.ts` with accurate discharge (cfs) and gage height (ft) values for all fishing journal entries.

## Station Mapping

| Stream | USGS Station | Station ID |
|--------|--------------|------------|
| Spring River | Spring Street Bridge at Hardy, AR | 07069305 |
| Eleven Point River | Near Ravenden Springs, AR | 07072000 |

## Data Fields

For each fishing entry date, fetch and populate:
- **Discharge** (parameter code 00060) → `flowRate` field (cfs)
- **Gage Height** (parameter code 00065) → `riverDepth` field (ft)

## USGS API

Daily Values endpoint:
```
https://waterservices.usgs.gov/nwis/dv/
  ?sites={station_id}
  &startDT={date}
  &endDT={date}
  &parameterCd=00060,00065
  &format=json
```

## Script Behavior

1. Parse all entries from `src/data/sampleData.ts`
2. For each entry:
   - Determine station based on `streamName` (Spring River → 07069305, Eleven Point → 07072000)
   - Fetch USGS daily values for that date
   - Update `flowRate` and `riverDepth` fields
   - Overwrite existing values with USGS data (USGS is source of truth)
3. Write updated data back to `sampleData.ts`
4. Print summary of results

## Error Handling

- **Missing USGS Data**: Log which dates had no data, leave field empty, continue processing
- **Rate Limiting**: 0.5s delay between API requests (~40 entries = ~20s total)
- **Backup**: Create backup of original `sampleData.ts` before overwriting

## Output

Script prints:
- Each entry processed with status (updated/no data)
- Summary: X entries updated, Y entries had no USGS data available

## File Location

Script: `scripts/backfill_water_data.py`

## Usage

```bash
cd /path/to/fishingbuddy
python scripts/backfill_water_data.py
```

## Implementation Notes

- Python chosen for simplicity and `requests` library
- Script is idempotent - can run multiple times safely
- All 39 fishing entries will be processed
- Entries from 1994 may have limited data availability (USGS digital records)
