const puppeteer = require('puppeteer-core');
const fs = require('fs');
const [,, src, outDir, step = '1500'] = process.argv;
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--allow-file-access-from-files'], protocolTimeout: 300000 });
  const pg = await b.newPage(); const S = +step;
  await pg.setViewport({ width: 922, height: S });
  await pg.goto('file:///' + src, { waitUntil: 'networkidle0', timeout: 120000 });
  await pg.evaluate(() => document.fonts.ready); await new Promise(r => setTimeout(r, 1500));
  const H = await pg.evaluate(() => document.documentElement.scrollHeight);
  fs.mkdirSync(outDir, { recursive: true });
  let i = 0;
  for (let y = 0; y < H; y += S) {
    const h = Math.min(S, H - y);
    await pg.evaluate(y => window.scrollTo(0, y), y); await new Promise(r => setTimeout(r, 300));
    const sy = await pg.evaluate(() => scrollY);
    i++;
    await pg.screenshot({ path: outDir + '/detail-' + String(i).padStart(2, '0') + '.jpg', type: 'jpeg', quality: 84, clip: { x: 0, y: y, width: 922, height: h }, captureBeyondViewport: false });
  }
  console.log('height', H, 'slices', i);
  await b.close();
})();
