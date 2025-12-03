import re
import json
import uuid
from datetime import datetime

def parse_date(date_str):
    # Normalize
    date_str = date_str.strip()
    
    # Handle "04-07 October 2018"
    match_full_text = re.match(r'(\d+)-(\d+)\s+([A-Za-z]+)\s+(\d{4})', date_str)
    if match_full_text:
        d1, d2, month, year = match_full_text.groups()
        try:
            dt1 = datetime.strptime(f"{d1} {month} {year}", "%d %B %Y")
            dt2 = datetime.strptime(f"{d2} {month} {year}", "%d %B %Y")
            return dt1.strftime("%Y-%m-%d"), dt2.strftime("%Y-%m-%d")
        except:
            pass

    # Handle "2/16-19/2014"
    match_range_slashes = re.match(r'(\d+)/(\d+)-(\d+)/(\d{4})', date_str)
    if match_range_slashes:
        m, d1, d2, y = match_range_slashes.groups()
        return f"{y}-{m.zfill(2)}-{d1.zfill(2)}", f"{y}-{m.zfill(2)}-{d2.zfill(2)}"

    # Handle standard "10/7/1994" or "2/15/2002, Fri"
    # Remove day names
    clean_date = re.sub(r',\s*[A-Za-z]+', '', date_str).strip()
    
    try:
        dt = datetime.strptime(clean_date, "%m/%d/%Y")
        return dt.strftime("%Y-%m-%d"), None
    except:
        pass
        
    try:
        dt = datetime.strptime(clean_date, "%m-%d-%Y") # if separators differ
        return dt.strftime("%Y-%m-%d"), None
    except:
        pass

    return date_str, None

def parse_line(line):
    # Regex to split: Date – Anglers – Content
    # Use en-dash or hyphen
    print(f"Processing: {line[:50]}...")
    parts = re.split(r'\s*[–-]\s*', line, maxsplit=2)
    print(f"Parts found: {len(parts)}")
    
    if len(parts) < 3:
        # Try finding date another way or skip
        return None
        
    date_str = parts[0]
    anglers_str = parts[1]
    content_str = parts[2]
    
    date_iso, end_date_iso = parse_date(date_str)
    
    anglers = [a.strip() for a in anglers_str.split('/')]
    
    # Extract location from content (usually at start, ended by comma or similar)
    location = "Spring River" # default
    notes = content_str
    
    if content_str.startswith("Spring River"):
        location = "Spring River"
    elif content_str.startswith("Eleven Point River"):
        location = "Eleven Point River"
    elif content_str.startswith("Strawberry River"):
        location = "Strawberry River"
    
    # Extract some details
    lures = []
    if "Shad Rap" in content_str: lures.append("Shad Rap")
    if "jig" in content_str.lower(): lures.append("Jig")
    if "spoon" in content_str.lower(): lures.append("Spoon")
    
    weather = []
    if "sunny" in content_str.lower(): weather.append("Sunny")
    if "cloudy" in content_str.lower(): weather.append("Cloudy")
    if "rain" in content_str.lower(): weather.append("Rain")
    if "wind" in content_str.lower(): weather.append("Windy")
    if "cool" in content_str.lower(): weather.append("Cool")
    if "warm" in content_str.lower(): weather.append("Warm")
    
    entry = {
        "id": str(uuid.uuid4()),
        "originalText": line,
        "date": date_iso,
        "anglers": anglers,
        "location": location,
        "notes": content_str,
        "details": {
            "lures": lures,
            "weather": ", ".join(weather) if weather else None,
            "speciesCaught": [] # Placeholder
        }
    }
    
    if end_date_iso:
        entry["endDate"] = end_date_iso
        
    return entry

entries = []
with open("docs/spring_river_fishing_diary.md", "r") as f:
    for line in f:
        print(f"Read line: '{line.strip()}'")
        line = line.strip()
        if not line:
            continue
        if not line[0].isdigit():
            print("Skipping non-digit start")
            continue
        entry = parse_line(line)
        if entry:
            entries.append(entry)

print(json.dumps(entries, indent=2))

