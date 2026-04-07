"""
Théorea — App Icon Generator
Generates all required PWA icon sizes from a source image.

Usage:
  1. Save your chosen icon as scripts/icon-source.png (or .jpg)
  2. Run: pip install Pillow
  3. Run: python scripts/generate-icons.py

The script will:
  - Crop the image to remove the outer border/edge
  - Generate all required PWA icon sizes
  - Create maskable icons with safe zone
  - Create apple-touch-icon with rounded corners
  - Create favicon
"""

from PIL import Image, ImageDraw
import os
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
ICONS_DIR = os.path.join(PROJECT_DIR, "public", "icons")
PUBLIC_DIR = os.path.join(PROJECT_DIR, "public")

# Look for source in multiple formats
SOURCE_NAMES = ["icon-source.png", "icon-source.jpg", "icon-source.jpeg", "icon-source.webp"]


def find_source():
    for name in SOURCE_NAMES:
        path = os.path.join(SCRIPT_DIR, name)
        if os.path.exists(path):
            return path
    return None


def crop_border(img, border_percent=0.04):
    """Crop the outer border/edge from the icon image."""
    w, h = img.size
    crop_px = int(min(w, h) * border_percent)
    return img.crop((crop_px, crop_px, w - crop_px, h - crop_px))


def make_rounded_square(img, size, radius_ratio=0.22):
    """Create a rounded square version for iOS."""
    img = img.resize((size, size), Image.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    radius = int(size * radius_ratio)
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
    output = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    output.paste(img, mask=mask)
    return output


def make_maskable(img, size):
    """Create maskable icon with safe zone padding (10% each side)."""
    inner_size = int(size * 0.80)
    resized = img.resize((inner_size, inner_size), Image.LANCZOS)
    # Use a sampled background colour from the icon edge
    bg_colour = img.resize((1, 1), Image.LANCZOS).getpixel((0, 0))
    if len(bg_colour) == 4:
        bg_colour = bg_colour[:3]
    canvas = Image.new("RGB", (size, size), bg_colour)
    offset = (size - inner_size) // 2
    if resized.mode == "RGBA":
        canvas.paste(resized, (offset, offset), resized)
    else:
        canvas.paste(resized, (offset, offset))
    return canvas


def main():
    source_path = find_source()
    if not source_path:
        print("Error: No source icon found.")
        print("Please save your icon image as one of:")
        for name in SOURCE_NAMES:
            print(f"  scripts/{name}")
        sys.exit(1)

    os.makedirs(ICONS_DIR, exist_ok=True)

    source = Image.open(source_path).convert("RGBA")
    print(f"Source: {source_path} ({source.size[0]}x{source.size[1]})")

    # Crop the outer border
    cropped = crop_border(source)
    print(f"After border crop: {cropped.size[0]}x{cropped.size[1]}")

    # Standard icons (square, no rounding — the OS handles masking)
    for filename, size in [("icon-192.png", 192), ("icon-512.png", 512)]:
        icon = cropped.resize((size, size), Image.LANCZOS)
        path = os.path.join(ICONS_DIR, filename)
        icon.save(path, "PNG", optimize=True)
        print(f"  Created {filename} ({size}x{size})")

    # Maskable icon (with safe zone padding)
    maskable = make_maskable(cropped, 512)
    maskable_path = os.path.join(ICONS_DIR, "icon-maskable-512.png")
    maskable.save(maskable_path, "PNG", optimize=True)
    print(f"  Created icon-maskable-512.png (512x512, maskable)")

    # Apple touch icon (180x180, with rounded corners)
    apple = make_rounded_square(cropped, 180)
    apple_path = os.path.join(PUBLIC_DIR, "apple-touch-icon.png")
    apple.save(apple_path, "PNG", optimize=True)
    print(f"  Created apple-touch-icon.png (180x180)")

    # SVG placeholder icon (just reference — real icon is the PNG)
    # Keep existing SVG or overwrite with a simple redirect

    # Favicon
    favicon_img = cropped.resize((32, 32), Image.LANCZOS)
    favicon_path = os.path.join(PUBLIC_DIR, "favicon.ico")
    favicon_img.save(favicon_path, sizes=[(32, 32)])
    print(f"  Created favicon.ico (32x32)")

    # Also save the cropped 1024x1024 master for App Store if needed later
    master = cropped.resize((1024, 1024), Image.LANCZOS)
    master_path = os.path.join(ICONS_DIR, "icon-1024.png")
    master.save(master_path, "PNG", optimize=True)
    print(f"  Created icon-1024.png (1024x1024, master)")

    print("\nAll icons generated successfully!")


if __name__ == "__main__":
    main()
