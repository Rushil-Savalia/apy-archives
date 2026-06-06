/** Screenshot the running dev app for visual verification. */
const path = require('path');
const puppeteer = require('puppeteer');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const out = process.argv[2] || path.join(__dirname, '.explore-out', 'app.png');
const fs = require('fs');
(async () => {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const browser = await puppeteer.launch({ headless: 'new', executablePath: CHROME, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const w = parseInt(process.argv[3] || '1400', 10);
  await page.setViewport({ width: w, height: 1600, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2500)); // let the chart render
  await page.screenshot({ path: out, fullPage: true });
  console.log('saved', out);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
