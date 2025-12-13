import json

# JSON template function
def generate_prompt(item_name, category, specific_desc, colors):
    prompt_structure = {
        "icon_style": {
            "perspective": "isometric",
            "geometry": {
                "proportions": "1:1 ratio canvas, floating centrally",
                "element_arrangement": specific_desc
            },
            "composition": {
                "element_count": "1 main object",
                "spatial_depth": "layered to create sense of dimension",
                "scale_consistency": "uniform object scale",
                "scene_density": "minimal, high clarity"
            },
            "lighting": {
                "type": "soft ambient light",
                "light_source": "subtle top-right",
                "shadow": "gentle drop shadows below",
                "highlighting": "mild edge illumination"
            },
            "textures": {
                "material_finish": "semi-matte" if category == "Fish" else "satin to glossy",
                "surface_treatment": "stylized naturalism",
                "texture_realism": "stylized"
            },
            "render_quality": {
                "resolution": "high-resolution octane 3D rendering",
                "edge_definition": "crisp, no outlines",
                "visual_clarity": "clean, readable silhouette"
            },
            "color_palette": {
                "tone": "naturalistic",
                "range": colors,
                "usage": "distinct colors to identify features"
            },
            "background": {
                "color": "#FFFFFF",
                "style": "pure white, flat",
                "texture": "none"
            },
            "stylistic_tone": "premium, clean outdoor lifestyle",
            "icon_behavior": {
                "branding_alignment": "neutral",
                "scalability": "legible at small sizes"
            }
        }
    }
    
    return f"**{item_name}**\n```json\n{json.dumps(prompt_structure, indent=2)}\n```\n\n"

# Additional Data definitions based on diary analysis
items = [
    # Missing Fish
    ("Bluegill / Sunfish", "Fish", "Round body sunfish with distinct opercular flap", "blue, orange, olive, vertical bars"),
    ("Crappie", "Fish", "Deep-bodied panfish with speckled pattern", "silver, black speckles (salt & pepper)"),
    ("Drum (Freshwater)", "Fish", "Humpbacked silver fish with subterminal mouth", "silver, gray, white belly"),
    ("Sauger", "Fish", "Elongated fish similar to Walleye with dorsal spots", "brassy, dark blotches, spotted dorsal fin"),
    ("Striped Bass / Hybrid", "Fish", "Streamlined bass with distinct horizontal stripes", "silver, heavy black broken lines"),
    
    # Missing Lures/Bait
    ("Square Bill Crankbait", "Lure", "Stout body crankbait with square diving lip", "chartreuse black back or craw pattern"),
    ("Flicker Shad", "Lure", "Slender minnow-profile crankbait", "shad pattern or firetiger"),
    ("Hair Jig", "Lure", "Simple jig head with tied bucktail or marabou hair", "gray, white, red thread"),
    ("Nightcrawler (Live Bait)", "Lure", "Natural earthworm, long and segmented", "pink, brown, natural earth tones"),
    ("Jig and Pig (Craw Trailer)", "Lure", "Jig with bulky pork or plastic crawfish trailer", "black/blue or green pumpkin"),
    ("Spinnerbait", "Lure", "Safety-pin style wire frame with blades and skirt", "white/chartreuse skirt, silver/gold blades")
]

# Generate output
output = ""
for name, cat, desc, cols in items:
    output += generate_prompt(name, cat, desc, cols)

print(output)








