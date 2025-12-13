import os
from rembg import remove

# Process existing icons in public/icons/
ICONS_DIR = "public/icons"

print(f"Processing images in '{ICONS_DIR}' to remove backgrounds...")

processed_count = 0
for filename in os.listdir(ICONS_DIR):
    if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
        file_path = os.path.join(ICONS_DIR, filename)

        # Output will always be .png for transparency
        output_filename = os.path.splitext(filename)[0] + ".png"
        output_path = os.path.join(ICONS_DIR, output_filename)

        try:
            print(f"  • Removing background: {filename}")

            # Open image
            with open(file_path, 'rb') as i:
                input_data = i.read()

            # Remove background
            output_data = remove(input_data)

            # Save result
            with open(output_path, 'wb') as o:
                o.write(output_data)

            processed_count += 1

        except Exception as e:
            print(f"  ❌ Error processing {filename}: {e}")

print(f"\n✨ Done! Processed {processed_count} icons.")
print(f"Your transparent icons are ready in: {ICONS_DIR}")
