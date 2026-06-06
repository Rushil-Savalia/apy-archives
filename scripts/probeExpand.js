/**
 * Probe: open a bank page, click an account's expand dropdown, and capture
 * the network requests + resulting DOM so we can find the rate-history data.
 *
 * Run: node scripts/probeExpand.js <bankUrl> <accountId>
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const PROFILE_DIR = path.join(__dirname, '.chrome-profile');
const OUT_DIR = path.join(__dirname, '.explore-out');

const bankUrl = process.argv[2] || 'https://www.depositaccounts.com/banks/marcus-goldman-sachs.html';
const accountId = process.argv[3] || '314018';

async function waitForRealPage(page, timeoutMs = 300000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const title = await page.title().catch(() => '');
    if (!/just a moment|attention required|verifying/i.test(title)) {
      const ok = await page.evaluate(() => document.body && document.body.innerText.length > 500).catch(() => false);
      if (ok) return true;
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  return false;
}

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

  const captured = [];
  page.on('response', async (resp) => {
    try {
      const url = resp.url();
      const ct = (resp.headers()['content-type'] || '');
      // Only care about XHR/fetch-ish dynamic data, not images/css/fonts.
      if (/\.(png|jpg|jpeg|gif|woff2?|css|svg|ico)(\?|$)/i.test(url)) return;
      if (!/json|javascript|text|html/i.test(ct)) return;
      if (/google|doubleclick|lendingtree|ketch|analytics|gpt|pointyspr/i.test(url)) return;
      let body = '';
      try { body = await resp.text(); } catch (_) {}
      captured.push({ url, status: resp.status(), ct, len: body.length, body: body.slice(0, 4000) });
    } catch (_) {}
  });

  console.log(`Loading ${bankUrl}`);
  await page.goto(bankUrl, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch((e) => console.log('goto:', e.message));
  if (!(await waitForRealPage(page))) { console.log('Did not get past challenge'); }

  // Scroll to the account's expand link and click it.
  console.log(`Clicking expand for account ${accountId}...`);
  const beforeCount = captured.length;
  const clicked = await page.evaluate((id) => {
    const a = document.querySelector(`a.expand[data-account="${id}"]`);
    if (!a) return false;
    a.scrollIntoView({ block: 'center' });
    a.click();
    return true;
  }, accountId);
  console.log('clicked:', clicked);

  // Give the AJAX + chart time to render.
  await new Promise((r) => setTimeout(r, 6000));

  // Dump the expanded row DOM (the container that now holds the history graph/table).
  const expandedHtml = await page.evaluate((id) => {
    const a = document.querySelector(`a.expand[data-account="${id}"]`);
    if (!a) return null;
    // Walk up to the row, then capture the following expanded detail content.
    let row = a.closest('tr');
    let html = '';
    let n = row;
    for (let i = 0; i < 4 && n; i++) { html += '\n<!--row-->' + n.outerHTML; n = n.nextElementSibling; }
    // Also grab any element that looks like a history/chart container on the page.
    const charts = Array.from(document.querySelectorAll('[id*="history" i],[class*="history" i],[id*="chart" i],[class*="chart" i],svg,canvas'))
      .map((el) => ({ tag: el.tagName, id: el.id, cls: el.className && el.className.toString && el.className.toString().slice(0,80) }));
    return { html: html.slice(0, 20000), charts };
  }, accountId);

  fs.writeFileSync(path.join(OUT_DIR, `expand_${accountId}.html`), (expandedHtml && expandedHtml.html) || 'NONE');
  fs.writeFileSync(path.join(OUT_DIR, `expand_${accountId}.network.json`), JSON.stringify(captured.slice(beforeCount), null, 2));
  fs.writeFileSync(path.join(OUT_DIR, `expand_${accountId}.charts.json`), JSON.stringify((expandedHtml && expandedHtml.charts) || [], null, 2));

  console.log('--- new network requests after click:', captured.length - beforeCount);
  captured.slice(beforeCount).forEach((c) => console.log(`  [${c.status}] (${c.len}b) ${c.url}`));
  console.log('Saved expand DOM + network + charts to .explore-out/');
  console.log('Leaving browser open 15s...');
  await new Promise((r) => setTimeout(r, 15000));
  await browser.close();
})().catch((e) => { console.error('Fatal:', e); process.exit(1); });
