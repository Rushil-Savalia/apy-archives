/**
 * Scrape historical APY (rate history over time) from DepositAccounts.com.
 *
 * How it works:
 *  - DepositAccounts hides each account's rate history behind a dropdown that
 *    fetches `productchart.aspx?id=<accountId>`. That page embeds the full
 *    history as Google Charts rows: [new Date(y, m0, d), apyDecimal, ...].
 *  - For each configured bank we open its page, find the target savings
 *    account's id by matching the account name, then fetch + parse its chart.
 *  - The raw series marks plateaus (a point at the start and end of each rate
 *    period); we collapse it to rate-CHANGE events: one row per APY change,
 *    dated to when that APY took effect.
 *
 * The site is behind Cloudflare, so we use a VISIBLE Chrome with a persistent
 * profile (scripts/.chrome-profile). Solve the challenge once in the window and
 * the clearance cookie is remembered for later runs.
 *
 * Run: node scripts/scrapeHistory.js
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const PROFILE_DIR = path.join(__dirname, '.chrome-profile');
const OUT_CSV = path.join(__dirname, '..', 'data', 'apy_history.csv');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

// Add more banks/accounts here once the first two are confirmed working.
// accountName is matched (case-insensitive, trimmed) against the rows on the
// bank's page; the script discovers the account id automatically.
const TARGETS = [
  {
    bankName: 'Marcus by Goldman Sachs',
    bankUrl: 'https://www.depositaccounts.com/banks/marcus-goldman-sachs.html',
    accountName: 'Online Savings Account',
  },
  {
    bankName: 'Capital One 360',
    bankUrl: 'https://www.depositaccounts.com/banks/capital-one-360.html',
    accountName: '360 Performance Savings',
  },
  {
    bankName: 'Ally Bank',
    bankUrl: 'https://www.depositaccounts.com/banks/ally-bank.html',
    accountName: 'Online Savings Account',
  },
  {
    bankName: 'CIT Bank',
    bankUrl: 'https://www.depositaccounts.com/banks/cit-bank.html',
    accountName: 'Platinum Savings',
  },
  {
    bankName: 'SoFi',
    bankUrl: 'https://www.depositaccounts.com/banks/sofi-bank.html',
    accountName: 'SoFi Checking and Savings',
  },
  {
    bankName: 'American Express',
    bankUrl:
      'https://www.depositaccounts.com/banks/american-express-national-bank.html',
    accountName: 'High Yield Savings Account',
  },
  {
    bankName: 'Western Alliance',
    bankUrl: 'https://www.depositaccounts.com/banks/western-alliance-bank.html',
    accountName: 'High-Yield Savings Premier',
  },
  {
    bankName: 'Primis Bank',
    bankUrl: 'https://www.depositaccounts.com/banks/primis.html',
    accountName: 'Primis Savings Account - Online Only',
  },
  {
    bankName: 'Sallie Mae',
    bankUrl: 'https://www.depositaccounts.com/banks/sallie-mae-bank.html',
    accountName: 'High-Yield Savings Account',
  },
];

// Manually-added data points appended after scraping (NOT subject to the
// change-point collapse), e.g. to extend a series whose chart history lags.
const MANUAL_POINTS = [
  {
    date: '2026-06-05',
    bankName: 'Western Alliance',
    accountName: 'High-Yield Savings Premier',
    apy: 3.8,
  },
];

const norm = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();

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

// Map every account name on a bank page -> its account id (data-account).
async function getAccountMap(page) {
  return page.evaluate(() => {
    const map = [];
    document.querySelectorAll('a.expand[data-account]').forEach((a) => {
      const id = a.getAttribute('data-account');
      const row = a.closest('tr');
      if (!row) return;
      // The account-name cell is the <td> that isn't the APY or the expander.
      let name = '';
      row.querySelectorAll('td').forEach((td) => {
        const t = td.textContent.trim();
        if (!t) return;
        if (td.classList.contains('apy')) return;
        if (/%$/.test(t)) return;
        if (td.contains(a)) return;
        if (t.length > name.length) name = t;
      });
      map.push({ id, name });
    });
    return map;
  });
}

// Parse productchart.aspx HTML -> array of { date: 'YYYY-MM-DD', apy: Number }
// collapsed to rate-change events.
function parseHistory(html) {
  const rowRe =
    /new Date\((\d+),\s*(\d+),\s*(\d+)\)\s*,\s*([0-9.]+)/g;
  const points = [];
  let m;
  while ((m = rowRe.exec(html)) !== null) {
    const year = +m[1];
    const month0 = +m[2]; // Google Charts months are 0-indexed
    const day = +m[3];
    const apy = +(parseFloat(m[4]) * 100).toFixed(4); // decimal -> percent
    const date = `${year}-${String(month0 + 1).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}`;
    points.push({ date, apy });
  }
  // Collapse to change-points: keep the first point, then any point whose APY
  // differs from the last kept APY (dated when the new APY took effect).
  const events = [];
  let lastApy = null;
  for (const p of points) {
    if (lastApy === null || p.apy !== lastApy) {
      events.push(p);
      lastApy = p.apy;
    }
  }
  return events;
}

async function fetchHistoryForId(page, id) {
  const url = `https://www.depositaccounts.com/banks/productchart.aspx?id=${id}&ver=1&highlight=1`;
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  const html = await page.content();
  return parseHistory(html);
}

function toCsv(rows) {
  const header = 'Date,Bank Name,Account Name,APY (%)';
  const body = rows
    .map(
      (r) =>
        `${r.date},"${r.bankName.replace(/"/g, '""')}","${r.accountName.replace(
          /"/g,
          '""'
        )}",${r.apy}`
    )
    .join('\n');
  return header + '\n' + body + '\n';
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

  const allRows = [];
  for (const t of TARGETS) {
    console.log(`\n=== ${t.bankName} — ${t.accountName} ===`);
    console.log(`Loading ${t.bankUrl}`);
    await page
      .goto(t.bankUrl, { waitUntil: 'domcontentloaded', timeout: 60000 })
      .catch((e) => console.log('goto:', e.message));
    if (!(await waitForRealPage(page))) {
      console.log('!! Could not get past Cloudflare for', t.bankName);
      continue;
    }

    const map = await getAccountMap(page);
    const want = norm(t.accountName);
    let match = map.find((a) => norm(a.name) === want);
    if (!match) match = map.find((a) => norm(a.name).includes(want));
    if (!match) {
      console.log(`!! Account "${t.accountName}" not found. Available:`);
      map.forEach((a) => console.log(`   [${a.id}] ${a.name}`));
      continue;
    }
    console.log(`Matched account id ${match.id} ("${match.name}")`);

    const events = await fetchHistoryForId(page, match.id);
    console.log(
      `Parsed ${events.length} rate-change events (${
        events[0]?.date || '?'
      } -> ${events[events.length - 1]?.date || '?'})`
    );
    for (const e of events) {
      allRows.push({
        date: e.date,
        bankName: t.bankName,
        accountName: match.name,
        apy: e.apy,
      });
    }
  }

  await browser.close();

  // Append manual points (deduped against an identical scraped row).
  for (const mp of MANUAL_POINTS) {
    const dup = allRows.some(
      (r) =>
        r.date === mp.date &&
        r.bankName === mp.bankName &&
        r.apy === mp.apy
    );
    if (!dup) {
      allRows.push({ ...mp });
      console.log(
        `+ manual point: ${mp.bankName} ${mp.date} ${mp.apy}%`
      );
    }
  }

  if (allRows.length === 0) {
    console.log('\nNo data collected — nothing written.');
    return;
  }

  // Sort by bank then date for a tidy file.
  allRows.sort(
    (a, b) =>
      a.bankName.localeCompare(b.bankName) || a.date.localeCompare(b.date)
  );
  fs.mkdirSync(path.dirname(OUT_CSV), { recursive: true });
  fs.writeFileSync(OUT_CSV, toCsv(allRows));
  console.log(`\n✅ Wrote ${allRows.length} rows to ${OUT_CSV}`);
})().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
