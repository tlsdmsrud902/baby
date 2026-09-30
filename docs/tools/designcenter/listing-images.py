# 디자인센터 등록 이미지 3장 만들기 (파트너센터 규격)
#   py docs/tools/designcenter/listing-images.py
# 입력 : _deploy/dc/desk.png (PC 1280×820 캡처), _deploy/dc/mobile.png (휴대폰 390×844 @2x 캡처) — dcshot.js 로 찍는다
# 출력 : _deploy/dc/main.jpg 372×372 (대표) · display.jpg 330×489 (진열) · thumb.jpg 330×450 (썸네일)
#        파일 이름에 한글·숫자를 넣지 않는다 (파트너센터 안내 : 안 보일 수 있음)
import os
from PIL import Image, ImageDraw, ImageFilter

DC = os.path.join(os.path.dirname(__file__), '..', '..', '..', '_deploy', 'dc')
desk = Image.open(os.path.join(DC, 'desk.png')).convert('RGB')
mob = Image.open(os.path.join(DC, 'mobile.png')).convert('RGB')
BG = (245, 239, 230, 255)          # 바탕색 (브랜드 크림색)

def rr(im, r):
    m = Image.new('L', im.size, 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, im.size[0] - 1, im.size[1] - 1], r, fill=255); return m

def shadow(canvas, box, r, blur=10, off=(0, 6), alpha=70):
    s = Image.new('RGBA', canvas.size, (0, 0, 0, 0)); d = ImageDraw.Draw(s)
    x0, y0, x1, y1 = box; d.rounded_rectangle([x0 + off[0], y0 + off[1], x1 + off[0], y1 + off[1]], r, fill=(40, 30, 20, alpha))
    canvas.alpha_composite(s.filter(ImageFilter.GaussianBlur(blur)))

# 대표 372×372 : PC 화면 + 휴대폰 화면을 겹쳐서
W = 372; c = Image.new('RGBA', (W, W), BG)
dw = 330; dh = int(dw * desk.height / desk.width); d = desk.resize((dw, dh), Image.LANCZOS)
dx, dy = 12, 40; shadow(c, (dx, dy, dx + dw, dy + dh), 8); c.paste(d, (dx, dy), rr(d, 8))
mw = 112; mh = int(mw * 1.95); m = mob.crop((0, 0, mob.width, int(mob.width * 1.95))).resize((mw, mh), Image.LANCZOS)
mx, my = W - mw - 14, W - mh - 14; shadow(c, (mx - 4, my - 4, mx + mw + 4, my + mh + 4), 16, 12, (0, 8), 90)
frame = Image.new('RGBA', (mw + 8, mh + 8), (34, 30, 26, 255)); c.paste(frame, (mx - 4, my - 4), rr(frame, 16)); c.paste(m, (mx, my), rr(m, 12))
c.convert('RGB').save(os.path.join(DC, 'main.jpg'), quality=90)

# 진열 330×489 · 썸네일 330×450 : 휴대폰 화면 윗부분
for name, (w, h) in [('display', (330, 489)), ('thumb', (330, 450))]:
    ch = int(mob.width * h / w)
    mob.crop((0, 0, mob.width, ch)).resize((w, h), Image.LANCZOS).save(os.path.join(DC, name + '.jpg'), quality=90)

for f in ['main.jpg', 'display.jpg', 'thumb.jpg']:
    p = os.path.join(DC, f); print(f, Image.open(p).size, os.path.getsize(p))
