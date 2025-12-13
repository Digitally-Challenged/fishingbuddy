#!/usr/bin/env python3
"""
Image Optimizer: Convert images to WebP and generate multiple sizes.

Usage:
    python optimize_images.py --input ./source --output ./dest
    python optimize_images.py --input ./source --output ./dest --sizes 32,64,128,256
    python optimize_images.py --input ./source --output ./dest --quality 85

Examples:
    # Icons
    python optimize_images.py -i ./raw-icons -o ./public/icons -s 24,32,48,64

    # Product images
    python optimize_images.py -i ./products -o ./public/products -s 64,128,256,512 -q 85

    # Blog images
    python optimize_images.py -i ./content -o ./public/blog -s 320,640,1024,1920 -q 80
"""

import os
import argparse
from PIL import Image
from pathlib import Path

# Default sizes to generate
DEFAULT_SIZES = {
    'sm': 32,    # Icons, thumbnails
    'md': 64,    # List items, cards
    'lg': 128,   # Hero images, modals
    'xl': 256,   # Full-size previews
}


def optimize_image(
    input_path: str,
    output_dir: str,
    sizes: dict[str, int],
    quality: int = 90,
    keep_originals: bool = True
) -> dict:
    """
    Optimize a single image: resize and convert to WebP.

    Args:
        input_path: Path to source image
        output_dir: Base output directory
        sizes: Dict of {name: pixel_size}
        quality: WebP quality (1-100)
        keep_originals: Whether to copy originals to full/ subdirectory

    Returns:
        Dict with paths to generated files
    """
    input_path = Path(input_path)
    output_dir = Path(output_dir)

    # Get base filename without extension
    base_name = input_path.stem

    results = {'original': str(input_path), 'generated': {}}

    with Image.open(input_path) as img:
        # Convert to RGBA for transparency support
        if img.mode != 'RGBA':
            img = img.convert('RGBA')

        # Save original if requested
        if keep_originals:
            full_dir = output_dir / 'full'
            full_dir.mkdir(parents=True, exist_ok=True)
            original_path = full_dir / f"{base_name}.png"
            img.save(original_path, 'PNG', optimize=True)
            results['generated']['full'] = str(original_path)

        # Generate each size
        for size_name, size_px in sizes.items():
            size_dir = output_dir / size_name
            size_dir.mkdir(parents=True, exist_ok=True)

            # Resize with high-quality resampling
            resized = img.resize((size_px, size_px), Image.Resampling.LANCZOS)

            # Save as WebP (primary)
            webp_path = size_dir / f"{base_name}.webp"
            resized.save(webp_path, 'WEBP', quality=quality, method=6)
            results['generated'][f'{size_name}_webp'] = str(webp_path)

            # Save as PNG (fallback for older browsers)
            png_path = size_dir / f"{base_name}.png"
            resized.save(png_path, 'PNG', optimize=True)
            results['generated'][f'{size_name}_png'] = str(png_path)

    return results


def optimize_directory(
    input_dir: str,
    output_dir: str,
    sizes: dict[str, int] = None,
    quality: int = 90,
    extensions: tuple = ('.png', '.jpg', '.jpeg', '.webp', '.gif')
) -> list[dict]:
    """
    Optimize all images in a directory.

    Args:
        input_dir: Directory containing source images
        output_dir: Base output directory
        sizes: Dict of {name: pixel_size}, uses DEFAULT_SIZES if None
        quality: WebP quality (1-100)
        extensions: File extensions to process

    Returns:
        List of results from optimize_image()
    """
    if sizes is None:
        sizes = DEFAULT_SIZES

    input_dir = Path(input_dir)
    results = []

    # Find all image files
    image_files = [
        f for f in input_dir.iterdir()
        if f.is_file() and f.suffix.lower() in extensions
    ]

    print(f"Processing {len(image_files)} images...")

    for img_path in sorted(image_files):
        try:
            print(f"  • {img_path.name}")
            result = optimize_image(
                str(img_path),
                output_dir,
                sizes,
                quality
            )
            results.append(result)
        except Exception as e:
            print(f"  ❌ Error: {e}")
            results.append({'original': str(img_path), 'error': str(e)})

    return results


def main():
    parser = argparse.ArgumentParser(
        description='Optimize images: convert to WebP and generate multiple sizes'
    )
    parser.add_argument(
        '--input', '-i',
        required=True,
        help='Input directory containing images'
    )
    parser.add_argument(
        '--output', '-o',
        required=True,
        help='Output directory for optimized images'
    )
    parser.add_argument(
        '--sizes', '-s',
        default='32,64,128,256',
        help='Comma-separated sizes to generate (default: 32,64,128,256)'
    )
    parser.add_argument(
        '--quality', '-q',
        type=int,
        default=90,
        help='WebP quality 1-100 (default: 90)'
    )
    parser.add_argument(
        '--no-originals',
        action='store_true',
        help='Do not keep original files in full/ directory'
    )

    args = parser.parse_args()

    # Parse sizes into named dict
    size_list = [int(s.strip()) for s in args.sizes.split(',')]
    size_names = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl']
    sizes = {}
    for i, size_px in enumerate(size_list):
        name = size_names[i] if i < len(size_names) else f's{size_px}'
        sizes[name] = size_px

    # Run optimization
    results = optimize_directory(
        args.input,
        args.output,
        sizes,
        args.quality
    )

    # Summary
    successful = len([r for r in results if 'error' not in r])
    print(f"\n✨ Done! Processed {successful}/{len(results)} images")
    print(f"\nOutput structure:")
    for size_name, size_px in sizes.items():
        print(f"  • {args.output}/{size_name}/ ({size_px}px)")
    if not args.no_originals:
        print(f"  • {args.output}/full/ (originals)")


if __name__ == '__main__':
    main()
