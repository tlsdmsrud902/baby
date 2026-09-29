// 펫 CMS 스크립트를 baby앙용으로 이름만 바꾼다 (기능은 그대로)
const fs = require('fs');
const dir = 'D:/baby/babyyang902_s2_260925195134_d_skin1_E/skin1/layout/basic/js/';
const rules = [
  [/PETPIA_(CMS|PRODUCTS|MENU_HERO)/g, 'BABYANG_$1'],
  [/petpia:cms/g, 'babyang:cms'],
  [/data-petpia-content/g, 'data-babyang-content'],
  [/petpia-(cms|content)/g, 'babyang-$1'],
  [/pet-cms-editor/g, 'baby-cms-editor'], [/pet-cms/g, 'baby-cms'],
  [/pet-menu-hero/g, 'baby-menu-hero'],
  [/SkinImg\/pet\//g, 'SkinImg/baby/'],
  [/\/pet\/guide\.html/g, '/baby/guide.html'],
  [/cate_no=42/g, 'cate_no=28'],
  [/PETPIA/g, 'baby앙'],
  [/\['dog', '강아지 분류'\], \['cat', '고양이 분류'\], \['walk', '산책·외출 분류'\]/g, "['newborn', '신생아 분류'], ['toddler', '걸음마 아기 분류'], ['outing', '외출/나들이 분류']"],
  [/── 1번 · 강아지 ──/g, '── 1번 · 신생아 ──'],
  [/예\) 간식 \/product\/search\.html\?keyword=간식/g, '예) 속싸개 /product/search.html?keyword=속싸개']
];
for (const f of ['baby-cms.js', 'baby-cms-editor.js']) {
  let s = fs.readFileSync(dir + f, 'utf8');
  for (const [re, to] of rules) s = s.replace(re, to);
  fs.writeFileSync(dir + f, s);
  const left = s.match(/[A-Za-z_$-]*(PETPIA|Petpia|petpia|\bpet\b|pet-|강아지|고양이|산책|간식|사료)[A-Za-z0-9_$:-]*/g) || [];
  console.log(f, 'left:', JSON.stringify([...new Set(left)]));
}
