# Weather Data Backfill Design

**Date:** 2025-12-03
**Status:** Approved

## Overview

Backfill historical weather data for 39 fishing journal entries (1994-2025) using parallel agents and the Open-Meteo Historical Weather API.

## Schema Changes

Add new fields to `FormData` interface:

```typescript
airTempHigh: string;        // High temperature in °F
airTempLow: string;         // Low temperature in °F
barometricPressure: string; // Pressure in inHg (e.g., "30.12")
moonPhase: string;          // "New Moon", "Waxing Crescent", "First Quarter",
                            // "Waxing Gibbous", "Full Moon", "Waning Gibbous",
                            // "Last Quarter", "Waning Crescent"
precipitation: string;      // Rainfall in inches
```

Also backfill existing empty fields:
- `windVelocity` (mph)
- `windDirection` (cardinal: N, NE, E, SE, S, SW, W, NW)

## Data Sources

| Data | Source | Method |
|------|--------|--------|
| Temperature, pressure, precipitation, wind | Open-Meteo Historical API | WebFetch |
| Moon phase | Mathematical calculation | Synodic month formula |

**Location:** Hardy, AR area (36.3°N, 91.5°W)

**Open-Meteo API URL:**
```
https://archive-api.open-meteo.com/v1/archive?
  latitude=36.3&longitude=-91.5
  &start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
  &daily=temperature_2m_max,temperature_2m_min,precipitation_sum,
         surface_pressure_mean,wind_speed_10m_max,wind_direction_10m_dominant
  &temperature_unit=fahrenheit&precipitation_unit=inch
```

## Agent Architecture

4 parallel agents organized by decade:

| Agent | Decade | Entry Count | Date Range |
|-------|--------|-------------|------------|
| Agent 1 | 1990s | 3 | 1994-10-07 to 1998-10-11 |
| Agent 2 | 2000s | 9 | 2002-02-15 to 2007-11-12 |
| Agent 3 | 2010s | 17 | 2010-09-20 to 2019-05-25 |
| Agent 4 | 2020s | 10 | 2021-11-13 to 2025-11-08 |

Each agent:
1. Receives list of dates to process
2. Fetches Open-Meteo data for each date
3. Calculates moon phase mathematically
4. Converts units (hPa → inHg, degrees → cardinal direction)
5. Returns structured JSON results

## Moon Phase Calculation

Based on synodic month (29.53059 days) from reference New Moon (Jan 6, 2000):

| Days in Cycle | Phase |
|---------------|-------|
| 0-1.85 | New Moon |
| 1.85-7.38 | Waxing Crescent |
| 7.38-9.23 | First Quarter |
| 9.23-14.77 | Waxing Gibbous |
| 14.77-16.61 | Full Moon |
| 16.61-22.15 | Waning Gibbous |
| 22.15-24.00 | Last Quarter |
| 24.00-29.53 | Waning Crescent |

## Unit Conversions

- **Pressure:** hPa × 0.02953 = inHg
- **Wind Direction:** Degrees → Cardinal (0°=N, 45°=NE, 90°=E, etc.)

## Implementation Steps

1. Update `src/types/index.ts` with new fields
2. Spawn 4 parallel agents by decade
3. Each agent fetches and returns weather data
4. Merge results into `src/data/sampleData.ts`
5. Verify build succeeds
