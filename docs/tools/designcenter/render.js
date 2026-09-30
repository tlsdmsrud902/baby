const puppeteer = require('puppeteer-core');
const [,, src, out] = process.argv;
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--allow-file-access-from-files'] });
  const pg = await b.newPage(); await pg.setViewport({ width: 922, height: 1200 });
  await pg.goto('file:///' + src.split(String.fromCharCode(92)).join('/'), { waitUntil: 'networkidle0', timeout: 120000 });
  await pg.evaluate(() => document.fonts.ready); await new Promise(r => setTimeout(r, 1500));
  const h = await pg.evaluate(() => document.querySelector('.sheet, main, body').scrollHeight);
  await pg.screenshot({ path: out, fullPage: true });
  console.log('height', h);
  await b.close();
})();
