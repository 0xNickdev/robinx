import { NextResponse } from "next/server";
import { TICKER_SYMBOLS, SEED_PRICES, type Quote } from "@/lib/stocks";

// Backend: real stock quotes for the ticker, perps marks, and reward pricing.
// Primary source is Yahoo Finance's public chart endpoint, fallback is Stooq
// (delayed, keyless). If both fail we serve seed prices flagged live:false so
// the UI can label them. Responses are cached for 30s via the data cache.

export const dynamic = "force-dynamic";

const UA = { "User-Agent": "Mozilla/5.0 (compatible; RobinX/1.0)" };

// Tokenized private companies (no Nasdaq listing) — seed/on-chain price only,
// never resolved via Yahoo/Stooq to avoid stale same-ticker ETFs.
const OFFCHAIN_ONLY = new Set(["SPCX"]);

async function fromYahoo(symbol: string): Promise<Quote | null> {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1d&interval=1d`,
      { headers: UA, next: { revalidate: 30 } },
    );
    if (!res.ok) return null;
    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    const price = Number(meta?.regularMarketPrice);
    const prev = Number(meta?.chartPreviousClose ?? meta?.previousClose);
    if (!isFinite(price) || price <= 0) return null;
    const changePct = isFinite(prev) && prev > 0 ? ((price - prev) / prev) * 100 : 0;
    return { symbol, price, changePct, live: true };
  } catch {
    return null;
  }
}

async function fromStooq(symbol: string): Promise<Quote | null> {
  try {
    const res = await fetch(
      `https://stooq.com/q/l/?s=${symbol.toLowerCase()}.us&f=sd2t2ohlcv&h&e=csv`,
      { headers: UA, next: { revalidate: 30 } },
    );
    if (!res.ok) return null;
    const csv = await res.text();
    const row = csv.trim().split("\n")[1]?.split(",");
    if (!row) return null;
    const open = Number(row[3]);
    const close = Number(row[6]);
    if (!isFinite(close) || close <= 0) return null;
    const changePct = isFinite(open) && open > 0 ? ((close - open) / open) * 100 : 0;
    return { symbol, price: close, changePct, live: true };
  } catch {
    return null;
  }
}

function seed(symbol: string): Quote {
  return { symbol, price: SEED_PRICES[symbol] ?? 100, changePct: 0, live: false };
}

export async function GET() {
  const quotes = await Promise.all(
    TICKER_SYMBOLS.map(async (s) => {
      if (OFFCHAIN_ONLY.has(s)) return seed(s);
      return (await fromYahoo(s)) ?? (await fromStooq(s)) ?? seed(s);
    }),
  );
  return NextResponse.json(
    { quotes, updatedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "public, max-age=30" } },
  );
}
