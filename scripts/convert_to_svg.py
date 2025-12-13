#!/usr/bin/env python3
"""
Raster to SVG Converter using vtracer

Converts PNG/JPG images to SVG format using auto-tracing.
Best for: logos, simple icons, silhouettes
Poor for: photos, detailed illustrations, gradients

Usage:
    python convert_to_svg.py <input_dir> <output_dir>
    python convert_to_svg.py ./logos ./public/logos

Requires:
    pip install vtracer

Note: vtracer is a Python binding for the Rust vtracer library.
It produces better results than potrace for most images.
"""

import os
import sys
from pathlib import Path

try:
    import vtracer
except ImportError:
    print("Error: vtracer not installed. Run: pip install vtracer")
    sys.exit(1)


def convert_to_svg(
    input_path: str,
    output_path: str,
    color_mode: str = 'color',
    hierarchical: str = 'stacked',
    filter_speckle: int = 4,
    color_precision: int = 6,
    layer_difference: int = 16,
    corner_threshold: int = 60,
    length_threshold: float = 4.0,
    max_iterations: int = 10,
    splice_threshold: int = 45,
    path_precision: int = 3
):
    """
    Convert a raster image to SVG.

    Args:
        input_path: Path to input PNG/JPG
        output_path: Path for output SVG
        color_mode: 'color' or 'binary' (black & white)
        hierarchical: 'stacked' (layers) or 'cutout' (cookie-cutter)
        filter_speckle: Remove specks smaller than X pixels
        color_precision: Number of colors (1-8, higher = more colors)
        layer_difference: Color difference threshold for layers
        corner_threshold: Angle threshold for corners (degrees)
        length_threshold: Minimum path segment length
        max_iterations: Max iterations for color clustering
        splice_threshold: Angle threshold for splicing paths
        path_precision: Decimal precision for path coordinates
    """
    vtracer.convert_image_to_svg_py(
        input_path,
        output_path,
        colormode=color_mode,
        hierarchical=hierarchical,
        filter_speckle=filter_speckle,
        color_precision=color_precision,
        layer_difference=layer_difference,
        corner_threshold=corner_threshold,
        length_threshold=length_threshold,
        max_iterations=max_iterations,
        splice_threshold=splice_threshold,
        path_precision=path_precision
    )


def convert_directory(
    input_dir: str,
    output_dir: str,
    preset: str = 'detailed',
    extensions: tuple = ('.png', '.jpg', '.jpeg', '.webp')
):
    """
    Convert all images in a directory to SVG.

    Args:
        input_dir: Directory containing source images
        output_dir: Directory for output SVGs
        preset: Quality preset ('simple', 'detailed', 'photo')
        extensions: File extensions to process
    """
    # Presets for different use cases
    presets = {
        'simple': {
            # Best for logos, simple icons
            'color_precision': 4,
            'filter_speckle': 8,
            'layer_difference': 32,
            'corner_threshold': 60,
        },
        'detailed': {
            # Best for illustrations with some detail
            'color_precision': 6,
            'filter_speckle': 4,
            'layer_difference': 16,
            'corner_threshold': 45,
        },
        'photo': {
            # Attempt at photo-realistic (large files!)
            'color_precision': 8,
            'filter_speckle': 2,
            'layer_difference': 8,
            'corner_threshold': 30,
        }
    }

    settings = presets.get(preset, presets['detailed'])

    input_dir = Path(input_dir)
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Find all image files
    image_files = [
        f for f in input_dir.iterdir()
        if f.is_file() and f.suffix.lower() in extensions
    ]

    print(f"Converting {len(image_files)} images to SVG (preset: {preset})...")
    print(f"Settings: {settings}\n")

    processed = 0
    errors = 0

    for img_path in sorted(image_files):
        try:
            print(f"  • {img_path.name}")

            output_path = output_dir / f"{img_path.stem}.svg"

            convert_to_svg(
                str(img_path),
                str(output_path),
                **settings
            )

            # Report file size
            svg_size = output_path.stat().st_size
            img_size = img_path.stat().st_size
            print(f"    → {output_path.name} ({svg_size/1024:.1f}KB from {img_size/1024:.1f}KB)")

            processed += 1

        except Exception as e:
            print(f"  ❌ Error: {e}")
            errors += 1

    print(f"\n✨ Done!")
    print(f"   Converted: {processed}")
    if errors > 0:
        print(f"   Errors: {errors}")
    print(f"   Output: {output_dir}/")


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        print("\nUsage: python convert_to_svg.py <input_dir> <output_dir> [preset]")
        print("\nPresets:")
        print("  simple   - Logos, simple icons (smaller files)")
        print("  detailed - Illustrations with moderate detail (default)")
        print("  photo    - Photo-realistic attempt (large files!)")
        print("\nExamples:")
        print("  python convert_to_svg.py ./logos ./public/logos simple")
        print("  python convert_to_svg.py ./icons ./public/icons detailed")
        sys.exit(1)

    input_dir = sys.argv[1]
    output_dir = sys.argv[2]
    preset = sys.argv[3] if len(sys.argv) > 3 else 'detailed'

    if not os.path.isdir(input_dir):
        print(f"Error: Input directory not found: {input_dir}")
        sys.exit(1)

    if preset not in ('simple', 'detailed', 'photo'):
        print(f"Warning: Unknown preset '{preset}', using 'detailed'")
        preset = 'detailed'

    convert_directory(input_dir, output_dir, preset)


if __name__ == '__main__':
    main()
