#!/usr/bin/env python3
"""
Image Optimizer with AI Background Removal

Removes backgrounds from images using rembg, then converts to WebP
and generates multiple sizes.

Usage:
    python optimize_with_bg_removal.py <input_dir> <output_dir>
    python optimize_with_bg_removal.py ./raw-icons ./public/icons

Requires:
    pip install pillow rembg[cpu]

For GPU acceleration (much faster):
    pip install pillow rembg[gpu]
"""

import os
import sys
from PIL import Image
from pathlib import Path

try:
    from rembg import remove
except ImportError:
    print("Error: rembg not installed. Run: pip install rembg[cpu]")
    sys.exit(1)

# Default sizes to generate
DEFAULT_SIZES = {
    'sm': 32,    # Table cells, small icons
    'md': 64,    # List items, cards
    'lg': 128,   # Modals, hero sections
}


def remove_background(input_path: str) -> Image.Image:
    """
    Remove background from an image using AI.

    Args:
        input_path: Path to the input image

    Returns:
        PIL Image with transparent background
    """
    with open(input_path, 'rb') as f:
        input_data = f.read()

    output_data = remove(input_data)

    from io import BytesIO
    return Image.open(BytesIO(output_data))


def optimize_with_bg_removal(
    input_dir: str,
    output_dir: str,
    sizes: dict[str, int] = None,
    quality: int = 90,
    extensions: tuple = ('.png', '.jpg', '.jpeg', '.webp')
):
    """
    Remove backgrounds and optimize images.

    Args:
        input_dir: Directory containing source images
        output_dir: Base output directory
        sizes: Dict of {name: pixel_size}
        quality: WebP quality (1-100)
        extensions: File extensions to process
    """
    if sizes is None:
        sizes = DEFAULT_SIZES

    input_dir = Path(input_dir)
    output_dir = Path(output_dir)

    # Create output directories
    for size_name in sizes:
        (output_dir / size_name).mkdir(parents=True, exist_ok=True)
    (output_dir / 'full').mkdir(parents=True, exist_ok=True)

    # Find all image files
    image_files = [
        f for f in input_dir.iterdir()
        if f.is_file() and f.suffix.lower() in extensions
    ]

    print(f"Processing {len(image_files)} images with background removal...")
    print(f"This may take a while on first run (downloading AI model)...\n")

    processed = 0
    errors = 0

    for img_path in sorted(image_files):
        try:
            print(f"  • {img_path.name}")

            # Remove background using AI
            img = remove_background(str(img_path))

            # Ensure RGBA for transparency
            if img.mode != 'RGBA':
                img = img.convert('RGBA')

            base_name = img_path.stem

            # Save original (with background removed) to full/
            full_path = output_dir / 'full' / f"{base_name}.png"
            img.save(full_path, 'PNG', optimize=True)

            # Generate each size
            for size_name, size_px in sizes.items():
                # High-quality resize
                resized = img.resize((size_px, size_px), Image.Resampling.LANCZOS)

                # Save WebP (primary - small and fast)
                webp_path = output_dir / size_name / f"{base_name}.webp"
                resized.save(webp_path, 'WEBP', quality=quality, method=6)

                # Save PNG (fallback for older browsers)
                png_path = output_dir / size_name / f"{base_name}.png"
                resized.save(png_path, 'PNG', optimize=True)

            processed += 1

        except Exception as e:
            print(f"  ❌ Error: {e}")
            errors += 1

    # Summary
    print(f"\n✨ Done!")
    print(f"   Processed: {processed}")
    if errors > 0:
        print(f"   Errors: {errors}")

    print(f"\nOutput structure:")
    for size_name, size_px in sizes.items():
        print(f"  • {output_dir}/{size_name}/ ({size_px}px WebP + PNG)")
    print(f"  • {output_dir}/full/ (originals, background removed)")


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        print("\nUsage: python optimize_with_bg_removal.py <input_dir> <output_dir>")
        print("\nExample:")
        print("  python optimize_with_bg_removal.py ./raw-icons ./public/icons")
        sys.exit(1)

    input_dir = sys.argv[1]
    output_dir = sys.argv[2]

    # Optional: custom sizes from command line
    sizes = DEFAULT_SIZES
    if len(sys.argv) > 3:
        # Parse sizes like "32,64,128"
        size_list = [int(s) for s in sys.argv[3].split(',')]
        size_names = ['sm', 'md', 'lg', 'xl']
        sizes = {size_names[i]: px for i, px in enumerate(size_list) if i < len(size_names)}

    if not os.path.isdir(input_dir):
        print(f"Error: Input directory not found: {input_dir}")
        sys.exit(1)

    optimize_with_bg_removal(input_dir, output_dir, sizes)


if __name__ == '__main__':
    main()
