// 파트너센터 「상세소개 내용」 칸에 넣을 HTML 만들기
//   node docs/tools/designcenter/content-html.js <조각을 올린 커밋>
// 입력 : _deploy/dc/offsets.json (offsets.js 로 뽑은 제목 위치) — 조각마다 alt 글을 만든다
// 출력 : designcenter/baby/product-content.html
//   · 조각 이미지(922×1500)를 jsDelivr 주소(커밋 고정)로 차례로 넣는다. 자바스크립트 · style 블록 없이 인라인 스타일만
//   · 작업 진행 절차가 있는 조각 바로 밑에 실제로 눌리는 [주문서 접수하기] 버튼, 맨 아래 [샘플 사이트 둘러보기]
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '../../..');
const HASH = process.argv[2];
if (!HASH) { console.log('사용 : node content-html.js <커밋>'); process.exit(1); }

const REPO = 'tlsdmsrud902/baby';                     // ← 프로젝트마다 바꾼다
const DIR = 'designcenter/baby/';                       // ← 조각을 넣은 저장소 폴더
const BRAND = 'BABYANG';
const FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSf26MVAAFBO6btjz97kuKnjw6jvWKNdJ21ET3jIUsov0NTR_g/viewform?usp=header';
const SAMPLE = 'https://ecudemo408995.cafe24.com/';        // ← 샘플사이트
const STEP = 1500;

const o = JSON.parse(fs.readFileSync(path.join(ROOT, '_deploy/dc/offsets.json'), 'utf8'));
const count = fs.readdirSync(path.join(ROOT, DIR)).filter(f => /^detail-\d+\.jpg$/.test(f)).length;
const cta = Math.floor(o.find(x => x.t === '#cta').y / STEP) + 1;
const B = 'https://cdn.jsdelivr.net/gh/' + REPO + '@' + HASH + '/' + DIR;
let last = BRAND + ' 쇼핑몰 디자인';
const out = ['<div style="max-width:922px;margin:0 auto;">'];
for (let i = 0; i < count; i++) {
  const hs = o.filter(x => x.y >= i * STEP && x.y < (i + 1) * STEP && !x.t.startsWith('#')).map(x => x.t).filter(t => t.length < 40);
  const alt = hs.length ? (last = hs.slice(0, 3).join(' · ').replace(/['"]/g, '')) : last + ' (이어서)';
  out.push(`<img src="${B}detail-${String(i + 1).padStart(2, '0')}.jpg" alt="${BRAND} 상세 ${i + 1} - ${alt}" style="display:block;width:100%;max-width:922px;height:auto;margin:0;border:0;">`);
  if (i + 1 === cta) out.push(`<p style="margin:0;padding:18px 0;text-align:center;background:#eef3ff;"><a href="${FORM}" target="_blank" rel="noopener" style="display:inline-block;padding:12px 26px;border-radius:4px;background:#25a817;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;">주문서 접수하기</a></p>`);
}
out.push(`<p style="margin:0;padding:22px 0;text-align:center;background:#332b27;"><a href="${SAMPLE}" target="_blank" rel="noopener" style="display:inline-block;padding:12px 26px;border-radius:999px;background:#ffffff;color:#302821;font-size:14px;font-weight:bold;text-decoration:none;">샘플 사이트 둘러보기</a></p>`, '</div>');
fs.writeFileSync(path.join(ROOT, DIR, 'product-content.html'), out.join('\n'));
console.log('slices', count, 'cta after', cta, 'length', out.join('\n').length);
