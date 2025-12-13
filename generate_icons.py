import json

# JSON template function
def generate_prompt(item_name, category, specific_desc, colors):
    prompt_structure = {
        "icon_style": {
            "perspective": "isometric",
            "geometry": {
                "proportions": "1:1 ratio canvas, floating centrally",
                "element_arrangement": f"{specific_desc}"
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
    
    return f"**{item_name}**:\n```json\n{json.dumps(prompt_structure, indent=2)}\n```\n\n"

# Data definitions
items = [
    # Fish
    ("Smallmouth Bass", "Fish", "Smallmouth bass curving upward, bronze body with vertical stripes", "bronze, olive green, cream belly"),
    ("Largemouth Bass", "Fish", "Largemouth bass with open mouth, distinct dark lateral line", "dark green, light green, white belly"),
    ("Spotted Bass", "Fish", "Spotted bass with rows of small spots along belly", "green, diamond pattern, white"),
    ("Walleye", "Fish", "Walleye with spiny dorsal fin and large eye", "golden olive, white tip on tail"),
    ("Rainbow Trout", "Fish", "Rainbow trout with characteristic pink stripe", "silver, pink stripe, black spots"),
    ("Brown Trout", "Fish", "Brown trout with halos/spots", "golden brown, red/black spots with halos"),
    ("Shadow Bass / Rock Bass", "Fish", "Stout body with red eye and mottled pattern", "brown, brassy, mottled dark"),
    ("Catfish", "Fish", "Catfish with whiskers (barbels) and smooth skin", "gray-blue or olive, smooth skin"),
    ("Gar", "Fish", "Long slender gar with beak-like snout", "olive, spotted, armor-like scales"),
    ("Carp", "Fish", "Large scaled carp with downward mouth", "golden yellow, bronze, large scales"),
    
    # Lures
    ("Shad Rap (Crankbait)", "Lure", "Classic shad-shaped crankbait with diving lip", "silver sides, black back (Shad pattern)"),
    ("Jig (Skirted)", "Lure", "Lead head jig with rubber skirt and trailer", "brown/orange (craw pattern)"),
    ("Soft Plastic Centipede/Worm", "Lure", "Textured soft plastic worm, curved naturally", "cotton candy or green pumpkin"),
    ("Spoon", "Lure", "Curved metal spoon lure reflecting light", "gold or silver metallic"),
    ("Tube Lure", "Lure", "Hollow body tube bait with tentacles", "green pumpkin, pepper flakes")
]

# Generate output
output = ""
for name, cat, desc, cols in items:
    output += generate_prompt(name, cat, desc, cols)

print(output)








