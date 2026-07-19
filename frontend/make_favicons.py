import math
from PIL import Image, ImageDraw, ImageFilter

def hexagon_points(cx, cy, r, flat_top=False):
    """Return 6 points of a regular hexagon centred at (cx, cy) with radius r."""
    pts = []
    for i in range(6):
        angle_deg = 60 * i + (0 if flat_top else 30)
        angle_rad = math.radians(angle_deg)
        pts.append((cx + r * math.cos(angle_rad), cy + r * math.sin(angle_rad)))
    return pts

def draw_ico():
    SIZE = 512
    img  = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx, cy = SIZE / 2, SIZE / 2

    # ── Dark background circle ──────────────────────────────
    r_bg = SIZE / 2 - 2
    draw.ellipse([(cx - r_bg, cy - r_bg), (cx + r_bg, cy + r_bg)], fill=(10, 10, 26, 255))

    # ── Outer Hexagon (CYAN glow) ───────────────────────────
    r_outer = SIZE * 0.40
    outer   = hexagon_points(cx, cy, r_outer, flat_top=False)

    # Glow pass
    glow = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    ImageDraw.Draw(glow).polygon(outer, outline=(0, 242, 254, 220), width=int(SIZE * 0.04))
    glow = glow.filter(ImageFilter.GaussianBlur(12))
    img.alpha_composite(glow)

    # Sharp hexagon stroke
    draw.polygon(outer, outline=(0, 242, 254, 255), width=int(SIZE * 0.036))

    # ── Inner Hexagon (PURPLE) ──────────────────────────────
    r_inner = SIZE * 0.27
    inner   = hexagon_points(cx, cy, r_inner, flat_top=False)
    draw.polygon(inner, outline=(157, 78, 221, 255), width=int(SIZE * 0.025))

    # ── Spokes (outer vertex → inner vertex) ───────────────
    spoke_color_c = (0, 242, 254, 255)
    spoke_color_p = (157, 78, 221, 255)
    spoke_w = int(SIZE * 0.022)

    # Top spoke (cyan)
    draw.line([outer[0], inner[0]], fill=spoke_color_c, width=spoke_w)
    # Bottom-left spoke (purple)
    draw.line([outer[4], inner[4]], fill=spoke_color_p, width=spoke_w)
    # Bottom-right spoke (cyan)
    draw.line([outer[5], inner[5]], fill=spoke_color_c, width=spoke_w)

    # ── Center core glow ───────────────────────────────────
    r_core = SIZE * 0.08
    core_g = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    ImageDraw.Draw(core_g).ellipse([
        (cx - r_core, cy - r_core),
        (cx + r_core, cy + r_core)
    ], fill=(255, 255, 255, 200))
    core_g = core_g.filter(ImageFilter.GaussianBlur(10))
    img.alpha_composite(core_g)

    draw.ellipse([
        (cx - r_core * 0.55, cy - r_core * 0.55),
        (cx + r_core * 0.55, cy + r_core * 0.55)
    ], fill=(255, 255, 255, 255))

    img.save('frontend/public/favicon.ico', format='ICO',
             sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128)])
    print("OK - Created frontend/public/favicon.ico")

    # Generate PWA PNG icons
    pwa_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
    pwa_192.save('frontend/public/pwa-192.png', format='PNG')
    print("OK - Created frontend/public/pwa-192.png")

    pwa_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
    pwa_512.save('frontend/public/pwa-512.png', format='PNG')
    print("OK - Created frontend/public/pwa-512.png")

if __name__ == '__main__':
    draw_ico()
