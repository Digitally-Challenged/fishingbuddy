/**
 * Fish and lure icon utilities
 * Maps species/bait names to optimized icon paths
 */

export type IconSize = 'sm' | 'md' | 'lg';

// Species name (lowercase) -> icon filename (without extension)
const fishIconMap: Record<string, string> = {
  // Game Fish
  'largemouth bass': 'largemouth-bass-icon',
  'smallmouth bass': 'smallmouth-bass-icon',
  'spotted bass': 'spotted-bass-icon',
  'black bass': 'largemouth-bass-icon',
  'white bass': 'white-bass-icon',
  'striped bass': 'striped-bass-icon',
  'striper': 'striped-bass-icon',
  'hybrid striped bass': 'hybrid-striped-bass-icon',
  'hybrid striper': 'hybrid-striped-bass-icon',
  'walleye': 'walleye-icon',
  'sauger': 'sauger-icon',
  'saugeye': 'sauger-icon',
  'rainbow trout': 'rainbow-trout-icon',
  'brown trout': 'brown-trout-icon',
  'cutthroat trout': 'cutthroat-trout-icon',
  'brook trout': 'brook-trout-icon',
  'crappie': 'crappie-icon',
  'white crappie': 'white-crappie-icon',
  'black crappie': 'black-crappie-icon',

  // Panfish
  'bluegill': 'bluegill-sunfish-icon',
  'bream': 'bluegill-sunfish-icon',
  'green sunfish': 'green-sunfish-icon',
  'longear sunfish': 'redear-sunfish-icon',
  'redear sunfish': 'redear-sunfish-icon',
  'rock bass': 'shadow-bass-icon', // shadow bass = rock bass
  'warmouth': 'warmouth-icon',
  'yellow perch': 'yellow-perch-icon',

  // Catfish
  'blue catfish': 'blue-catfish-icon',
  'channel catfish': 'channel-catfish-icon',
  'flathead catfish': 'flathead-catfish-icon',
  'bullhead catfish': 'bullhead-catfish-icon',

  // Rough Fish
  'common carp': 'common-carp-icon',
  'carp': 'carp-icon',
  'grass carp': 'grass-carp-icon',
  'buffalo': 'buffalo-icon',
  'drum': 'drum-icon',
  'freshwater drum': 'drum-icon',
  'gar': 'gar-icon',
  'longnose gar': 'gar-icon',
  'shortnose gar': 'gar-icon',
  'alligator gar': 'alligator-gar-icon',
  'bowfin': 'bowfin-icon',

  // Bonus/Other
  'shadow bass': 'shadow-bass-icon',
  'catfish': 'catfish-icon',
};

// Keyword -> lure icon filename (without extension)
// Order matters: more specific matches should come first
const lureKeywords: Record<string, string> = {
  // Crankbaits and diving lures - specific colors first
  'perch shad rap': 'perch-shad-rap-icon',
  'blue/white shad rap': 'shad-rap-icon',
  'shad rap': 'shad-rap-icon',
  'rapala': 'shad-rap-icon',
  'flicker shad': 'flicker-shad-icon',
  'bcw': 'bcw-crankbait-icon',
  'crankbait': 'square-bill-icon',
  'square bill': 'square-bill-icon',
  'squarebill': 'square-bill-icon',
  'cranker': 'square-bill-icon',

  // Topwater
  'whopper plopper': 'whopper-plopper-icon',
  'plopper': 'whopper-plopper-icon',
  'frog': 'topwater-frog-icon',
  'topwater': 'whopper-plopper-icon',

  // Jigs - specific types/colors first (order matters!)
  'jig and pig': 'jig-and-pig-icon',
  'jig and peed': 'jig-and-pig-icon', // diary spelling
  'jigging spoon': 'spoon-icon',
  'jigging': 'spoon-icon',
  'hair jig': 'hair-jig-icon',
  'ned rig': 'ned-rig-icon',
  'gray/red': 'jig-skirted-gray-red-icon',
  'green pumpkin': 'jig-skirted-green-pumpkin-icon',
  'jig': 'jig-skirted-icon',

  // Centipedes - color variants first
  'cotton candy centipede': 'centipede-cotton-candy-icon',
  'cotton candy': 'centipede-cotton-candy-icon',
  'gord green orange': 'centipede-gord-green-orange-icon',
  'green orange': 'centipede-gord-green-orange-icon',
  'watermelon red': 'centipede-watermelon-red-icon',
  'centipede': 'centipede-icon',

  // Other soft plastics
  'worm': 'soft-plastic-worm-icon',
  'senko': 'soft-plastic-worm-icon',
  'tube': 'tube-lure-icon',
  'wacky': 'wacky-rig-icon',
  'drop shot': 'drop-shot-icon',

  // Live bait and natural
  'nightcrawler': 'nightcrawler-icon',
  'crawler rig': 'crawler-rig-icon',
  'crawler': 'crawler-rig-icon',
  'leech': 'leech-icon',
  'cricket': 'live-cricket-icon',
  'powerbait': 'powerbait-eggs-icon',
  'eggs': 'powerbait-eggs-icon',

  // Rigs
  'carolina': 'carolina-rig-icon',
  't-rig': 'soft-plastic-worm-icon',
  'texas rig': 'soft-plastic-worm-icon',

  // Spoons and spinners
  'spinnerbait': 'spinnerbait-icon',
  'spinner': 'spinnerbait-icon',
  'spoon': 'spoon-icon',
};

/**
 * Get the icon path for a fish species
 * @param species - The fish species name
 * @param size - Icon size: 'sm' (32px), 'md' (64px), or 'lg' (128px)
 * @returns Path to the WebP icon, or null if no icon exists
 */
export function getFishIconPath(
  species: string,
  size: IconSize = 'sm'
): string | null {
  if (!species) return null;

  const normalized = species.toLowerCase().trim();
  const iconName = fishIconMap[normalized];

  return iconName ? `/icons/${size}/${iconName}.webp` : null;
}

// Icons that are PNG format (new uploads)
const pngIcons = new Set([
  'jig-and-pig-icon',
  'hair-jig-icon',
  'centipede-icon',
  'centipede-cotton-candy-icon',
  'centipede-gord-green-orange-icon',
  'centipede-watermelon-red-icon',
  'crawler-rig-icon',
  'nightcrawler-icon',
  'carolina-rig-icon',
  'drop-shot-icon',
  'ned-rig-icon',
  'wacky-rig-icon',
  'live-cricket-icon',
  'powerbait-eggs-icon',
  // New icons batch
  'bcw-crankbait-icon',
  'flicker-shad-icon',
  'jig-skirted-gray-red-icon',
  'jig-skirted-green-pumpkin-icon',
  'leech-icon',
  'perch-shad-rap-icon',
  'topwater-frog-icon',
  'whopper-plopper-icon',
]);

/**
 * Get the icon path for a lure/bait (fuzzy keyword matching)
 * @param bait - The bait description
 * @param size - Icon size: 'sm' (32px), 'md' (64px), or 'lg' (128px)
 * @returns Path to the icon, or null if no matching keyword found
 */
export function getLureIconPath(
  bait: string,
  size: IconSize = 'sm'
): string | null {
  if (!bait) return null;

  const normalized = bait.toLowerCase();

  for (const [keyword, iconName] of Object.entries(lureKeywords)) {
    if (normalized.includes(keyword)) {
      const ext = pngIcons.has(iconName) ? 'png' : 'webp';
      return `/icons/${size}/${iconName}.${ext}`;
    }
  }

  return null;
}

/**
 * Get pixel size for an icon size name
 */
export function getIconPxSize(size: IconSize): number {
  const sizes: Record<IconSize, number> = {
    sm: 24,
    md: 40,
    lg: 64,
  };
  return sizes[size];
}
