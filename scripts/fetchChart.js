/**
 * Fetch the full productchart.aspx (rate history) for an account id using the
 * persisted Cloudflare-cleared session, and dump it so we can parse the series.
 *
 * Run: node scripts/fetchChart.js <accountId>
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const PROFILE_DIR = path.join(__dirname, '.chrome-profile');
const OUT_DIR = path.join(__dirname, '.explore-out');

const id = process.argv[2] || '314018';
const url = `https://www.depositaccounts.com/banks/productchart.aspx?id=${id}&ver=1&highlight=1`;

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    userDataDir: PROFILE_DIR,
    defaultViewport: null,
    args: ['--disable-blink-features=AutomationControlled', '--no-first-run'],
  });
  const page = (await browser.pages())[0] || (await browser.newPage());
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36');
  console.log('Fetching', url);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 }).catch((e) => console.log('goto:', e.message));
  const html = await page.content();
  const out = path.join(OUT_DIR, `chart_${id}.html`);
  fs.writeFileSync(out, html);
  console.log('Saved', out, html.length, 'bytes');
  await browser.close();
})().catch((e) => { console.error('Fatal:', e); process.exit(1); });
