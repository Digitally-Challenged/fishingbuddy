export const fishSpecies = {
  // Game Fish
  gameFish: [
    'Largemouth Bass',
    'Smallmouth Bass',
    'Spotted Bass',
    'White Bass',
    'Striped Bass',
    'Hybrid Striped Bass',
    'Walleye',
    'Rainbow Trout',
    'Brown Trout',
    'Cutthroat Trout',
    'Brook Trout',
    'Crappie',
    'White Crappie',
    'Black Crappie',
  ] as const,

  // Panfish
  panfish: [
    'Bluegill',
    'Green Sunfish',
    'Redear Sunfish',
    'Rock Bass',
    'Warmouth',
    'Yellow Perch',
  ] as const,

  // Catfish
  catfish: [
    'Blue Catfish',
    'Channel Catfish',
    'Flathead Catfish',
    'Bullhead Catfish',
  ] as const,

  // Rough Fish
  roughFish: [
    'Common Carp',
    'Grass Carp',
    'Buffalo',
    'Drum',
    'Gar',
    'Bowfin',
  ] as const,
} as const;

// Create union type of all fish species
export type FishSpecies = 
  | typeof fishSpecies.gameFish[number]
  | typeof fishSpecies.panfish[number]
  | typeof fishSpecies.catfish[number]
  | typeof fishSpecies.roughFish[number];

// Get all fish species as a flat array
export const allFishSpecies = [
  ...fishSpecies.gameFish,
  ...fishSpecies.panfish,
  ...fishSpecies.catfish,
  ...fishSpecies.roughFish,
] as const;

// Utility function to check if a string is a valid fish species
export function isFishSpecies(species: string): species is FishSpecies {
  return allFishSpecies.includes(species as FishSpecies);
}