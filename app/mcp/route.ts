/**
 * Remote MCP server for the APY Archives dataset.
 *
 * Exposes the historical high-yield savings APY data (data/apy_history.csv,
 * loaded via lib/apyData.ts) as MCP tools so any MCP client — Claude, Cursor,
 * etc. — can query it over HTTP with no install.
 *
 * Endpoint: https://apyarchives.com/mcp
 * Connect:  claude mcp add --transport http apy-archives https://apyarchives.com/mcp
 */
import { createMcpHandler } from 'mcp-handler';
import { z } from 'zod';
import { loadAccounts } from '@/lib/apyData';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const asText = (data: unknown) => ({
  content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
});

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      'list_banks',
      {
        description:
          'List every bank/account tracked in the APY Archives dataset, with its ' +
          'current APY and the date range of history available. Call this first to ' +
          'discover valid bank ids for get_apy_history.',
        inputSchema: z.object({}),
      },
      async () =>
        asText(
          loadAccounts().map((a) => ({
            id: a.id,
            bank: a.name,
            account: a.provider,
            currentAPY: a.currentAPY,
            firstRecord: a.history[0]?.date ?? null,
            lastRecord: a.history[a.history.length - 1]?.date ?? null,
            points: a.history.length,
          }))
        )
    );

    server.registerTool(
      'get_current_apys',
      {
        description:
          'Current APY for every tracked bank, sorted highest first — the ' +
          '"who pays best right now" leaderboard.',
        inputSchema: z.object({}),
      },
      async () =>
        asText(
          loadAccounts()
            .map((a) => ({ bank: a.name, account: a.provider, currentAPY: a.currentAPY, asOf: a.history[a.history.length - 1]?.date ?? null }))
            .sort((x, y) => y.currentAPY - x.currentAPY)
        )
    );

    server.registerTool(
      'get_apy_history',
      {
        description:
          'Full APY rate-change history for one bank. Each point is the date a ' +
          'new APY took effect (not a daily series). Optionally bound by date.',
        inputSchema: z.object({
          bank: z
            .string()
            .describe("Bank id or name, e.g. 'sofi', 'SoFi', or 'Marcus'"),
          from: z
            .string()
            .optional()
            .describe('ISO date (YYYY-MM-DD) lower bound, inclusive'),
          to: z
            .string()
            .optional()
            .describe('ISO date (YYYY-MM-DD) upper bound, inclusive'),
        }),
      },
      async ({ bank, from, to }) => {
        const accounts = loadAccounts();
        const q = bank.trim().toLowerCase();
        const acct =
          accounts.find((a) => a.id === q || a.name.toLowerCase() === q) ??
          accounts.find((a) => a.name.toLowerCase().includes(q));

        if (!acct) {
          return {
            ...asText({
              error: `No bank matching "${bank}". Call list_banks for valid ids.`,
              known: accounts.map((a) => a.id),
            }),
            isError: true,
          };
        }

        let history = acct.history;
        if (from) history = history.filter((h) => h.date >= from);
        if (to) history = history.filter((h) => h.date <= to);

        return asText({
          bank: acct.name,
          account: acct.provider,
          currentAPY: acct.currentAPY,
          count: history.length,
          points: history,
        });
      }
    );
  },
  {
    serverInfo: { name: 'apy-archives', version: '1.0.0' },
  }
);

export { handler as GET, handler as POST, handler as DELETE };
