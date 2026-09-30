// 디자인센터 상세페이지용 : 섹션마다 「화면」 캡처 + 「편집 창」 캡처, 같은 번호 배지를 붙인다
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const DIR = 'D:/1. 클라우드 작업폴더/1.baby/_deploy/dc/';
const OUT = DIR + 'shots/'; fs.mkdirSync(OUT, { recursive: true });
const ED = JSON.parse(fs.readFileSync(DIR + 'editors.json', 'utf8'));
const CSS = fs.readFileSync(DIR + 'editor.css', 'utf8');
const SITE = 'https://ecudemo408995.cafe24.com/?edit=1';
const SECTIONS = ['첫 화면', '이용 안내', '몇 개월', '카테고리', '추천 상품 제목', '취향 찾기', '사이즈 가이드', '장면 속 상품', '기획전', '체크리스트', '함께 지내는 법', '회원 안내', '자주 묻는 질문', '맨 아래 브랜드', '이벤트 팝업'];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const BADGE = 'position:absolute;z-index:99999;width:30px;height:30px;border-radius:50%;background:#e5383b;color:#fff;font:800 16px/30px Arial,sans-serif;text-align:center;border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.45)';

// 편집 창 : 영역 전체 + 첫 번호 카드만 남기고, 쓸 칸 이름을 고른다
function editorLabels(html, name) {
  const cards = html.split('<div class="pcms__card">').slice(1);
  const keep = (name === '첫 화면' ? [cards[1], cards[0]] : cards.slice(0, 2)).join(' ');
  const labels = [...keep.matchAll(/<div class="pcms__label"><span>([^<]+)<\/span>/g)].map(m => m[1].trim());
  return [...new Set(labels)].filter(l => l !== '보이기' && !/링크|점$/.test(l));
}

(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', protocolTimeout: 300000 });
  const pg = await b.newPage();
  await pg.setUserAgent((await b.userAgent()).replace('HeadlessChrome', 'Chrome'));
  
  await pg.setViewport({ width: 1200, height: 1240 });
  await pg.goto(SITE, { waitUntil: 'networkidle2', timeout: 90000 });
  if (/challenge/.test(pg.url())) { console.log('CHALLENGE'); process.exit(1); }
  await sleep(4000);
  await pg.addStyleTag({ content: '*,*::before,*::after{transition-duration:0s!important;animation-duration:0s!important;animation-delay:0s!important} .cms-bar{display:none!important}' });
  await pg.evaluate(() => { const v = document.querySelector('.pe-world-video'); if (v) { v.pause(); v.currentTime = 0.9; } });

  const meta = [];
  const ep = await b.newPage();
  for (let i = 0; i < SECTIONS.length; i++) {
    const name = SECTIONS[i], id = String(i + 1).padStart(2, '0');
    if (i === 1) {
  // 한 번 끝까지 내려서 지연 로딩 이미지를 모두 불러온다
  for (let y = 0; y < 30000; y += 700) { await pg.evaluate(y => window.scrollTo(0, y), y); await sleep(120); }
  await sleep(2500);
    }
    const want = editorLabels(ED[name] || '', name);
    // 화면 : 섹션 안에서 같은 이름의 칸을 찾아 배지
    const r = await pg.evaluate((name, want, BADGE) => {
      document.querySelectorAll('.__bdg').forEach(e => e.remove());
      const sec = name === '이벤트 팝업' ? document.querySelector('#cz-pop .cz-pop__box') : [...document.querySelectorAll('[data-cms]')].find(e => e.getAttribute('data-cms') === name);
      if (!sec) return null;
      if (sec.getBoundingClientRect().height < 10) { sec.hidden = false; sec.classList.remove('cms-off'); sec.style.setProperty('display', 'block', 'important'); }
      window.scrollTo(0, name === '첫 화면' ? 0 : sec.getBoundingClientRect().top + scrollY - 60);
      const box = sec.getBoundingClientRect(), top = box.top + scrollY;
      const found = [];
      for (const l of want) {
        if (found.length >= 4) break;
        const el = [...sec.querySelectorAll('[data-cms-text],[data-cms-src],[data-cms-lines],[data-cms-list],[data-cms-links]')].find(e => [e.getAttribute('data-cms-text'), e.getAttribute('data-cms-src'), e.getAttribute('data-cms-lines'), e.getAttribute('data-cms-list'), e.getAttribute('data-cms-links')].includes(l) && e.getBoundingClientRect().width > 4 && getComputedStyle(e).visibility !== 'hidden');
        if (!el) continue;
        const q = el.getBoundingClientRect();
        if (q.top + scrollY - top > 1100) continue;   // 캡처 범위 밖
        found.push(l);
        const d = document.createElement('b'); d.className = '__bdg'; d.textContent = found.length; d.style.cssText = BADGE;
        const img = el.tagName === 'IMG' || el.tagName === 'VIDEO';
        d.style.left = Math.max(4, q.left + scrollX + (img ? q.width / 2 - 15 : -34)) + 'px';
        d.style.top = (q.top + scrollY + (img ? q.height / 2 - 15 : Math.min(q.height / 2 - 15, 6))) + 'px';
        if (!img && q.left < 40) d.style.left = (q.left + scrollX + 2) + 'px', d.style.top = (q.top + scrollY - 32) + 'px';
        document.body.appendChild(d);
      }
      const h2 = sec.querySelector('h2, h1'), kick = sec.querySelector('.cz-kicker, .pe-eyebrow, .cz-pop__kicker, em');
      return { top, left: box.left + scrollX, w: box.width, h: box.height, found, title: h2 ? h2.textContent.trim().replace(/\s+/g, ' ') : '', kicker: kick ? kick.textContent.trim().replace(/\s+/g, ' ') : '' };
    }, name, want, BADGE);
    if (!r || r.h < 10) { console.log('no section', name, r && r.h); continue; }
    await pg.bringToFront(); await sleep(900);
    const clipH = Math.min(r.h, name === '첫 화면' ? 820 : 1150);
    const clip = name === '이벤트 팝업' ? { x: r.left - 10, y: r.top - 10, width: r.w + 20, height: r.h + 20 } : { x: 0, y: r.top, width: 1200, height: clipH };
    if (name === '첫 화면') { await pg.screenshot({ path: OUT + 'tmp.png' }); require('child_process').execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', OUT + 'tmp.png', '-vf', 'crop=1200:860:0:0', '-q:v', '4', OUT + 'walk-' + id + '-page.jpg']); }
    else { await pg.evaluate(y => window.scrollTo(0, y), r.top - 70); await sleep(1000); const sy = await pg.evaluate(() => scrollY); const off = Math.max(0, Math.round(r.top - sy) - 40); await pg.screenshot({ path: OUT + 'tmp.png' }); require('child_process').execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', OUT + 'tmp.png', '-vf', 'crop=1200:' + Math.min(Math.round(clipH) + 40, 1240 - off) + ':0:' + off, '-q:v', '4', OUT + 'walk-' + id + '-page.jpg']);  }
    // 편집 창 : 같은 칸에 같은 번호
    const html = ED[name];
    const cards = html.split('<div class="pcms__card">');
    const trimmed = cards.slice(0, 3).join('<div class="pcms__card">') + (cards.length > 3 ? '</div></div>' : '');
    const more = cards.length > 3 ? '<div style="margin-top:14px;padding:12px;border-radius:12px;background:#f6f1ec;color:#8a6d5d;text-align:center;font-weight:700">▼ 아래 ' + (cards.length - 3) + '개 묶음도 같은 방법으로 바꿔요</div>' : '';
    await ep.bringToFront();
    await ep.setViewport({ width: 780, height: 900, deviceScaleFactor: 1.4 });
    await ep.setContent('<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"><style>body{margin:0;padding:18px;background:#fbf8f1}' + CSS + '.pcms__bar{position:static}</style></head><body><div id="wrap">' + trimmed.replace(/<\/div><\/div>$/, '') + more + '</div></body></html>', { waitUntil: 'load', timeout: 60000 }); await ep.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 1 : new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 8000); })))); await ep.evaluate(() => document.fonts.ready);
    await ep.evaluate((found, BADGE) => {
      found.forEach((l, i) => {
        const f = [...document.querySelectorAll('.pcms__field')].find(x => (x.querySelector('.pcms__label span') || {}).textContent === l);
        if (!f) return;
        f.style.boxShadow = 'inset 0 0 0 3px #e5383b'; f.style.borderRadius = '10px';
        const d = document.createElement('b'); d.textContent = i + 1; d.style.cssText = BADGE; d.style.right = '10px'; d.style.top = '10px';
        f.appendChild(d);
      });
      const marked = [...document.querySelectorAll('.pcms__field')].filter(f => f.querySelector('b[style]'));
      const last = marked[marked.length - 1];
      if (last) {
        const all = [...document.querySelectorAll('.pcms__field, .pcms__card, #wrap > div:not(.pcms)')];
        all.forEach(e => { if (last.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING && !e.contains(last) && !last.contains(e)) e.style.display = 'none'; });
        const note = document.createElement('div'); note.textContent = '▼ 아래 칸들도 같은 방법으로 바꿔요'; note.style.cssText = 'margin:0;padding:14px;background:#f6f1ec;color:#8a6d5d;text-align:center;font:700 15px Pretendard,sans-serif';
        last.after(note);
      }
    }, r.found, BADGE);
    await sleep(600);
    await (await ep.$('#wrap')).screenshot({ path: OUT + 'walk-' + id + '-edit.jpg', type: 'jpeg', quality: 86 });
    meta.push({ id, name, title: r.title, kicker: r.kicker, found: r.found });
    console.log(id, name, '|', r.title, '|', r.found.join(', '));
  }
  fs.writeFileSync(DIR + 'walk-meta.json', JSON.stringify(meta, null, 1));
  await b.close();
})();
