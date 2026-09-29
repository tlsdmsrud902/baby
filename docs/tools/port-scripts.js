// 펫 CMS 와 같이 바뀐 스크립트 부분을 baby 파일에 옮긴다 (배너 · 세일 타이머 · 쿠폰 · 메인 스크립트)
const fs = require('fs');
const K = 'D:/baby/babyyang902_s2_260925195134_d_skin1_E/skin1/';
function edit(f, pairs) {
  let s = fs.readFileSync(K + f, 'utf8');
  for (const [a, b] of pairs) { if (!s.includes(a)) throw new Error(f + ' missing: ' + a.slice(0, 90)); s = s.replace(a, b); }
  fs.writeFileSync(K + f, s);
}
edit('baby/submenu-hero.html', [
  [" var data={", " // 배너 내용 : 게시판 화면 관리의 '목록 위 큰 배너' 글로 바꿀 수 있다 (baby-cms.js 가 window.BABYANG_MENU_HERO 를 덮어쓴다)\n var banners=window.BABYANG_MENU_HERO=window.BABYANG_MENU_HERO||{"],
  [" }[key],img=hero.querySelector('img');\n hero.dataset.collection=key;img.alt=data[1];hero.querySelector('small').textContent=data[2];hero.querySelector('h1').innerHTML=data[3];hero.querySelector('p').innerHTML=data[4];\n",
   " },img=hero.querySelector('img');\n"],
  [" img.addEventListener('load',reveal,{once:true});img.addEventListener('error',reveal,{once:true});img.src='/SkinImg/baby/'+data[0];if(img.complete&&img.naturalWidth)reveal();",
   " function fill(){\n  var data=banners[key]||banners.all;\n  hero.dataset.collection=key;img.alt=data[1];hero.querySelector('small').textContent=data[2];hero.querySelector('h1').innerHTML=data[3];hero.querySelector('p').innerHTML=data[4];\n  img.addEventListener('load',reveal,{once:true});img.addEventListener('error',reveal,{once:true});img.src=/^(https?:)?\\/\\/|^\\//.test(data[0])?data[0]:'/SkinImg/baby/'+data[0];if(img.complete&&img.naturalWidth)reveal();\n }\n if(window.BABYANG_CMS)window.BABYANG_CMS.ready(fill,1200);else fill();"]
]);
edit('product/list.html', [
  ["\t\tinitSaleTimer((window.STORE_CONTENT && window.STORE_CONTENT.sale && window.STORE_CONTENT.sale.timer) || {});",
   "\t\t/* 게시판 화면 관리(baby-cms.js)의 '세일 타이머' 글이 들어온 뒤에 그린다 */\n\t\tvar startTimer = function () { initSaleTimer((window.STORE_CONTENT && window.STORE_CONTENT.sale && window.STORE_CONTENT.sale.timer) || {}); };\n\t\tif (window.BABYANG_CMS) window.BABYANG_CMS.ready(startTimer, 1200); else startTimer();"],
  ["(function () {\n\tvar box = document.getElementById('stSaleCoupon');",
   "(function () {\n/* 게시판 화면 관리(baby-cms.js)의 '세일 쿠폰 뽑기' 글이 들어온 뒤에 그린다 */\nfunction runCoupon() {\n\tvar box = document.getElementById('stSaleCoupon');"]
]);
// 쿠폰 블록 끝 : 첫 번째로 나오는 "…catch(function () { msg(…) });\n}());" 뒤에 runCoupon 호출을 넣는다
{
  let s = fs.readFileSync(K + 'product/list.html', 'utf8');
  const start = s.indexOf('function runCoupon() {');
  const end = s.indexOf('\n}());', start);
  if (start < 0 || end < 0) throw new Error('coupon end not found');
  s = s.slice(0, end) + "\n}\nif (window.BABYANG_CMS) window.BABYANG_CMS.ready(runCoupon, 1500); else runCoupon();" + s.slice(end);
  fs.writeFileSync(K + 'product/list.html', s);
}
console.log('ok');
