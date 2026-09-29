// pet → baby앙 일괄 치환 (D:\baby 에서 실행)
const fs = require('fs');
const { execSync } = require('child_process');
const files = execSync('git -c core.quotepath=off ls-files', { encoding: 'utf8' }).split('\n').filter(Boolean)
  .filter(f => /\.(html|css|js|json|txt|xml|md|cjs)$/i.test(f) && fs.existsSync(f));

const img = {
  'hero-home': 'scene-sleep-linen', 'banner-picnic': 'scene-park', 'hero-editorial-v2': 'scene-nursery',
  'shop-hero': 'scene-nursery', 'sale-hero': 'baby-flower', 'event-birthday': 'baby-bunny',
  'story-outdoor': 'scene-park', 'guide-walk': 'scene-park', 'guide-rest': 'scene-sleep-white',
  'guide-play': 'scene-wooden-toy', 'starter-home': 'starter-nursery', 'coupon-dog': 'card-newborn',
  'coupon-cat': 'card-toddler', 'coupon-gifts': 'sq-bunny', 'product-bed': 'sq-sleep', 'product-toy': 'sq-toy',
  'product-bowl': 'sq-laugh', 'product-walk-kit': 'sq-park', 'products-flatlay': 'sq-stack',
  'category-walk': 'scene-park', 'category-cat': 'scene-stacking', 'submenu-dog': 'scene-sleep-white',
  'submenu-cat': 'scene-stacking', 'submenu-walk': 'scene-park', 'submenu-review-puppy': 'hero-laugh',
  'submenu-review': 'hero-laugh', 'logo-petpia': 'logo-babyang', 'wordmark-petpia': 'wordmark-babyang',
  'hero-petpia-start': 'hero-laugh', 'hero-petpia': 'hero-laugh'
};
const names = Object.keys(img).sort((a, b) => b.length - a.length).join('|');

const rules = [
  [/https:\/\/ecimg\.cafe24img\.com\/pg3415b27572456008\/petpia902\/pet\//g, '/SkinImg/baby/'],
  [new RegExp('(?<![a-z-])(' + names + ')\\.(png|webp|mp4)', 'g'), (m, n) => img[n] + '.webp'],
  [/SkinImg\/pet\//g, 'SkinImg/baby/'],
  [/petpia902|adia902222|adia90222/g, 'NEWID'],
  [/PETPIA/g, 'baby앙'], [/Petpia/g, 'Babyang'], [/petpia/g, 'babyang'], [/펫피아/g, '베이비앙'],
  [/petedit/g, 'babyedit'], [/PET EDIT/g, 'BABY EDIT'],
  [/(?<![A-Za-z])pets(?![a-z])/g, 'kids'], [/(?<![A-Za-z])pet(?![a-z])/g, 'baby'],
  [/(?<=[a-z])Pet(?![a-z])/g, 'Baby'], [/(?<![A-Za-z])Pets(?![a-z])/g, 'Kids'], [/(?<![A-Za-z])Pet(?![a-z])/g, 'Baby'],
  [/(?<![A-Za-z])PETS(?![A-Za-z])/g, 'KIDS'], [/(?<![A-Za-z])PET(?![A-Za-z])/g, 'BABY']
];

let changed = 0;
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  let out = src;
  for (const [re, to] of rules) out = out.replace(re, to);
  if (out !== src) { fs.writeFileSync(f, out); changed++; console.log('changed', f); }
}
console.log(changed, 'files changed');
