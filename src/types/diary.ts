export interface DiaryEntry {
  id: string;
  originalText: string;
  date: string; // ISO date YYYY-MM-DD
  endDate?: string; // For multi-day trips
  anglers: string[];
  location: string;
  notes: string;
  
  // Flexible structured data extracted from text
  details: {
    weather?: string;
    waterConditions?: string;
    lures?: string[];
    speciesCaught?: {
      species: string;
      count?: number; // if determinable
      notes?: string;
    }[];
    totalCaught?: number;
  };
}


