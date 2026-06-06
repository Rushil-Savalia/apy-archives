/**
 * Discovery helper: for each bank URL, list the savings/money-market accounts
 * with their account id + current APY, grouped by section. Use the output to
 * pick the right HYSA name to put in scrapeHistory.js's TARGETS.
 *
 * Run: node scripts/discoverAccounts.js
 */
const path = require('path');
const puppeteer = require('puppeteer');

const PROFILE_DIR = path.join(__dirname, '.chrome-profile');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const URLS = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      'https://www.depositaccounts.com/banks/ally-bank.html',
      'https://www.depositaccounts.com/banks/cit-bank.html',
      'https://www.depositaccounts.com/banks/sofi-bank.html',
      'https://www.depositaccounts.com/banks/american-express-national-bank.html',
      'https://www.depositaccounts.com/banks/western-alliance-bank.html',
    ];

async function waitForRealPage(page, timeoutMs = 300000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const title = await page.title().catch(() => '');
    if (!/just a moment|attention required|verifying/i.test(title)) {
      const ok = await page
        .evaluate(() => document.body && document.body.innerText.length > 500)
        .catch(() => false);
      if (ok) return true;
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  return false;
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: CHROME,
    userDataDir: PROFILE_DIR,
    defaultViewport: null,
    args: ['--disable-blink-features=AutomationControlled', '--no-first-run'],
  });
  const page = (await browser.pages())[0] || (await browser.newPage());
  await page.setUserAgent(UA);

  for (const url of URLS) {
    await page
      .goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
      .catch((e) => console.log('goto:', e.message));
    if (!(await waitForRealPage(page))) {
      console.log(`\n## ${url}\n  !! blocked`);
      continue;
    }
    const title = await page.title();
    // Walk the DOM; track the most recent <h3> section header before each row.
    const rows = await page.evaluate(() => {
      const out = [];
      let section = '';
      const walk = document.querySelectorAll('h3, a.expand[data-account]');
      walk.forEach((el) => {
        if (el.tagName === 'H3') {
          section = el.textContent.trim();
          return;
        }
        const id = el.getAttribute('data-account');
        const row = el.closest('tr');
        let name = '';
        let apy = '';
        if (row) {
          row.querySelectorAll('td').forEach((td) => {
            const t = td.textContent.trim();
            if (!t) return;
            if (td.classList.contains('apy')) { apy = t; return; }
            if (td.contains(el)) return;
            if (/%$/.test(t)) return;
            if (t.length > name.length) name = t;
          });
        }
        out.push({ section, id, name, apy });
      });
      return out;
    });

    console.log(`\n## ${title}\n   ${url}`);
    rows
      .filter((r) => /saving|money market/i.test(r.section))
      .forEach((r) =>
        console.log(`   [${r.id}] ${r.apy.padEnd(8)} ${r.name}   (${r.section})`)
      );
  }

  await browser.close();
})().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
