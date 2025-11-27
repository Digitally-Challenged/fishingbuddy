import { USGSStation } from '../data/usgsStations';

export function getStationsByStreamName(streamName: string, stations: USGSStation[]): USGSStation[] {
  if (!streamName) return [];
  
  const normalizedStreamName = streamName.toLowerCase().replace(/\s+/g, ' ').trim();
  
  // Create a mapping of common stream name variations
  const streamMappings: { [key: string]: string[] } = {
    'white river': ['white river', 'white r', 'white riv'],
    'buffalo national river': ['buffalo', 'buffalo river', 'buffalo national'],
    'little red river': ['little red', 'little red river'],
    'spring river': ['spring river', 'spring r'],
    'kings river': ['kings river', 'kings r'],
    'ouachita river': ['ouachita river', 'ouachita r'],
    'arkansas river': ['arkansas river', 'ar river', 'ark river', 'ark r'],
    'mississippi river': ['mississippi river', 'mississippi r'],
    'black river': ['black river', 'black r'],
    'current river': ['current river', 'current r'],
    'eleven point river': ['eleven point', 'eleven point river'],
    'strawberry river': ['strawberry river', 'strawberry r'],
    'cache river': ['cache river', 'cache r'],
    'st. francis river': ['st. francis', 'saint francis', 'st francis'],
    'l\'anguille river': ['l\'anguille', 'languille', 'l\'anguille river'],
  };

  // Find matching variations for the selected stream
  const searchTerms = [normalizedStreamName];
  Object.entries(streamMappings).forEach(([key, variations]) => {
    if (key === normalizedStreamName || variations.includes(normalizedStreamName)) {
      searchTerms.push(...variations);
    }
  });

  return stations.filter(station => {
    const stationName = station.stationName.toLowerCase();
    return searchTerms.some(term => stationName.includes(term));
  });
}

export function formatStationName(station: USGSStation): string {
  return `${station.stationName} (${station.stationNumber})`;
}

export function getUSGSDataUrl(stationNumber: string): string {
  return `https://waterdata.usgs.gov/nwis/uv?site_no=${stationNumber}`;
}