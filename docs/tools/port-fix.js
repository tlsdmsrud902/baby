// 이름이 달라 자동 이식이 안 된 태그에 편집 속성을 직접 붙인다
const fs = require('fs');
const K = 'D:/baby/babyyang902_s2_260925195134_d_skin1_E/skin1/';
function edit(f, pairs) {
  let s = fs.readFileSync(K + f, 'utf8');
  for (const [a, b] of pairs) { if (!s.includes(a)) throw new Error(f + ' missing: ' + a.slice(0, 80)); s = s.replace(a, b); }
  fs.writeFileSync(K + f, s);
}
edit('index.html', [
  ['<main id="lw-home" class="baby-cozy">', '<main id="lw-home" class="baby-cozy" data-cms-sortable="섹션 순서">'],
  ['<img class="pe-world-image" data-world-image="0" src=', '<img class="pe-world-image" data-world-image="0" data-cms-item="media" data-cms-src="사진" data-cms-size="1920x1080" src='],
  ['<section class="cz-sec cz-wrap" id="cz-kids" aria-labelledby="cz-kids-title">', '<section class="cz-sec cz-wrap" id="cz-kids" aria-labelledby="cz-kids-title" data-cms="몇 개월">'],
  ['<h2 id="cz-kids-title">', '<h2 id="cz-kids-title" data-cms-text="제목">'],
  ['<article class="cz-baby cz-baby--newborn">', '<article class="cz-baby cz-baby--newborn" data-cms-item>'],
  ['<article class="cz-baby cz-baby--toddler">', '<article class="cz-baby cz-baby--toddler" data-cms-item>'],
  ['<p class="cz-baby__en">For Newborns</p>', '<p class="cz-baby__en" data-cms-text="영문">For Newborns</p>'],
  ['<p class="cz-baby__en">For Toddlers</p>', '<p class="cz-baby__en" data-cms-text="영문">For Toddlers</p>'],
  ['<img class="cz-baby__photo" src="/SkinImg/baby/card-newborn.webp"', '<img class="cz-baby__photo" data-cms-src="사진" src="/SkinImg/baby/card-newborn.webp"'],
  ['<img class="cz-baby__photo" src="/SkinImg/baby/card-toddler.webp"', '<img class="cz-baby__photo" data-cms-src="사진" src="/SkinImg/baby/card-toddler.webp"'],
  // 준비물 목록 (게시판에서 한 줄에 하나씩 바꿀 수 있게)
  ['      <div class="cz-checklist" data-starter-list></div>\n',
   '      <div class="cz-checklist" data-starter-list></div>\n' +
   '      <span hidden data-starter-items="newborn" data-cms-lines="신생아 준비물">배냇저고리와 내의\n속싸개와 겉싸개\n젖병과 세정 용품\n기저귀와 물티슈\n아기 침대와 침구\n카시트</span>\n' +
   '      <span hidden data-starter-items="toddler" data-cms-lines="걸음마 아기 준비물">이유식 식기와 스푼\n빨대컵\n턱받이\n걸음마 신발\n안전문과 모서리 보호대\n월령에 맞는 장난감</span>\n']
]);
edit('product/list.html', [
  ['<section class="baby-sale-help">', '<section class="baby-sale-help" data-cms="세일 구매 안내" data-cms-grow>']
]);
edit('baby/submenu-hero.html', [
  ['<section class="baby-page-hero baby-menu-hero" aria-label="컬렉션 안내">', '<section class="baby-page-hero baby-menu-hero" aria-label="컬렉션 안내" data-cms="목록 위 큰 배너" data-cms-adapter="menuHero" data-cms-page="목록 공통">']
]);
edit('baby/guide.html', [
  ['<main class="baby-guide">', '<main class="baby-guide" data-cms="가이드 본문" data-cms-page="가이드 페이지" data-cms-help="글 네 개는 메인 화면과 메뉴의 링크(#first-day, #outing, #sleep, #play)와 연결돼 있어 네 칸으로 정해져 있어요. 안내 목록은 한 줄에 하나씩 써요.">'],
  ['<header class="baby-guide-intro">', '<header class="baby-guide-intro" data-cms="가이드 머리글" data-cms-page="가이드 페이지">'],
  ['<article id="outing">', '<article id="outing" data-cms-item>'],
  ['<article id="sleep">', '<article id="sleep" data-cms-item>'],
  ['<p class="baby-guide-note">', '<p class="baby-guide-note" data-cms-text="맨 아래 안내">']
]);
console.log('ok');
