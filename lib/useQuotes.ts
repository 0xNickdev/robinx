"use client";

import { useEffect, useState } from "react";
import { SEED_PRICES, type Quote } from "./stocks";

const REFRESH_MS = 60_000;

// Client hook: polls the backend price API, falls back to seed prices.
export function useQuotes(): Record<string, Quote> {
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch("/api/prices");
        if (!res.ok) return;
        const json = (await res.json()) as { quotes: Quote[] };
        if (!alive) return;
        setQuotes(Object.fromEntries(json.quotes.map((q) => [q.symbol, q])));
      } catch {
        /* keep previous/seed values */
      }
    };
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return quotes;
}

export function quotePrice(
  quotes: Record<string, Quote>,
  symbol: string,
): number {
  return quotes[symbol]?.price ?? SEED_PRICES[symbol] ?? 100;
}
