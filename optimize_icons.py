"""
Optimize icons: Convert to WebP and generate multiple sizes.
Creates small, crisp versions for fast loading.
"""

import os
from PIL import Image

# Directories
SOURCE_DIR = "public/icons"
OUTPUT_BASE = "public/icons"

# Sizes to generate
SIZES = {
    "sm": 32,   # Table cells
    "md": 64,   # Modal, dropdowns
    "lg": 128,  # Dashboard, hero sections
}

def optimize_icons():
    # Create output directories
    for size_name in SIZES:
        os.makedirs(os.path.join(OUTPUT_BASE, size_name), exist_ok=True)

    # Also create full/ for originals backup
    full_dir = os.path.join(OUTPUT_BASE, "full")
    os.makedirs(full_dir, exist_ok=True)

    # Get all PNG files in source (exclude subdirectories)
    png_files = [f for f in os.listdir(SOURCE_DIR)
                 if f.lower().endswith('.png')
                 and os.path.isfile(os.path.join(SOURCE_DIR, f))]

    print(f"Processing {len(png_files)} icons...")

    for filename in sorted(png_files):
        source_path = os.path.join(SOURCE_DIR, filename)
        base_name = os.path.splitext(filename)[0]

        try:
            # Open original
            with Image.open(source_path) as img:
                # Ensure RGBA for transparency
                if img.mode != 'RGBA':
                    img = img.convert('RGBA')

                print(f"  • {filename}")

                # Move original to full/
                full_path = os.path.join(full_dir, filename)
                img.save(full_path, 'PNG', optimize=True)

                # Generate each size as WebP
                for size_name, size_px in SIZES.items():
                    # High-quality resize with antialiasing
                    resized = img.resize((size_px, size_px), Image.Resampling.LANCZOS)

                    # Save as WebP (smaller, good quality, supports transparency)
                    webp_filename = f"{base_name}.webp"
                    webp_path = os.path.join(OUTPUT_BASE, size_name, webp_filename)
                    resized.save(webp_path, 'WEBP', quality=90, method=6)

                    # Also save PNG fallback for older browsers
                    png_path = os.path.join(OUTPUT_BASE, size_name, filename)
                    resized.save(png_path, 'PNG', optimize=True)

        except Exception as e:
            print(f"  ❌ Error processing {filename}: {e}")

    # Remove original PNGs from root icons/ (now in full/)
    print("\nCleaning up root directory...")
    for filename in png_files:
        source_path = os.path.join(SOURCE_DIR, filename)
        if os.path.exists(source_path):
            os.remove(source_path)

    print("\n✨ Done!")
    print(f"\nGenerated sizes:")
    for size_name, size_px in SIZES.items():
        dir_path = os.path.join(OUTPUT_BASE, size_name)
        file_count = len([f for f in os.listdir(dir_path) if f.endswith('.webp')])
        print(f"  • {size_name}/ ({size_px}px): {file_count} icons")

    print(f"\nOriginals backed up to: {full_dir}/")
    print("\nUsage in code:")
    print('  <img src="/icons/sm/largemouth-bass-icon.webp" />')

if __name__ == "__main__":
    optimize_icons()
