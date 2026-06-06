/**
 * Exploration probe for DepositAccounts.com (Cloudflare-protected).
 *
 * Launches a VISIBLE Chrome window with a persistent profile so the Cloudflare
 * "Just a moment..." clearance cookie is remembered between runs. You solve the
 * challenge manually (click the checkbox) in the window if it appears; the script
 * waits for the real page, then dumps its HTML so we can see the structure.
 *
 * Run: node scripts/explore.js [url]
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const PROFILE_DIR = path.join(__dirname, '.chrome-profile');
const OUT_DIR = path.join(__dirname, '.explore-out');

const url =
  process.argv[2] ||
  'https://www.depositaccounts.com/banks/marcus-goldman-sachs.html';

// We know we're past Cloudflare when the tab title is no longer the challenge
// page and some real content selector exists.
async function waitForRealPage(page, timeoutMs = 300000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const title = await page.title().catch(() => '');
    const isChallenge =
      /just a moment|attention required|verifying/i.test(title);
    const hasBody = await page
      .evaluate(() => document.body && document.body.innerText.length > 500)
      .catch(() => false);
    if (!isChallenge && hasBody) return true;
    await new Promise((r) => setTimeout(r, 1500));
  }
  return false;
}

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log('Launching visible Chrome (solve Cloudflare in the window if asked)...');
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    userDataDir: PROFILE_DIR,
    defaultViewport: null,
    args: ['--disable-blink-features=AutomationControlled', '--no-first-run'],
  });

  const page = (await browser.pages())[0] || (await browser.newPage());
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
  );

  console.log(`Navigating to ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch((e) =>
    console.log('initial goto note:', e.message)
  );

  console.log('Waiting for the real page (up to 5 min)... solve Cloudflare now if shown.');
  const ok = await waitForRealPage(page);
  if (!ok) {
    console.log('Timed out waiting for real page. Dumping whatever is there.');
  } else {
    console.log('Real page detected. Dumping...');
  }

  const html = await page.content();
  const title = await page.title();
  const slug = url.replace(/[^a-z0-9]+/gi, '_').slice(0, 60);
  const htmlPath = path.join(OUT_DIR, `${slug}.html`);
  fs.writeFileSync(htmlPath, html);

  // Also dump the page's visible text and all links for quick structural review.
  const info = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href]')).map((a) => ({
      text: a.textContent.trim().slice(0, 60),
      href: a.href,
    }));
    return { text: document.body.innerText, links };
  });
  fs.writeFileSync(path.join(OUT_DIR, `${slug}.txt`), info.text);
  fs.writeFileSync(
    path.join(OUT_DIR, `${slug}.links.json`),
    JSON.stringify(info.links, null, 2)
  );

  console.log('---');
  console.log('Title:', title);
  console.log('Saved HTML  ->', htmlPath);
  console.log('Saved text  ->', path.join(OUT_DIR, `${slug}.txt`));
  console.log('Saved links ->', path.join(OUT_DIR, `${slug}.links.json`));
  console.log('Leaving the browser open for 20s so the session/cookies settle...');
  await new Promise((r) => setTimeout(r, 20000));
  await browser.close();
  console.log('Done.');
})().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
