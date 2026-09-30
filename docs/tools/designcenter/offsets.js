const puppeteer = require('puppeteer-core');
const fs = require('fs');
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--allow-file-access-from-files'] });
  const pg = await b.newPage(); await pg.setViewport({ width: 922, height: 1500 });
  await pg.goto('file:///' + process.argv[2], { waitUntil: 'networkidle0', timeout: 120000 });
  await pg.evaluate(() => document.fonts.ready);
  const r = await pg.evaluate(() => [...document.querySelectorAll('h1, h2, h3, #process, .process-cta')].map(e => ({ t: e.id === 'process' ? '#process' : e.classList.contains('process-cta') ? '#cta' : e.textContent.trim().replace(/\s+/g, ' '), y: Math.round(e.getBoundingClientRect().top + scrollY) })));
  fs.writeFileSync(process.argv[3], JSON.stringify(r, null, 0));
  await b.close();
})();
