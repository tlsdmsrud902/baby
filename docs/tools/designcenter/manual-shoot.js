const fs = require('fs');
// baby앙 설명서용 쇼핑몰 화면 캡처 (로그인 없이 보이는 편집 모드 화면만)
// node shoot.js [이름,이름…]
const puppeteer = require('puppeteer-core');
const OUT = 'D:/1. 클라우드 작업폴더/1.baby/_deploy/dc/shots/';
const BASE = 'https://ecudemo408995.cafe24.com';
const only = process.argv[2] ? process.argv[2].split(',') : null;
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function open(pg, url, vp, keepBar) {
  await pg.setViewport(vp);
  await pg.goto(BASE + url, { waitUntil: 'networkidle2', timeout: 90000 });
  if (/challenge/.test(pg.url())) throw new Error('CHALLENGE ' + url);
  await sleep(3500);
  await pg.evaluate(() => {
    const v = document.querySelector('.pe-world-video'); if (v) { v.pause(); v.currentTime = 0.9; }
    document.querySelectorAll('.cz-popup, #cz-popup, [data-popup], .ec-base-layer').forEach(e => { if (!e.closest('[data-keep]')) e.style.display = 'none'; });
  });
  await pg.addStyleTag({ content: "*,*::before,*::after{transition-duration:0s!important;transition-delay:0s!important;animation-duration:0s!important;animation-delay:0s!important}" });
  if (!keepBar) await pg.evaluate(() => { const b = document.querySelector(".cms-bar"); if (b) b.style.display = "none"; });
  await sleep(800);
}
async function toSec(pg, name, off = 120) {
  for (let i = 0; i < 3; i++) {
    await pg.evaluate((name, off) => {
      document.documentElement.style.scrollBehavior = "auto";
      const s = [...document.querySelectorAll("[data-cms]")].find(e => e.getAttribute("data-cms") === name);
      if (!s) throw new Error("no sec " + name);
      window.scrollTo({ top: s.getBoundingClientRect().top + scrollY - off, behavior: "instant" });
    }, name, off);
    await sleep(1200);
  }
}
async function secClip(pg, name, w, h, above = 30) {
  const r = await pg.evaluate((name) => { const s = [...document.querySelectorAll("[data-cms]")].find(e => e.getAttribute("data-cms") === name); const b = s.getBoundingClientRect(); return { y: b.top + scrollY }; }, name);
  await pg.evaluate(y => window.scrollTo({ top: y, behavior: "instant" }), r.y - 200); await sleep(2000);
  const r2 = await pg.evaluate((name) => { const s = [...document.querySelectorAll("[data-cms]")].find(e => e.getAttribute("data-cms") === name); const b = s.getBoundingClientRect(); return { y: b.top + scrollY }; }, name);
  return { clip: { x: 0, y: Math.max(0, r2.y - above), width: w, height: h } };
}
const shots = {
  'cms-home': async pg => { await open(pg, '/?edit=1', { width: 1280, height: 820 }, true); },
  'cms-bar-go': async pg => { await open(pg, '/?edit=1', { width: 1280, height: 820 }, true); return { el: '.cms-bar' }; },
  'cms-before': async pg => { await open(pg, '/?edit=1', { width: 1280, height: 820 }); },
  'cms-after': async pg => { await open(pg, '/?edit=1', { width: 1280, height: 820 });
    await pg.evaluate(() => { const h = document.getElementById('pe-title'); if (h) h.innerHTML = '우리 아이 첫 옷,<br>baby앙에서 골라요.'; }); },
  'step-edit': async pg => { await open(pg, '/?edit=1', { width: 640, height: 480, deviceScaleFactor: 2 }); return secClip(pg, '카테고리', 640, 480); },
  'feat-hidden': async pg => { await open(pg, '/?edit=1', { width: 640, height: 480, deviceScaleFactor: 2 });
    await pg.evaluate(() => { const s = [...document.querySelectorAll('[data-cms]')].find(e => e.getAttribute('data-cms') === '맨 아래 브랜드'); s.classList.add('cms-off'); const v = document.createElement('div'); v.className = 'cms-off-veil'; s.appendChild(v); const t = document.createElement('div'); t.className = 'cms-off-tag'; t.textContent = '숨김 · 방문자에게 안 보여요'; s.appendChild(t); });
    await sleep(500); return secClip(pg, '맨 아래 브랜드', 640, 480); },
  'feat-order-save': async pg => { await open(pg, '/?edit=1', { width: 1100, height: 640 }); await toSec(pg, '카테고리', 60);
    const ok = await pg.evaluate(() => { const s = [...document.querySelectorAll('[data-cms]')].find(e => e.getAttribute('data-cms') === '카테고리'); const b = [...s.querySelectorAll('.cms-order button, .cms-order a')].find(x => /↑/.test(x.textContent)); if (b) { b.click(); return true; } return false; });
    if (!ok) console.log('  (순서 버튼 못 찾음)'); await sleep(1200); await toSec(pg, '카테고리', 200); },
  'cms-sale': async pg => { await open(pg, '/product/list.html?cate_no=27&edit=1', { width: 1280, height: 820 }); },
  'cms-list': async pg => { await open(pg, '/product/list.html?cate_no=24&edit=1', { width: 1280, height: 820 }); },
  'cms-board': async pg => { await open(pg, '/board/product/list.html?board_no=4&edit=1', { width: 1280, height: 820 }); },
  'cms-guide': async pg => { await open(pg, '/baby/guide.html?edit=1', { width: 1280, height: 820 }); },
  'story-1': async pg => { await open(pg, '/?edit=1', { width: 1100, height: 680 }); },
  'kakao-win': async pg => { await open(pg, '/?edit=1', { width: 1280, height: 900 }, true);
    await pg.evaluate(() => { const b = [...document.querySelectorAll('.cms-bar button, .cms-bar a')].find(x => /카카오톡 상담 연결/.test(x.textContent)); b.click(); }); await sleep(1500); },
  'walk-popup-page': async pg => { await open(pg, '/?edit=1', { width: 420, height: 800, deviceScaleFactor: 2 }); await pg.evaluate(() => document.querySelector('#cz-pop .cz-pop__box').scrollIntoView({ block: 'center' })); await sleep(2500); return { el: '#cz-pop .cz-pop__box' }; },
  'cms-mobile': async pg => { await open(pg, '/?edit=1', { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }); },
};
const rects = {};
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
  const pg = await b.newPage();
  await pg.setUserAgent((await b.userAgent()).replace('HeadlessChrome', 'Chrome'));
  for (const [name, fn] of Object.entries(shots)) {
    if (only && !only.includes(name)) continue;
    try {
      const r = await fn(pg) || {};
      if (r.clip) await pg.screenshot({ path: OUT + name + '.jpg', type: 'jpeg', quality: 88, clip: r.clip, captureBeyondViewport: true });
      else if (r.el) await (await pg.$(r.el)).screenshot({ path: OUT + name + '.jpg', type: 'jpeg', quality: 88 });
      else await pg.screenshot({ path: OUT + name + '.jpg', type: 'jpeg', quality: 88 });
      const dpr = (pg.viewport() || {}).deviceScaleFactor || 1;
      const oy = r.clip ? r.clip.y : 0;
      const els = r.el ? null : await pg.evaluate((oy, useScroll) => {
        const pick = [...document.querySelectorAll(".cms-btn, .cms-bar, .cms-order, .cms-order-save, .cms-off-tag, [data-s9=kakao], .cms-bar button, .cz-pop__box, .cms-kk")];
        return pick.map(e => { const b = e.getBoundingClientRect(); if (!b.width) return null; const y = useScroll ? b.top + scrollY - oy : b.top; if (y > 3000 || y + b.height < 0) return null; return [(e.className && String(e.className).split(" ")[0]) || e.tagName, e.textContent.trim().replace(/s+/g, " ").slice(0, 18), Math.round(b.left), Math.round(y), Math.round(b.width), Math.round(b.height)]; }).filter(Boolean);
      }, oy, !!r.clip);
      rects[name] = { dpr, els };
      console.log('ok', name);
    } catch (e) { console.log('FAIL', name, e.message); if (/CHALLENGE/.test(e.message)) break; }
    await sleep(1500);
  }
  await b.close();
  const old = fs.existsSync(OUT + '../rects.json') ? JSON.parse(fs.readFileSync(OUT + '../rects.json', 'utf8')) : {};
  fs.writeFileSync(OUT + '../rects.json', JSON.stringify(Object.assign(old, rects), null, 1));
})();
