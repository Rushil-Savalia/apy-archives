/**
 * Server-side loader: reads data/apy_history.csv (produced by
 * scripts/scrapeHistory.js) and shapes it into per-bank Account records for
 * the UI. Each bank's history is the list of APY rate-change events over time.
 */
import * as fs from 'fs';
import * as path from 'path';

export interface APYRecord {
  date: string; // YYYY-MM-DD
  apy: number; // percent, e.g. 3.5
}

export interface Account {
  id: string;
  name: string; // bank name (used in chart legend + selection)
  provider: string; // account/product name
  history: APYRecord[]; // sorted ascending by date
  currentAPY: number;
  color: string;
}

// Stable color per bank, loosely based on each bank's brand color.
const BANK_COLORS: Record<string, string> = {
  SoFi: '#38BDF8', // light blue
  'Marcus by Goldman Sachs': '#1E3A8A', // navy blue
  'Capital One 360': '#D62828', // red
  'Sallie Mae': '#2563EB', // blue
  'American Express': '#00A3E0', // Amex blue
  'Ally Bank': '#7C3AED', // Ally purple
  'CIT Bank': '#6B8E23', // olive green
  'Western Alliance': '#0D9488', // teal
  'Primis Bank': '#16A34A', // green
};
const FALLBACK_COLORS = ['#6B7280', '#0EA5E9', '#D946EF', '#84CC16', '#F97316'];

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// Parse a single CSV line that may contain quoted, comma-free fields.
function parseLine(line: string): string[] {
  const values = line.match(/("([^"]*)"|[^,]+)/g) || [];
  return values.map((v) => v.replace(/^"|"$/g, '').replace(/""/g, '"'));
}

export function loadAccounts(
  filename: string = 'apy_history.csv'
): Account[] {
  const filePath = path.join(process.cwd(), 'data', filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  CSV file not found: ${filePath}`);
    return [];
  }

  const lines = fs.readFileSync(filePath, 'utf-8').trim().split('\n');
  const byBank = new Map<
    string,
    { provider: string; history: APYRecord[] }
  >();

  for (const line of lines.slice(1)) {
    if (!line.trim()) continue;
    const [date, bankName, accountName, apyStr] = parseLine(line);
    const apy = parseFloat(apyStr);
    if (!bankName || Number.isNaN(apy)) continue;
    if (!byBank.has(bankName)) {
      byBank.set(bankName, { provider: accountName, history: [] });
    }
    byBank.get(bankName)!.history.push({ date, apy });
  }

  let i = 0;
  const accounts: Account[] = [];
  for (const [bankName, { provider, history }] of Array.from(byBank.entries())) {
    history.sort((a, b) => a.date.localeCompare(b.date));
    accounts.push({
      id: slug(bankName),
      name: bankName,
      provider,
      history,
      currentAPY: history[history.length - 1]?.apy ?? 0,
      color: BANK_COLORS[bankName] || FALLBACK_COLORS[i % FALLBACK_COLORS.length],
    });
    i++;
  }

  // Sort by current APY descending for a tidy default list.
  accounts.sort((a, b) => b.currentAPY - a.currentAPY);
  return accounts;
}
