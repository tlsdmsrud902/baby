const puppeteer = require('puppeteer-core');
const OUT = 'D:/1. 클라우드 작업폴더/1.baby/_deploy/dc/';
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
  const pg = await b.newPage();
  await pg.setUserAgent((await b.userAgent()).replace('HeadlessChrome', 'Chrome'));
  for (const [name, vp, t] of [['desk', { width: 1280, height: 820 }, 1.2], ['mobile', { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, 1.2], ['desk-sale', { width: 1280, height: 820 }, 0]]) {
    await pg.setViewport(vp);
    await pg.goto('https://ecudemo408995.cafe24.com/' + (name === 'desk-sale' ? 'product/list.html?cate_no=27' : ''), { waitUntil: 'networkidle2', timeout: 90000 });
    if (/challenge/.test(pg.url())) { console.log('CHALLENGE'); break; }
    await sleep(4000);
    await pg.addStyleTag({ content: '*,*::before,*::after{transition-duration:0s!important;animation-duration:0s!important} #cz-pop,.cz-pop{display:none!important}' });
    await pg.evaluate(t => { const v = document.querySelector('.pe-world-video'); if (v) { v.pause(); v.currentTime = t; } }, t);
    await sleep(1500);
    await pg.screenshot({ path: OUT + name + '.png' });
    console.log('ok', name);
  }
  await b.close();
})();
