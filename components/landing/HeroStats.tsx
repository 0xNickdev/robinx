"use client";

import { useQuotes, quotePrice } from "@/lib/useQuotes";
import { fmtUSD, fmtPct } from "@/lib/format";

// Hero stat strip — real HOOD quote plus tokenomics design constants.
// No invented metrics: anything unknown pre-launch simply isn't shown here.
export function HeroStats() {
  const quotes = useQuotes();
  const hood = quotePrice(quotes, "HOOD");
  const chg = quotes.HOOD?.changePct ?? 0;

  const stats = [
    { value: fmtUSD(hood), label: "HOOD Price · Live" },
    { value: fmtPct(chg, 2), label: "Today" },
    { value: "4%", label: "Trade Tax" },
    { value: "30 min", label: "Payout Cycle" },
    { value: "Robinhood Chain", label: "Network" },
  ];

  return (
    <>
      <div
        className="animate-fade-up mt-14 grid max-w-4xl grid-cols-2 gap-0 overflow-hidden rounded-lg border-2 border-robin/30 bg-ink-900/70 backdrop-blur-md sm:grid-cols-5"
        style={{ animationDelay: "320ms", boxShadow: "5px 5px 0 0 rgba(217,255,77,0.2)" }}
      >
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`px-4 py-4 ${i !== 0 ? "border-robin/15 sm:border-l-2" : ""} ${
              i % 2 === 1 ? "border-l-2 border-robin/15 sm:border-l-2" : ""
            }`}
          >
            <div className="num text-xl font-black text-robin sm:text-2xl">
              {s.value}
            </div>
            <div className="label mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div
        className="animate-fade-up mt-3 flex items-center gap-2 font-mono text-xs text-zinc-500"
        style={{ animationDelay: "360ms" }}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-long opacity-70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-long" />
        </span>
        Live Nasdaq feed · refreshes every 60s
      </div>
    </>
  );
}
