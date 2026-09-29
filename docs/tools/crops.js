// 상품 이미지 : 사진에서 정사각형으로 잘라 800x800 jpg (cx, cy = 중심 비율, s = 짧은 변 대비 크기)
const { execFileSync } = require('child_process');
const S = {
  A:'Baby_sleeping_on_linen_blanket_2K_20260928162139.jpg', B:'Baby_sleeping_on_white_blanket_2K_20260928161901.jpg',
  C:'Baby_sitting_looking_through_window_2K_20260928161852.jpg', D:'Toddler_examining_wooden_toy_2K_20260928161845.jpg',
  E:'Toddler_playing_with_toy_2K_20260928162132.jpg', F:'Baby_girl_running_in_park_2K_20260928162128.jpg',
  G:'Baby_playing_with_wooden_cube_2K_20260929123155.jpg', H:'Baby_playing_with_building_blocks_2K_20260929123508.jpg',
  I:'Baby_sitting_in_high_chair_2K_20260929123333.jpg', J:'Baby_looking_at_puddle_2K_20260929123325.jpg',
  K:'Baby_looking_at_autumn_leaves_2K_20260929123157.jpg', L:'Baby_sitting_on_swing_2K_20260929123336.jpg',
  M:'Baby_walking_on_balcony_2K_20260929123150.jpg', N:'Baby_eating_fruit_indoors_2K_20260929123328.jpg',
  mom:'Mother_holding_baby_in_kitchen_2K_20260929123511.jpg', read:'Siblings_reading_picture_book_2K_20260929123518.jpg',
  dad:'Father_lifting_baby_in_park_2K_20260929123517.jpg',
  bear:'ChatGPT Image 2026년 9월 28일 오후 04_09_08.png', bunny:'ChatGPT Image 2026년 9월 28일 오후 04_10_03.png',
  flower:'ChatGPT Image 2026년 9월 28일 오후 04_11_04.png', walk:'ChatGPT Image 2026년 9월 28일 오후 04_12_16.png'
};
const dims = f => execFileSync('ffprobe',['-v','error','-show_entries','stream=width,height','-of','csv=p=0',f],{encoding:'utf8'}).trim().split(',').map(Number);
const crops = JSON.parse(process.argv[2]);
for (const [code, src, cx, cy, s] of crops) {
  const f = S[src], [w, h] = dims(f), side = Math.round(Math.min(w, h) * s);
  const x = Math.max(0, Math.min(w - side, Math.round(w * cx - side / 2)));
  const y = Math.max(0, Math.min(h - side, Math.round(h * cy - side / 2)));
  execFileSync('ffmpeg',['-v','error','-y','-i',f,'-vf',`crop=${side}:${side}:${x}:${y},scale=800:800`,'-q:v','3',`cafe24-assets/products/${code}.jpg`]);
}
console.log(crops.length, 'images');
