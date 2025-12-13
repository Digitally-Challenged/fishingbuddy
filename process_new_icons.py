import os
from rembg import remove

ICONS_DIR = "public/icons"

# Files that need processing (added after 20:42, larger file sizes)
# and cleanup of duplicates
unprocessed_files = [
    "white-bass-icon.png",
    "yellow-perch-icon.png",
    "bullhead-catfish-icon (1).png",
    "blue-catfish-icon (1).png",
    "channel-catfish-icon.png",
    "cutthroat-trout-icon.png",
    "brook-trout-icon (1).png",
    "flathead-catfish-icon.png",
    "alligator-gar-icon.png",
    "buffalo-icon.png",
    "common-carp-icon (2).png",
    "warmouth-icon (1).png",
    "sauger-icon.png",
    "bowfin-icon.png",
    "redear-sunfish-icon (1).png",
    "grass-carp-icon (1).png",
    "hybrid-striped-bass-icon.png",
    "green-sunfish-icon.png",
    "white-crappie-icon.png",
    "black-crappie-icon.png",
]

# Files to delete (duplicates)
duplicates_to_delete = [
    "largemouth-bass-icon (1).png",
    "cutthroat-trout-icon (1).png",
    "hybrid-striped-bass-icon (1).png",
]

# Files to rename after processing (remove numbering)
rename_map = {
    "bullhead-catfish-icon (1).png": "bullhead-catfish-icon.png",
    "blue-catfish-icon (1).png": "blue-catfish-icon.png",
    "brook-trout-icon (1).png": "brook-trout-icon.png",
    "common-carp-icon (2).png": "common-carp-icon.png",
    "warmouth-icon (1).png": "warmouth-icon.png",
    "redear-sunfish-icon (1).png": "redear-sunfish-icon.png",
    "grass-carp-icon (1).png": "grass-carp-icon.png",
}

print("Step 1: Processing new icons to remove backgrounds...")
processed_count = 0

for filename in unprocessed_files:
    file_path = os.path.join(ICONS_DIR, filename)
    if not os.path.exists(file_path):
        print(f"  ⚠ Skipping (not found): {filename}")
        continue

    try:
        print(f"  • Removing background: {filename}")

        with open(file_path, 'rb') as f:
            input_data = f.read()

        output_data = remove(input_data)

        with open(file_path, 'wb') as f:
            f.write(output_data)

        processed_count += 1
    except Exception as e:
        print(f"  ❌ Error processing {filename}: {e}")

print(f"\n✓ Processed {processed_count} icons")

print("\nStep 2: Deleting duplicates...")
for filename in duplicates_to_delete:
    file_path = os.path.join(ICONS_DIR, filename)
    if os.path.exists(file_path):
        os.remove(file_path)
        print(f"  • Deleted: {filename}")
    else:
        print(f"  ⚠ Already gone: {filename}")

print("\nStep 3: Renaming files to clean names...")
for old_name, new_name in rename_map.items():
    old_path = os.path.join(ICONS_DIR, old_name)
    new_path = os.path.join(ICONS_DIR, new_name)
    if os.path.exists(old_path):
        os.rename(old_path, new_path)
        print(f"  • Renamed: {old_name} -> {new_name}")
    else:
        print(f"  ⚠ Not found: {old_name}")

print("\n✨ Done!")
