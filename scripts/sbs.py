# Dev helper: side-by-side local | figma | diff, cropped to a y range and scaled. python3 scripts/sbs.py name y0 y1 out [scale]
import sys
from PIL import Image
name, y0, y1, out = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
scale = float(sys.argv[5]) if len(sys.argv) > 5 else 0.5
ims = [Image.open(p).convert('RGB') for p in (f'tests/output/{name}.png', f'tests/figma/{name}.png', f'tests/output/{name}-diff.png')]
crops = [im.crop((0, y0, im.width, min(y1, im.height))) for im in ims]
w = sum(c.width for c in crops) + 20
h = max(c.height for c in crops)
canvas = Image.new('RGB', (w, h), 'white')
x = 0
for c in crops:
    canvas.paste(c, (x, 0)); x += c.width + 10
canvas.resize((int(w * scale), int(h * scale))).save(out)
