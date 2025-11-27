export const allArkansasStreams = [
  'Alum Fork Saline River',
  'Antoine Creek',
  'Arkansas River',
  'Baron Fork',
  'Bayou Bartholomew',
  'Bayou DeView',
  'Bayou Meto',
  'Bayou Two Prairie',
  'Bear Bayou',
  'Bear Creek',
  'Bennetts River',
  'Big Creek',
  'Big Piney Creek',
  'Black River',
  'Board Camp Creek',
  'Boeuf River',
  'Bringle Creek',
  'Brushy Creek',
  'Buffalo National River',
  'Caddo River',
  'Cadron Creek',
  'Cache River',
  'Cossatot River',
  'Crooked Creek',
  'Current River',
  'Cutoff Creek',
  'Cypress Creek',
  'Deep Bayou',
  'Dry Creek',
  'Dutch Creek',
  'Eleven Point River',
  'Fish Lake Ditch',
  'Flint Creek',
  'Fourche Creek',
  'Fourche LaFave River',
  'Frog Bayou',
  'Gap Creek',
  'Glaise Creek',
  'Gulpha Creek',
  'Hot Springs Creek',
  'Hurricane Creek',
  'Illinois Bayou',
  'Illinois River',
  'Jack Creek',
  'James Fork',
  'Jones Creek',
  'Kings River',
  'L\'Anguille River',
  'Lee Creek',
  'Little Buffalo River',
  'Little Lee Creek',
  'Little Missouri River',
  'Little Piney Creek',
  'Little Red River',
  'Long Creek',
  'Mississippi River',
  'Moro Creek',
  'Mud Creek',
  'Mulberry River',
  'Norfork River',
  'North Fork River',
  'North Sylamore Creek',
  'Osage Creek',
  'Ouachita River',
  'Petit Jean River',
  'Poteau River',
  'Red River',
  'Reece Creek',
  'Richland Creek',
  'Rock Creek',
  'Rolling Fork',
  'Saline River',
  'Salt Bayou',
  'Seven-mile Ditch',
  'Smackover Creek',
  'South Alum Creek',
  'South Fork Spring River',
  'South Fourche LaFave River',
  'Spavinaw Creek',
  'Spring Creek',
  'Spring River',
  'Strawberry River',
  'Sylamore Creek',
  'Town Branch',
  'Tuckerman Ditch',
  'Wabbaseka Bayou',
  'War Eagle Creek',
  'West Fork Point Remove Creek',
  'West Fork White River',
  'White River',
  'Whittington Creek',
  'Yocum Creek',
  'Yount Creek'
] as const;

export type ArkansasStream = typeof allArkansasStreams[number];

// Utility function to check if a string is a valid Arkansas stream
export function isArkansasStream(stream: string): stream is ArkansasStream {
  return allArkansasStreams.includes(stream as ArkansasStream);
}

// Function to sort streams alphabetically
export function getSortedStreams(): ArkansasStream[] {
  return [...allArkansasStreams].sort();
}

// Function to get streams by search term
export function searchStreams(searchTerm: string): ArkansasStream[] {
  const term = searchTerm.toLowerCase();
  return allArkansasStreams.filter(stream => 
    stream.toLowerCase().includes(term)
  );
}

// Function to get streams containing specific words
export function getStreamsContaining(word: string): ArkansasStream[] {
  const searchWord = word.toLowerCase();
  return allArkansasStreams.filter(stream => 
    stream.toLowerCase().includes(searchWord)
  );
}

// Function to get all rivers (streams containing "River")
export function getAllRivers(): ArkansasStream[] {
  return getStreamsContaining('River');
}

// Function to get all creeks (streams containing "Creek")
export function getAllCreeks(): ArkansasStream[] {
  return getStreamsContaining('Creek');
}

// Function to get all bayous (streams containing "Bayou")
export function getAllBayous(): ArkansasStream[] {
  return getStreamsContaining('Bayou');
}

// Helper function to format stream name for display
export function formatStreamName(stream: ArkansasStream): string {
  return stream.replace(/([A-Z])/g, ' $1').trim();
}