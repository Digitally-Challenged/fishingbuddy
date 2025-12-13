import re

# Read the diary file
with open('docs/spring_river_fishing_diary.md', 'r') as f:
    content = f.read()

# Common fish species list (simplified matching)
species_list = [
    "Smallmouth Bass", "Smallmouth", "Smallie", "Spotted Bass", "Spot", "Black Bass", "Black", 
    "Largemouth Bass", "Largemouth", "Brownie", "Brown Trout", "Rainbow Trout", "Trout", 
    "Walleye", "Sauger", "Saugeye", "Shadow Bass", "Rock Bass", "Rocker", "Goggle Eye",
    "Bream", "Bluegill", "Sunfish", "Longear", "Green Sunfish", "Crappie", "White Crappie", 
    "Catfish", "Channel Catfish", "Drum", "Carp", "Gar", "Striper", "Hybrid Striped Bass"
]

# Common lures list
lure_list = [
    "Shad Rap", "BSR", "BCW", "Flicker Shad", "Crankbait", "Square Bill", "Cranker",
    "Jig", "Hair Jig", "Jig and Pig", "Jig and Peed", "GGO",
    "Centipede", "Tube", "Crawler", "Nightcrawler", "Worm", "Plastic Worm", "Spoon", "Minnow"
]

found_species = set()
found_lures = set()

# Normalize and search
content_lower = content.lower()

for species in species_list:
    if species.lower() in content_lower:
        found_species.add(species)

for lure in lure_list:
    if lure.lower() in content_lower:
        found_lures.add(lure)

print("--- SPECIES ---")
for s in sorted(list(found_species)):
    print(s)

print("\n--- LURES ---")
for l in sorted(list(found_lures)):
    print(l)








