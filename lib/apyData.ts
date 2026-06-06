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

// Stable color per bank.
const BANK_COLORS: Record<string, string> = {
  'Marcus by Goldman Sachs': '#3B82F6',
  'Capital One 360': '#10B981',
  SoFi: '#8B5CF6',
  'Ally Bank': '#EC4899',
  'CIT Bank': '#F59E0B',
  'American Express': '#6366F1',
  'Western Alliance': '#EF4444',
  'Primis Bank': '#06B6D4',
  'Sallie Mae': '#F43F5E',
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
