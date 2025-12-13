# Image Optimization Guide: WebP Conversion + Multi-Size Generation

A reusable approach for optimizing images in web projects. Converts images to WebP format and generates multiple sizes for responsive loading.

## Why This Approach?

| Format | Typical Size | Browser Support | Transparency |
|--------|--------------|-----------------|--------------|
| PNG | 400KB+ | 100% | ✓ |
| JPEG | 100KB+ | 100% | ✗ |
| WebP | 20-50KB | 97%+ | ✓ |

**Benefits:**
- 80-90% smaller file sizes than PNG
- Maintains quality and transparency
- Multiple sizes = load only what you need
- Lazy loading support for performance

---

## Quick Start

### 1. Install Dependencies

```bash
pip install pillow
```

### 2. Run the Script

```bash
python optimize_images.py --input ./raw-images --output ./public/images
```

---

## The Scripts

### Basic Script: `optimize_images.py`

Single-purpose script for batch optimization:

```python
#!/usr/bin/env python3
"""
Image Optimizer: Convert images to WebP and generate multiple sizes.

Usage:
    python optimize_images.py --input ./source --output ./dest
    python optimize_images.py --input ./source --output ./dest --sizes 32,64,128,256
    python optimize_images.py --input ./source --output ./dest --quality 85
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

    args = parser.parse_args()

    # Parse sizes
    size_list = [int(s.strip()) for s in args.sizes.split(',')]
    sizes = {
        'xs': size_list[0] if len(size_list) > 0 else 32,
        'sm': size_list[1] if len(size_list) > 1 else 64,
        'md': size_list[2] if len(size_list) > 2 else 128,
        'lg': size_list[3] if len(size_list) > 3 else 256,
    }

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
    print(f"  • {args.output}/full/ (originals)")


if __name__ == '__main__':
    main()
```

---

### Advanced Script: With Background Removal

For icons and product images where you need transparent backgrounds:

```python
#!/usr/bin/env python3
"""
Image Optimizer with Background Removal

Requires: pip install pillow rembg[cpu]
"""

import os
from PIL import Image
from rembg import remove
from pathlib import Path

DEFAULT_SIZES = {'sm': 32, 'md': 64, 'lg': 128}


def remove_background(input_path: str) -> Image.Image:
    """Remove background from an image using AI."""
    with open(input_path, 'rb') as f:
        input_data = f.read()
    output_data = remove(input_data)

    from io import BytesIO
    return Image.open(BytesIO(output_data))


def optimize_with_bg_removal(
    input_dir: str,
    output_dir: str,
    sizes: dict = None,
    quality: int = 90
):
    """
    Remove backgrounds and optimize images.
    """
    if sizes is None:
        sizes = DEFAULT_SIZES

    input_dir = Path(input_dir)
    output_dir = Path(output_dir)

    # Create directories
    for size_name in sizes:
        (output_dir / size_name).mkdir(parents=True, exist_ok=True)
    (output_dir / 'full').mkdir(parents=True, exist_ok=True)

    # Find images
    extensions = ('.png', '.jpg', '.jpeg', '.webp')
    images = [f for f in input_dir.iterdir()
              if f.suffix.lower() in extensions]

    print(f"Processing {len(images)} images with background removal...")

    for img_path in sorted(images):
        try:
            print(f"  • {img_path.name}")

            # Remove background
            img = remove_background(str(img_path))

            # Ensure RGBA
            if img.mode != 'RGBA':
                img = img.convert('RGBA')

            base_name = img_path.stem

            # Save original (with bg removed)
            img.save(output_dir / 'full' / f"{base_name}.png", 'PNG')

            # Generate sizes
            for size_name, size_px in sizes.items():
                resized = img.resize((size_px, size_px), Image.Resampling.LANCZOS)

                # WebP
                resized.save(
                    output_dir / size_name / f"{base_name}.webp",
                    'WEBP', quality=quality, method=6
                )
                # PNG fallback
                resized.save(
                    output_dir / size_name / f"{base_name}.png",
                    'PNG', optimize=True
                )

        except Exception as e:
            print(f"  ❌ Error: {e}")

    print("\n✨ Done!")


if __name__ == '__main__':
    import sys
    if len(sys.argv) < 3:
        print("Usage: python optimize_with_bg_removal.py <input_dir> <output_dir>")
        sys.exit(1)

    optimize_with_bg_removal(sys.argv[1], sys.argv[2])
```

---

## Using in React/TypeScript

### Helper Function

```typescript
// src/utils/imageUtils.ts

export type ImageSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const SIZE_PX: Record<ImageSize, number> = {
  sm: 32,
  md: 64,
  lg: 128,
  xl: 256,
  full: 1024,
};

/**
 * Get optimized image path
 */
export function getImagePath(
  name: string,
  size: ImageSize = 'md',
  format: 'webp' | 'png' = 'webp'
): string {
  const folder = size === 'full' ? 'full' : size;
  const ext = size === 'full' ? 'png' : format;
  return `/images/${folder}/${name}.${ext}`;
}

/**
 * Get pixel size for an image size name
 */
export function getImagePxSize(size: ImageSize): number {
  return SIZE_PX[size];
}
```

### React Component with WebP Fallback

```tsx
// src/components/OptimizedImage.tsx

interface OptimizedImageProps {
  name: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function OptimizedImage({
  name,
  alt,
  size = 'md',
  className
}: OptimizedImageProps) {
  const pxSize = { sm: 32, md: 64, lg: 128, xl: 256 }[size];

  return (
    <picture>
      {/* WebP for modern browsers */}
      <source
        srcSet={`/images/${size}/${name}.webp`}
        type="image/webp"
      />
      {/* PNG fallback */}
      <img
        src={`/images/${size}/${name}.png`}
        alt={alt}
        width={pxSize}
        height={pxSize}
        loading="lazy"
        className={className}
        style={{ objectFit: 'contain' }}
      />
    </picture>
  );
}
```

### Responsive Image with Multiple Sizes

```tsx
// For hero images that need different sizes at different breakpoints

export function ResponsiveImage({ name, alt }: { name: string; alt: string }) {
  return (
    <picture>
      <source
        media="(max-width: 640px)"
        srcSet={`/images/md/${name}.webp`}
        type="image/webp"
      />
      <source
        media="(max-width: 1024px)"
        srcSet={`/images/lg/${name}.webp`}
        type="image/webp"
      />
      <source
        srcSet={`/images/xl/${name}.webp`}
        type="image/webp"
      />
      <img
        src={`/images/lg/${name}.png`}
        alt={alt}
        loading="lazy"
        style={{ width: '100%', height: 'auto' }}
      />
    </picture>
  );
}
```

---

## Common Use Cases

### Icons (like this project)
```bash
python optimize_images.py -i ./raw-icons -o ./public/icons -s 24,32,48,64
```

### Product Images
```bash
python optimize_images.py -i ./products -o ./public/products -s 64,128,256,512 -q 85
```

### Blog/Content Images
```bash
python optimize_images.py -i ./content -o ./public/blog -s 320,640,1024,1920 -q 80
```

### Avatars
```bash
python optimize_images.py -i ./avatars -o ./public/avatars -s 32,48,64,128
```

---

## Output Structure

After running the script:

```
public/images/
├── sm/              # 32px - tiny thumbnails
│   ├── image1.webp
│   └── image1.png
├── md/              # 64px - list items
│   ├── image1.webp
│   └── image1.png
├── lg/              # 128px - cards, modals
│   ├── image1.webp
│   └── image1.png
├── xl/              # 256px - large previews
│   ├── image1.webp
│   └── image1.png
└── full/            # Original size (PNG)
    └── image1.png
```

---

## Tips

1. **Quality settings:**
   - Icons: 90-95 (need crisp edges)
   - Photos: 80-85 (more forgiving)
   - Large backgrounds: 70-80 (size matters more)

2. **Size selection:**
   - Match your actual usage sizes
   - Don't generate sizes you won't use
   - Consider 2x sizes for retina displays

3. **Batch processing:**
   - Process at build time, not runtime
   - Add to your CI/CD pipeline if images change often

4. **Caching:**
   - WebP files are highly cacheable
   - Use content hashing in filenames for cache busting

---

---

## SVG Conversion (Auto-Trace)

For cases where you need vector output, you can auto-trace raster images to SVG.

### When to Use SVG

| Use Case | Recommendation |
|----------|----------------|
| Simple logos | ✓ SVG (great results) |
| Flat icons | ✓ SVG (good results) |
| Silhouettes | ✓ SVG (perfect) |
| Detailed illustrations | ✗ WebP (SVG too large) |
| Photos/AI-generated | ✗ WebP (SVG quality poor) |
| Gradients/shading | ✗ WebP (SVG can't handle well) |

### Usage

```bash
# Install vtracer
pip install vtracer

# Convert with presets
python convert_to_svg.py ./logos ./public/logos simple    # Logos, simple icons
python convert_to_svg.py ./icons ./public/icons detailed  # More detail
python convert_to_svg.py ./art ./public/art photo         # Max detail (large!)
```

### Presets

| Preset | Colors | Best For | File Size |
|--------|--------|----------|-----------|
| `simple` | 4 | Logos, flat icons | Small |
| `detailed` | 6 | Illustrations | Medium |
| `photo` | 8 | Complex images | Large |

### Example Results

A simple logo:
- PNG: 50KB
- SVG (simple): 5KB ✓

A detailed fish illustration:
- PNG: 400KB
- WebP: 2KB ✓
- SVG: 150KB+ ✗

**Rule of thumb:** If the SVG is larger than the raster, use WebP instead.

---

## Dependencies

```bash
# Basic optimization
pip install pillow

# With background removal
pip install pillow rembg[cpu]

# For GPU acceleration (faster bg removal)
pip install pillow rembg[gpu]

# For SVG conversion (auto-trace)
pip install vtracer
```
