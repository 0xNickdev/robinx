// Static, deterministic mock data for the RobinX terminal.
// HOOD trades on Nasdaq — these "marks" emulate the official settlement prints
// an oracle would publish on-chain (closing prices at earnings, index events,
// and month-ends), not intraday ticks.

export type Mark = {
  date: string; // ISO
  price: number; // HOOD $/share at the mark
  capBn: number; // implied market cap in $B
  source: string;
  note?: string;
};

// Each mark is an official oracle print (closes at key events).
export const MARKS: Mark[] = [
  { date: "2021-07-29", price: 34.82, capBn: 29, source: "IPO close" },
  { date: "2021-08-04", price: 70.39, capBn: 59, source: "Meme rally close", note: "All-time high week" },
  { date: "2022-06-16", price: 7.0, capBn: 6, source: "Monthly close", note: "Bear-market low" },
  { date: "2023-08-04", price: 10.5, capBn: 9.5, source: "Earnings close" },
  { date: "2024-01-12", price: 12.0, capBn: 10.5, source: "Monthly close" },
  { date: "2024-06-21", price: 22.4, capBn: 19.8, source: "Earnings close" },
  { date: "2024-12-13", price: 39.6, capBn: 35, source: "Monthly close" },
  { date: "2025-06-13", price: 74.5, capBn: 66, source: "Monthly close" },
  { date: "2025-09-22", price: 118.0, capBn: 105, source: "S&P 500 inclusion" },
];

export const CURRENT_MARK = MARKS[MARKS.length - 1];
export const PREV_MARK = MARKS[MARKS.length - 2];

// Feature flags — what's live vs. on the roadmap (see landing Roadmap section)
export const FEATURES = {
  tradeLive: false, // unlocks with the ROBX token launch (see lib/config.ts)
  perpsLive: false, // Phase 02 — terminal shows a preview, trading is "Soon"
  autoTradingLive: false, // Phase 03 — strategy vaults / auto-trading
};

// Treasury + token economics
export const TREASURY = {
  totalUsdc: 0, // real figure appears after launch — UI shows "TBA" while 0
  taxRateBps: 400, // 4% buy/sell tax → treasury (tokenomics design)
  tokenPriceUsd: 0, // set by the market at launch — UI shows "TBA" while 0
  tokenSymbol: "ROBX",
  totalSupply: 100_000_000,
  apr: 0, // realized treasury growth — "TBA" until there is history
};

// No simulated account — balances come from the connected wallet.

export type Direction = "long" | "short";

export type Position = {
  id: string;
  direction: Direction;
  leverage: number;
  marginUsdc: number;
  entryPrice: number;
  sizeUsd: number;
  liqPrice: number;
  openedAt: string;
};

// Empty while perps are in preview (Phase 02) — populated once trading is live.
export const OPEN_POSITIONS: Position[] = [];

export type ClosedPosition = {
  id: string;
  direction: Direction;
  leverage: number;
  marginUsdc: number;
  entryPrice: number;
  exitPrice: number;
  pnlUsd: number;
  settledAt: string;
};

// Empty while perps are in preview (Phase 02).
export const CLOSED_POSITIONS: ClosedPosition[] = [];

export const NETWORK = {
  name: "Robinhood Chain",
  chainId: 999,
  symbol: "ROBIN",
  explorer: "https://scan.robinhoodchain.io",
};
