from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import math
import random

W, H = 1536, 860
ACCENT = (255, 130, 35)
BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
REGULAR = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
MONO = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'

def font(path, size):
    return ImageFont.truetype(path, size)

def rounded(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)

image = Image.new('RGB', (W, H))
pixels = image.load()
for y in range(H):
    for x in range(W):
        t = (x / W) * 0.7 + (y / H) * 0.3
        glow = max(0, 1 - math.hypot(x - W * 0.72, y - H * 0.38) / (W * 0.55))
        pixels[x, y] = (
            int(10 * (1 - t) + 34 * t + ACCENT[0] * glow * 0.12),
            int(12 * (1 - t) + 16 * t + ACCENT[1] * glow * 0.12),
            int(27 * (1 - t) + 35 * t + ACCENT[2] * glow * 0.12)
        )

image = image.convert('RGBA')
draw = ImageDraw.Draw(image, 'RGBA')
for x in range(0, W, 64):
    draw.line((x, 0, x, H), fill=(255, 255, 255, 9))
for y in range(0, H, 64):
    draw.line((0, y, W, y), fill=(255, 255, 255, 9))
random.seed(7)
for _ in range(180):
    x = random.randrange(W)
    y = random.randrange(H)
    draw.ellipse((x, y, x + 2, y + 2), fill=(255, 255, 255, random.randrange(8, 26)))

rounded(draw, (70, 70, 210, 210), 32, (*ACCENT, 35), (*ACCENT, 220), 3)
draw.ellipse((103, 102, 177, 176), outline=(*ACCENT, 240), width=7)
draw.line((158, 158, 190, 190), fill=(*ACCENT, 240), width=8)
draw.text((250, 70), 'PatchLens', font=font(BOLD, 72), fill='white')
draw.text((252, 157), 'Evidence-based review for AI-generated code changes.', font=font(REGULAR, 30), fill=(207, 213, 233, 255))

steps = [
    ('Parse', 'Unified diff evidence'),
    ('Detect', 'Risk patterns'),
    ('Explain', 'Files + exact reasons'),
    ('Gate', 'Stable policy verdict'),
    ('Export', 'JSON · Markdown · SARIF')
]
for index, (label, detail) in enumerate(steps):
    x = 78 + index * 285
    rounded(draw, (x, 290, x + 250, 435), 24, (12, 17, 37, 218), (*ACCENT, 115), 2)
    draw.ellipse((x + 18, 308, x + 58, 348), fill=(*ACCENT, 225))
    draw.text((x + 31, 312), str(index + 1), font=font(BOLD, 20), fill='white')
    draw.text((x + 72, 308), label, font=font(BOLD, 22), fill='white')
    draw.text((x + 20, 366), detail, font=font(REGULAR, 16), fill=(176, 184, 210, 255))

rounded(draw, (78, 500, 1015, 775), 28, (5, 8, 20, 238), (255, 255, 255, 28), 2)
draw.text((108, 525), '$ patchlens review HEAD~1..HEAD --fail-on high', font=font(MONO, 21), fill=(128, 245, 184, 255))
for index, line in enumerate([
    'PL001  HIGH    Secret-like value added',
    'PL003  HIGH    Schema changed without migration',
    'PL005  HIGH    Files changed outside declared scope',
    'VERDICT         FAIL · exit 2'
]):
    draw.text((110, 585 + index * 42), line, font=font(MONO, 20), fill=(229, 232, 243, 255) if index < 3 else (*ACCENT, 255))

rounded(draw, (1050, 500, 1458, 775), 28, (13, 17, 38, 220), (*ACCENT, 125), 2)
draw.text((1080, 526), 'REVIEW CONTRACT', font=font(BOLD, 20), fill=(*ACCENT, 255))
for index, (key, value) in enumerate([('LLM calls', '0'), ('Runtime deps', '0'), ('Output', 'SARIF'), ('Hash', 'SHA-256')]):
    y = 580 + index * 48
    draw.text((1080, y), key, font=font(REGULAR, 18), fill=(164, 174, 204, 255))
    value_width = draw.textlength(value, font=font(BOLD, 21))
    draw.text((1425 - value_width, y - 2), value, font=font(BOLD, 21), fill='white')

draw.text((78, 815), 'VIBE CODING TOOL SUITE  •  OPEN SOURCE  •  APACHE-2.0', font=font(BOLD, 16), fill=(151, 159, 188, 230))
out = Path('docs/assets/patchlens-hero.png')
out.parent.mkdir(parents=True, exist_ok=True)
image.convert('RGB').save(out, 'PNG', optimize=True)
