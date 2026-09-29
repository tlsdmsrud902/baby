// CSS · 설정 · layout 연결 · 메인 스크립트 연결부 (펫 CMS 커밋과 같은 내용)
const fs = require('fs');
const B = 'D:/baby/babyyang902_s2_260925195134_d_skin1_E/skin1/layout/basic/';
function edit(f, pairs) {
  let s = fs.readFileSync(B + f, 'utf8');
  for (const [a, b] of pairs) { if (!s.includes(a)) throw new Error(f + ' missing: ' + a.slice(0, 90)); s = s.replace(a, b); }
  fs.writeFileSync(B + f, s);
}
// 1) CSS
fs.appendFileSync(B + 'css/baby-cozy-home.css', `

/* 게시판 화면 관리 (baby-cms.js)
   · 게시판 글에서 "보이기: 아니오" 로 끈 영역 (편집 모드 ?edit=1 에서는 흐린 막을 씌워 보여 준다)
   · 첫 방문에 게시판 내용을 읽는 동안(최대 1.2초) 바뀔 글자·사진을 잠깐 가려 기본값이 번쩍이지 않게 한다 */
html:not(.cms-edit) .cms-off{display:none!important}
.cms-wait [data-cms] [data-cms-text],.cms-wait [data-cms] [data-cms-src],.cms-wait [data-cms] [data-cms-links]{visibility:hidden}
`);
// 2) 설정
edit('js/store-content.js', [[
  "\t\t\t{ label: '상품문의',     link: '/board/product/list.html?board_no=6' }\n\t\t]\n\t},\n",
  "\t\t\t{ label: '상품문의',     link: '/board/product/list.html?board_no=6' }\n\t\t]\n\t},\n\n" +
  "\t/* ---------------------------------------------------------------------\n" +
  "\t   1-1. 게시판 화면 관리 (메인 화면의 사진·글자를 게시판 글로 바꾸기)    BUYER EDITABLE\n" +
  "\t   메인 주소 뒤에 ?edit=1 을 붙여 열면(예: 내쇼핑몰.cafe24.com/?edit=1) 영역마다 [고치기] 버튼이 나옵니다.\n" +
  "\t   boardNo : 화면 관리에 쓸 게시판 번호. 기본 2 = 카페24 기본 게시판 '뉴스/이벤트'(관리자만 글쓰기).\n" +
  "\t             뉴스/이벤트 게시판을 다른 용도로 쓰고 있다면, 관리자만 글쓰기로 만든 다른 게시판 번호를 넣으세요.\n" +
  "\t             0 이면 화면 관리를 끄고 HTML 기본값만 씁니다.\n" +
  "\t   cacheMinutes : 방문자 브라우저가 게시판 목록을 다시 확인하는 간격(분). 새 글은 이 시간 안에, 이미 있던 글을 고친 내용은 늦어도 30분 안에 모두에게 보입니다.\n" +
  "\t                  (관리자는 ?edit=1 편집 모드로 열면 항상 바로 보입니다. 너무 줄이면 카페24가 잦은 요청으로 접속을 잠시 막을 수 있어요)\n" +
  "\t   --------------------------------------------------------------------- */\n" +
  "\tcms: {\n\t\tboardNo: 2,\n\t\tcacheMinutes: 10,\n\t\ttitlePrefix: '[메인 화면]'\n\t},\n"
]]);
// 3) layout : 설정 파일 바로 뒤에 화면 관리 스크립트
edit('layout.html', [[
  '\t<script src="/layout/basic/js/store-content.js?v=20260927r"></script>',
  '\t<script src="/layout/basic/js/store-content.js?v=20260929c"></script>\n\t<!-- 게시판 화면 관리 : 메인의 사진·글자를 게시판 글로 바꾼다 (설정 = store-content.js 의 cms) -->\n\t<script src="/layout/basic/js/baby-cms.js?v=20260929b"></script>'
]]);
// 4) 메인 스크립트 연결부
edit('js/baby-cozy-home.js', [
  ["      toddler: ['이유식 식기와 스푼', '빨대컵', '턱받이', '걸음마 신발', '안전문과 모서리 보호대', '월령에 맞는 장난감']\n    };\n",
   "      toddler: ['이유식 식기와 스푼', '빨대컵', '턱받이', '걸음마 신발', '안전문과 모서리 보호대', '월령에 맞는 장난감']\n    };\n" +
   "    // 준비물 목록은 HTML 의 [data-starter-items] (게시판 화면 관리로 바꿀 수 있다)\n" +
   "    function readItems() {\n" +
   "      root.querySelectorAll('[data-starter-items]').forEach(function (el) {\n" +
   "        var list = el.textContent.split('\\n').map(function (t) { return t.trim(); }).filter(Boolean);\n" +
   "        if (list.length) items[el.getAttribute('data-starter-items')] = list;\n" +
   "      });\n" +
   "      ['newborn', 'toddler'].forEach(function (k) { saved[k] = saved[k].filter(function (n) { return n < items[k].length; }); });\n" +
   "    }\n" +
   "    readItems();\n"],
  ["    root.querySelector('[data-starter-reset]').addEventListener('click', function () { saved[baby] = []; render(); });\n",
   "    root.querySelector('[data-starter-reset]').addEventListener('click', function () { saved[baby] = []; render(); });\n    document.addEventListener('babyang:cms', function () { readItems(); render(); });\n"],
  ["    try { if (Number(localStorage.getItem(KEY)) > Date.now()) return; } catch (e) {}\n",
   "    var editing = /[?&]edit=1/.test(location.search); // 편집 모드에서는 '오늘 하루 닫기'와 상관없이 띄운다\n" +
   "    try { if (!editing && Number(localStorage.getItem(KEY)) > Date.now()) return; } catch (e) {}\n" +
   "    // 게시판 화면 관리(baby-cms.js)의 '이벤트 팝업' 글이 들어온 뒤에 그린다\n" +
   "    if (window.BABYANG_CMS && !pop.__cmsWaited) { pop.__cmsWaited = true; window.BABYANG_CMS.ready(initPopup, 900); return; }\n"],
  ["    function openQV(no, from) {\n      var p = data[no];\n      if (!p || !qv) return;\n",
   "    // 상품 사진 : 목록 데이터는 파일 이름, 게시판 화면 관리로 추가한 상품(baby-cms.js 가 채움)은 전체 주소\n" +
   "    var imgUrl = function (p) { return /^(https?:)?\\/\\//.test(p.img) ? p.img : IMG + p.img + '.webp'; };\n" +
   "    function openQV(no, from) {\n      var p = data[no] || (window.BABYANG_PRODUCTS || {})[no];\n      if (!p || !qv) { if (no) location.href = '/product/detail.html?product_no=' + no; return; }\n"],
  ["      img.src = IMG + p.img + '.webp'; img.alt = p.name;\n      qv.querySelector('.cz-qv__cat').textContent = p.cat;\n",
   "      img.src = imgUrl(p); img.alt = p.name;\n      qv.querySelector('.cz-qv__cat').textContent = p.cat || '';\n"],
  ["      qv.querySelector('.cz-qv__desc').textContent = p.desc;\n", "      qv.querySelector('.cz-qv__desc').textContent = p.desc || '';\n"],
  ["    sec.querySelectorAll('[data-prd]').forEach(function (b) {\n      b.addEventListener('click', function () { openQV(b.dataset.prd, b); });\n    });\n",
   "    // 점·목록은 게시판 화면 관리로 다시 그려질 수 있어 섹션에서 한 번에 받는다\n" +
   "    sec.addEventListener('click', function (e) {\n" +
   "      var b = e.target.closest && e.target.closest('[data-prd]');\n" +
   "      if (b && sec.contains(b) && !document.documentElement.classList.contains('cms-edit')) openQV(b.dataset.prd, b);\n" +
   "    });\n"],
  ["    var preload = function () { Object.keys(data).forEach(function (k) { new Image().src = IMG + data[k].img + '.webp'; }); };",
   "    var preload = function () { Object.keys(data).forEach(function (k) { new Image().src = imgUrl(data[k]); }); };"],
  ["    var root = document.querySelector('.baby-cozy');\n    if (!root) return;\n",
   "    var root = document.querySelector('.baby-cozy');\n    if (!root) return;\n    if (window.BABYANG_CMS) window.BABYANG_CMS.applyCached(); // 게시판으로 바꾼 사진·글자를 인터랙션보다 먼저 넣는다\n"]
]);
console.log('ok');
