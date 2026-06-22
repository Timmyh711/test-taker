#!/usr/bin/env python3
"""Generate Test Taker app icons: transparent bg, rounded blue square, test document icon."""

from pathlib import Path

try:
    from PIL import Image, ImageDraw
except ImportError:
    import subprocess
    subprocess.check_call(["pip3", "install", "pillow", "-q"])
    from PIL import Image, ImageDraw

ICONS_DIR = Path(__file__).resolve().parent.parent / "src-tauri" / "icons"
PUBLIC_DIR = Path(__file__).resolve().parent.parent / "public"

BLUE = (59, 130, 246, 255)
WHITE = (255, 255, 255, 255)
TRANSPARENT = (0, 0, 0, 0)


def draw_test_icon(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), TRANSPARENT)
    draw = ImageDraw.Draw(img)
    s = float(size)

    margin = s * 0.08
    corner = s * 0.2
    draw.rounded_rectangle(
        [margin, margin, s - margin, s - margin],
        radius=corner,
        fill=BLUE,
    )

    # Document / test paper
    pw, ph = s * 0.46, s * 0.54
    px = (s - pw) / 2
    py = (s - ph) / 2 + s * 0.03
    doc_r = s * 0.035
    draw.rounded_rectangle([px, py, px + pw, py + ph], radius=doc_r, fill=WHITE)

    # Folded corner tab
    tab = s * 0.1
    draw.polygon(
        [
            (px + pw - tab, py),
            (px + pw, py),
            (px + pw, py + tab),
        ],
        fill=(219, 234, 254, 255),
    )
    draw.line([(px + pw - tab, py), (px + pw - tab, py + tab), (px + pw, py + tab)], fill=BLUE, width=max(1, int(s * 0.012)))

    # Question lines
    lm = s * 0.07
    lh = max(2, int(s * 0.028))
    y0 = py + s * 0.13
    gap = s * 0.085
    widths = [0.72, 0.58, 0.66, 0.48]
    for i, frac in enumerate(widths):
        if s < 48 and i >= 3:
            break
        y = int(y0 + i * gap)
        x1 = int(px + lm)
        x2 = int(max(x1 + 2, px + pw * frac))
        y2 = int(y + lh)
        if y2 <= y or y2 > int(py + ph - 2):
            continue
        draw.rectangle([x1, y, x2, y2], fill=BLUE)

    # Checkmark badge (completed test) — skip on very small sizes
    if s >= 48:
        cr = s * 0.075
        cx = px + pw - s * 0.11
        cy = py + ph - s * 0.1
        draw.ellipse([cx - cr, cy - cr, cx + cr, cy + cr], fill=WHITE)
        draw.ellipse(
            [cx - cr, cy - cr, cx + cr, cy + cr],
            outline=BLUE,
            width=max(1, int(s * 0.018)),
        )
        sw = max(1, int(s * 0.022))
        p1 = (cx - cr * 0.35, cy + cr * 0.05)
        p2 = (cx - cr * 0.05, cy + cr * 0.38)
        p3 = (cx + cr * 0.42, cy - cr * 0.32)
        draw.line([p1, p2, p3], fill=BLUE, width=sw, joint="curve")

    return img


def main():
    ICONS_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

    sizes = {
        "32x32.png": 32,
        "128x128.png": 128,
        "128x128@2x.png": 256,
        "icon.png": 512,
        "Square30x30Logo.png": 30,
        "Square44x44Logo.png": 44,
        "Square71x71Logo.png": 71,
        "Square89x89Logo.png": 89,
        "Square107x107Logo.png": 107,
        "Square142x142Logo.png": 142,
        "Square150x150Logo.png": 150,
        "Square284x284Logo.png": 284,
        "Square310x310Logo.png": 310,
        "StoreLogo.png": 50,
    }

    master = draw_test_icon(512)
    master.save(ICONS_DIR / "icon.png")

    ico_sizes = []
    for name, size in sizes.items():
        icon = draw_test_icon(size)
        icon.save(ICONS_DIR / name)
        if size in (16, 32, 48, 64, 128, 256):
            ico_sizes.append(icon)
        print(f"Created {name} ({size}x{size})")

    # Multi-resolution ICO
    ico_images = [draw_test_icon(s) for s in (16, 32, 48, 64, 128, 256)]
    ico_images[0].save(
        ICONS_DIR / "icon.ico",
        format="ICO",
        sizes=[(img.width, img.height) for img in ico_images],
        append_images=ico_images[1:],
    )
    print("Created icon.ico")

    # ICNS substitute: PNG at 256 (Tauri on Linux uses PNG primarily)
    draw_test_icon(256).save(ICONS_DIR / "icon.icns")
    print("Created icon.icns (PNG fallback)")

    # App favicon for web/dev
    draw_test_icon(64).save(PUBLIC_DIR / "icon.png")
    print("Created public/icon.png")


if __name__ == "__main__":
    main()
