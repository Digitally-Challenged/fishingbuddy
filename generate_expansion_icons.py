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

# Expansion List
items = [
    # Fish
    ("White Bass", "Fish", "Deep-bodied silver bass with faint stripes", "silver, white, faint dark stripes"),
    ("Striped Bass", "Fish", "Large, streamlined silver bass with distinct dark stripes", "silver, dark stripes, white belly"),
    ("Hybrid Striped Bass (Wiper)", "Fish", "Deep body like White Bass but with broken stripes", "silver, broken dark stripes"),
    ("Cutthroat Trout", "Fish", "Trout with distinctive red slash marks under jaw", "olive-gold, black spots, red throat slash"),
    ("Brook Trout", "Fish", "Dark body trout with light worm-like markings (vermiculation)", "dark olive, light spots, red spots with blue halos, white fin edges"),
    ("Black Crappie", "Fish", "Deep-bodied crappie with irregular black mottling", "silver-green, heavy black irregular mottling"),
    ("White Crappie", "Fish", "Deep-bodied crappie with vertical bar markings", "silver, faint vertical dark bars"),
    ("Green Sunfish", "Fish", "Thick-bodied sunfish with large mouth and blue streaks", "olive-green, blue streaks on cheek, yellow fin edges"),
    ("Redear Sunfish (Shellcracker)", "Fish", "Round sunfish with red margin on opercular flap", "olive, brassy, red ear tab margin"),
    ("Warmouth", "Fish", "Thick, dark sunfish resembling a rock bass/bass hybrid", "dark mottled brown, purple sheen, red eye"),
    ("Yellow Perch", "Fish", "Slender fish with distinct vertical dark bars", "gold/yellow, distinct black vertical bars"),
    ("Blue Catfish", "Fish", "Large catfish with forked tail and humped back", "slate blue, silver-white belly"),
    ("Flathead Catfish", "Fish", "Large catfish with flattened head and square tail", "mottled brown, yellow, olive"),
    ("Bullhead Catfish", "Fish", "Small, stout catfish with squared tail", "dark brown, yellow belly"),
    ("Grass Carp", "Fish", "Large, torpedo-shaped carp with large scales", "silvery-gray to olive, cross-hatched scales"),
    ("Buffalo", "Fish", "Deep-bodied sucker fish, similar to carp but no whiskers", "gray, blue-green, pale belly"),
    ("Bowfin (Grinnell)", "Fish", "Prehistoric cylindrical fish with long dorsal fin", "olive-green, reticulated pattern, black tail spot"),
    ("Paddlefish (Spoonbill)", "Fish", "Large fish with long paddle-like snout", "gray, smooth skin, long rostrum"),
    ("Alligator Gar", "Fish", "Large gar with broad, alligator-like snout", "olive-brown, heavy armor scales, broad snout"),

    # Baits
    ("Topwater Frog", "Lure", "Hollow body frog lure with skirt legs", "green, yellow, black spots"),
    ("Buzzbait", "Lure", "Wire frame lure with propeller blade", "white/chartreuse skirt, metallic blade"),
    ("Chatterbait (Bladed Jig)", "Lure", "Jig with hexagon metal blade attached to eyelet", "blue/black or green pumpkin skirt, silver blade"),
    ("Lipless Crankbait (Rat-L-Trap)", "Lure", "Flat-sided shad-shaped lure without diving bill", "chrome blue back or red craw"),
    ("Jerkbait (Suspending)", "Lure", "Long slender minnow lure with short lip", "translucent, silver flash, gold"),
    ("Ned Rig", "Lure", "Small mushroom jig head with short stick bait", "green pumpkin, matte finish"),
    ("Wacky Rig", "Lure", "Soft plastic stick bait hooked in the center", "green pumpkin, watermelon red"),
    ("Carolina Rig", "Lure", "Lizard or creature bait with heavy egg sinker leader", "pumpkin seed lizard, brass weight"),
    ("Drop Shot Rig", "Lure", "Finesse worm suspended above a weight", "morning dawn (pink/purple) worm, lead weight"),
    ("Inline Spinner (Rooster Tail)", "Lure", "Spinner with hackle tail and rotating blade", "white body, silver blade, white hackle"),
    ("Live Minnow", "Lure", "Small silver baitfish", "silver, translucent, natural"),
    ("Live Cricket", "Lure", "Brown cricket insect", "brown, black, natural"),
    ("Powerbait / Salmon Eggs", "Lure", "Jar of dough bait or cluster of eggs", "chartreuse, rainbow, or red eggs")
]

# Generate output
output = "# Icon List 2: Expansion Set\n\nThis list includes all major Arkansas freshwater fish species and popular baits not covered in the original list.\n\n## 🐟 Additional Fish Species\n\n"
current_category = "Fish"

for name, cat, desc, cols in items:
    if cat != current_category:
        output += "\n## 🎣 Additional Lures & Baits\n\n"
        current_category = cat
    output += generate_prompt(name, cat, desc, cols)

print(output)








