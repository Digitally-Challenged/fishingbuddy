#!/usr/bin/env python3
"""
Generate leather journal textures using Gemini Pro image generation.
Usage: GEMINI_API_KEY=your-key python3 scripts/generate-textures.py
"""

import os
import sys
from pathlib import Path

# Check for API key first
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("Error: GEMINI_API_KEY environment variable not set")
    print("Usage: GEMINI_API_KEY=your-key python3 scripts/generate-textures.py")
    sys.exit(1)

from google import genai
from google.genai import types

# Initialize client
client = genai.Client(api_key=api_key)

# Output directory
OUTPUT_DIR = Path(__file__).parent.parent / "public" / "textures"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Texture definitions
TEXTURES = [
    {
        "name": "leather-dark",
        "prompt": """Seamless tileable dark brown leather texture, top-down flat perspective.
Weathered and aged appearance with subtle grain and natural creases.
Color range: dark chocolate brown (#3d2b1f to #5c4033).
Matte finish, not shiny. Slight wear patterns like a well-used journal cover.
No stitching or borders, just the leather surface.
Subtle variation in tone, not uniform.""",
    },
    {
        "name": "leather-light",
        "prompt": """Seamless tileable medium brown leather texture, top-down flat perspective.
Worn vintage appearance with soft grain pattern.
Color range: warm tan to medium brown (#8b6b4a to #a67c52).
Matte finish with gentle highlights suggesting age and use.
Natural subtle creases, like a broken-in leather wallet.
No stitching or decorative elements.""",
    },
    {
        "name": "paper-cream",
        "prompt": """Seamless tileable aged cream paper texture, top-down flat perspective.
Subtle fiber texture with very light mottling, like antique journal pages.
Color range: warm cream to light ivory (#f5f0e6 to #faf8f3).
Slight foxing or age spots, very subtle - not distracting.
No lines, no writing, just the paper surface.
Soft, natural paper grain visible but not harsh.""",
    },
    {
        "name": "paper-lined",
        "prompt": """Seamless tileable lined notebook paper texture, top-down flat perspective.
Aged cream/ivory background (#f5f0e6) with faint horizontal ruled lines.
Lines should be subtle sepia/light brown (#d4c4a8), spaced approximately 24 pixels apart.
Paper has slight fiber texture and gentle aging.
No margin line, no holes, no spiral marks.
Vintage journal page aesthetic.""",
    },
    {
        "name": "stitching-border",
        "prompt": """Horizontal leather stitching detail on plain dark brown leather background.
Dark brown thread (#3d2b1f) in classic saddle stitch pattern.
Worn, slightly uneven hand-stitched appearance.
Thread shows subtle texture and age.
Simple single row of stitches, evenly spaced.
The stitching runs horizontally across the center of the image.""",
        "aspect_ratio": "21:9",  # Wide for border use
    },
]


def generate_texture(texture_config: dict) -> None:
    """Generate a single texture and save it."""
    name = texture_config["name"]
    prompt = texture_config["prompt"]
    aspect_ratio = texture_config.get("aspect_ratio", "1:1")

    print(f"\n{'='*50}")
    print(f"Generating: {name}")
    print(f"Aspect ratio: {aspect_ratio}")
    print(f"{'='*50}")

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash-preview-image-generation",
            contents=[prompt],
            config=types.GenerateContentConfig(
                response_modalities=['TEXT', 'IMAGE'],
                image_config=types.ImageConfig(
                    aspect_ratio=aspect_ratio,
                ),
            ),
        )

        # Process response
        for part in response.parts:
            if part.text:
                print(f"Response text: {part.text}")
            elif part.inline_data:
                # Save as PNG with explicit format conversion
                image = part.as_image()
                output_path = OUTPUT_DIR / f"{name}.png"
                image.save(str(output_path), format="PNG")
                print(f"✓ Saved: {output_path}")

    except Exception as e:
        print(f"✗ Error generating {name}: {e}")
        raise


def main():
    print("Leather Journal Texture Generator")
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"Textures to generate: {len(TEXTURES)}")

    for texture in TEXTURES:
        generate_texture(texture)

    print("\n" + "="*50)
    print("✓ All textures generated!")
    print(f"Files saved to: {OUTPUT_DIR}")
    print("="*50)


if __name__ == "__main__":
    main()
