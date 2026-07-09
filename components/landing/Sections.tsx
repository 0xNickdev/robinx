import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/Logo";
import { AreaChart } from "@/components/AreaChart";
import { MARKS, TREASURY, NETWORK } from "@/lib/mock";
import { fmtPct } from "@/lib/format";
import { HandLoop, Underline, Star, Sparkle } from "@/components/Doodles";

function SectionTag({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <span className="chip mb-5">
      // {n} · {children}
    </span>
  );
}

/* ---------------- About ---------------- */
export function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-5 py-24 sm:px-6">
      <div className="grid items-start gap-12 lg:grid-cols-2">
        <div>
          <SectionTag n="01">About</SectionTag>
          <h2 className="display text-balance text-4xl text-white sm:text-5xl">
            The stock that armed the{" "}
            <span className="relative inline-block">
              <span className="hand normal-case text-robin [text-transform:none]">
                retail crowd
              </span>
              <Underline className="absolute -bottom-2 left-0 h-3 w-full" />
            </span>
            , finally on-chain.
          </h2>
          <p className="mt-6 text-pretty leading-relaxed text-zinc-400">
            Robinhood (HOOD) trades on Nasdaq — but only through brokers, inside
            market hours, behind borders. RobinX mirrors its official price
            marks on-chain with a synthetic token, so anyone can hold the
            trajectory 24/7 without an account, a border check, or market hours.
          </p>
          <p className="mt-4 text-pretty leading-relaxed text-zinc-400">
            The token itself doesn&apos;t grant equity. It tracks the price, feeds
            a treasury that pays rewards in real tokenized stocks every 30
            minutes, and unlocks a speculative perps layer on top.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {["No brokerage account", "24/7 markets", "Self-custody", "Robinhood Chain native"].map(
              (t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="panel p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="label">HOOD price marks</span>
            <span className="chip">2021 → 2025 · Nasdaq closes</span>
          </div>
          <AreaChart
            data={MARKS.map((m) => ({ x: m.date, y: m.price }))}
          />
          <div className="mt-4 flex items-center justify-between border-t-2 border-robin/15 pt-4 font-mono text-sm">
            <span className="num text-zinc-500">${MARKS[0].price.toFixed(2)}</span>
            <span className="num font-bold text-robin">
              {fmtPct(
                ((MARKS[MARKS.length - 1].price - MARKS[0].price) /
                  MARKS[0].price) *
                  100,
                0,
              )}{" "}
              all-time
            </span>
            <span className="num text-white">
              ${MARKS[MARKS.length - 1].price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Mission ---------------- */
export function Mission() {
  const points = [
    {
      title: "Open access",
      body: "Stock upside has been gated behind brokers, borders, and market hours. We collapse that into a token anyone can hold, anywhere, any hour.",
    },
    {
      title: "A self-sustaining treasury",
      body: "Every buy and sell pays a small tax into a shared treasury. Every 30 minutes it distributes real tokenized stocks — TSLA, NVDA or SpaceX, your pick — pro-rata to holders.",
    },
    {
      title: "Conviction, expressed",
      body: "Think the next mark prints higher? Put your treasury claim to work with leveraged perps on the price itself.",
    },
  ];
  return (
    <section
      id="mission"
      className="relative overflow-hidden border-y-2 border-robin/25 bg-ink-900/40 py-24"
    >
      <Star className="absolute right-[12%] top-12 h-6 w-6 opacity-70" />
      <Sparkle className="absolute left-[8%] bottom-16 h-5 w-5" />
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="max-w-2xl">
          <SectionTag n="02">Mission</SectionTag>
          <h2 className="display text-balance text-4xl text-white sm:text-5xl">
            Make stock upside as{" "}
            <span className="hand normal-case text-robin [text-transform:none]">
              liquid as a swap.
            </span>
          </h2>
          <p className="mt-6 text-pretty leading-relaxed text-zinc-400">
            We believe the crowd that made Robinhood a household name should be
            able to own its upside on their own rails — self-custodied,
            borderless, always-on. RobinX is the rails for that conviction.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {points.map((p, i) => (
            <div key={p.title} className="panel panel-hover p-6">
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-md border-2 border-robin/40 bg-robin/5 font-mono text-sm font-black text-robin">
                0{i + 1}
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-white">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Mechanics ---------------- */
export function Mechanics() {
  return (
    <section id="mechanics" className="mx-auto max-w-7xl px-5 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <div className="flex justify-center">
          <SectionTag n="03">How it works</SectionTag>
        </div>
        <h2 className="display text-balance text-4xl text-white sm:text-5xl">
          Two connected{" "}
          <span className="relative inline-block">
            <span className="hand normal-case text-robin [text-transform:none]">
              layers
            </span>
            <HandLoop className="absolute -inset-x-3 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+1.5rem)]" />
          </span>
        </h2>
        <p className="mt-5 text-pretty leading-relaxed text-zinc-400">
          A passive holding layer that pays you, and an active speculation layer
          that turns that yield into leverage.
        </p>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {/* Token & treasury */}
        <div className="panel overflow-hidden">
          <div className="border-b-2 border-robin/20 p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-md border-2 border-robin/40 bg-robin/10 text-robin">
                <LogoMark className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white">
                  Token &amp; Treasury
                </h3>
                <p className="font-mono text-xs text-zinc-500">Hold &amp; accrue</p>
              </div>
            </div>
          </div>
          <ul className="divide-y-2 divide-robin/10">
            {[
              ["Buy / sell tax", `${TREASURY.taxRateBps / 100}% → treasury`],
              ["Rewards paid in", "Real tokenized stocks"],
              ["Your pick", "tTSLA · tNVDA · tSPCX"],
              ["Distribution", "Every 30 minutes"],
            ].map(([k, v]) => (
              <li
                key={k}
                className="flex items-center justify-between px-6 py-4 text-sm"
              >
                <span className="font-mono uppercase tracking-wide text-zinc-400">{k}</span>
                <span className="font-bold text-zinc-100">{v}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Perps */}
        <div className="panel overflow-hidden">
          <div className="border-b-2 border-robin/20 p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-md border-2 border-robin/40 bg-robin/10 text-robin">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 17l6-6 4 4 7-7" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 8h6v6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white">
                  Perpetual Futures
                </h3>
                <p className="font-mono text-xs text-zinc-500">Speculate &amp; compound</p>
              </div>
            </div>
          </div>
          <ul className="divide-y-2 divide-robin/10">
            {[
              ["Margin source", "Your treasury claim"],
              ["Markets", "TSLA · NVDA · SPCX"],
              ["Direction", "Long (up) / Short (down)"],
              ["Outcome", "Win grows · lose shrinks"],
            ].map(([k, v]) => (
              <li
                key={k}
                className="flex items-center justify-between px-6 py-4 text-sm"
              >
                <span className="font-mono uppercase tracking-wide text-zinc-400">{k}</span>
                <span className="font-bold text-zinc-100">{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <Link href="/terminal" className="btn-robin !px-7 !py-4 text-base">
          Open the Terminal
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.6">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

/* ---------------- Stats ---------------- */
export function Stats() {
  const stats = [
    { label: "Treasury size", value: "TBA" },
    { label: "Trade tax", value: `${TREASURY.taxRateBps / 100}%` },
    { label: "Payout cycle", value: "30 min" },
    { label: "Network", value: NETWORK.name },
  ];
  return (
    <section id="stats" className="border-y-2 border-robin/25 bg-ink-900/40 py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 overflow-hidden rounded-lg border-2 border-robin/30 sm:grid-cols-4" style={{ boxShadow: "6px 6px 0 0 rgba(217,255,77,0.2)" }}>
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`bg-ink-900/80 px-6 py-8 text-center ${
              i !== 0 ? "border-l-2 border-robin/15" : ""
            } ${i === 2 ? "border-t-2 sm:border-t-0" : ""} ${i === 3 ? "border-t-2 sm:border-t-0" : ""}`}
          >
            <div className="num text-3xl font-black text-robin sm:text-4xl">
              {s.value}
            </div>
            <div className="label mt-2">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
export function FAQ() {
  const faqs = [
    {
      q: "Do I own real HOOD shares?",
      a: "No. RobinX is a synthetic instrument that tracks Robinhood's (HOOD) published price marks. It confers no equity, dividends, voting, or shareholder rights of any kind. Not affiliated with Robinhood Markets, Inc.",
    },
    {
      q: "Where does the price data come from?",
      a: "HOOD trades on Nasdaq. An oracle publishes official settlement marks on-chain — closing prices at earnings, index events, and month-ends — so the UI always shows a clear 'last updated' timestamp rather than intraday ticks.",
    },
    {
      q: "How do I receive real stocks?",
      a: "Rewards are paid in tokenized equities — 1:1 backed stock tokens like the ones Robinhood issues on Robinhood Chain. In the Treasury tab you pick the payout asset (tTSLA, tNVDA or tSPCX); every 30 minutes the treasury distributes it pro-rata, straight to your wallet.",
    },
    {
      q: "How does the treasury make money?",
      a: "Every buy and sell of the token pays a small tax (currently 4%) into a shared treasury. Every 30 minutes the treasury converts and distributes rewards in the tokenized stock each holder selected.",
    },
    {
      q: "What are the perps?",
      a: "A perpetual-futures market on the next HOOD oracle mark. You post your treasury claim as margin, pick long or short with leverage, and settle against the next published mark. Liquidation applies if the mark moves far enough against you.",
    },
    {
      q: "What chain is this on?",
      a: "Robinhood Chain. Connect any EVM wallet, switch to the Robinhood Chain network, and you're in.",
    },
  ];
  return (
    <section id="faq" className="mx-auto max-w-3xl px-5 py-24 sm:px-6">
      <div className="text-center">
        <div className="flex justify-center">
          <SectionTag n="04">FAQ</SectionTag>
        </div>
        <h2 className="display text-balance text-4xl text-white sm:text-5xl">
          Questions,{" "}
          <span className="hand normal-case text-robin [text-transform:none]">
            answered.
          </span>
        </h2>
      </div>
      <div className="mt-10 space-y-3">
        {faqs.map((f) => (
          <details
            key={f.q}
            className="group panel overflow-hidden px-5 py-1 [&_summary]:list-none"
          >
            <summary className="flex cursor-pointer items-center justify-between py-4 text-left text-base font-bold text-zinc-100">
              {f.q}
              <span className="ml-4 grid h-7 w-7 shrink-0 place-items-center rounded-md border-2 border-robin/40 text-robin transition-transform duration-300 group-open:rotate-45">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
              </span>
            </summary>
            <p className="pb-5 pr-8 text-sm leading-relaxed text-zinc-400">
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ---------------- CTA + Footer ---------------- */
export function FooterCTA() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-6">
      <div className="panel relative overflow-hidden p-10 text-center sm:p-16" style={{ boxShadow: "8px 8px 0 0 rgba(217,255,77,0.25)" }}>
        <Star className="absolute left-[10%] top-10 h-6 w-6" />
        <Sparkle className="absolute right-[12%] top-16 h-5 w-5" />
        <Star className="absolute bottom-12 right-[18%] h-4 w-4 opacity-70" />
        <div className="relative">
          <span className="chip mb-5">// Ready?</span>
          <h2 className="display text-balance text-4xl text-white sm:text-6xl">
            Trade the{" "}
            <span className="relative inline-block">
              <span className="hand normal-case text-robin [text-transform:none]">
                trajectory.
              </span>
              <Underline className="absolute -bottom-2 left-0 h-3 w-full" />
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-zinc-400">
            Connect your wallet, hold the token, and put your treasury claim to
            work.
          </p>
          <Link href="/terminal" className="btn-robin mt-8 !px-8 !py-4 text-base">
            Enter Terminal
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.6">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t-2 border-robin/25 bg-ink-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Wordmark />
          <p className="mt-4 text-sm leading-relaxed text-zinc-500">
            Synthetic Robinhood (HOOD) price exposure on Robinhood Chain. Not
            affiliated with Robinhood Markets, Inc.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <FooterCol
            title="Product"
            links={[
              ["Terminal", "/terminal"],
              ["Mechanics", "#mechanics"],
              ["Roadmap", "#roadmap"],
              ["Treasury", "#stats"],
            ]}
          />
          <FooterCol
            title="Learn"
            links={[
              ["About", "#about"],
              ["Mission", "#mission"],
              ["FAQ", "#faq"],
            ]}
          />
          <FooterCol
            title="Community"
            links={[
              ["X / Twitter", "https://x.com/RobinX_HL"],
              ["Docs", "#"],
              ["Robinhood Chain", NETWORK.explorer],
            ]}
          />
        </div>
      </div>
      <div className="border-t-2 border-robin/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 font-mono text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© {new Date().getFullYear()} RobinX. All rights reserved.</span>
          <span className="text-pretty">
            Synthetic exposure only · No equity · Not investment advice · DeFi
            carries risk of total loss.
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <div className="label mb-3">{title}</div>
      <ul className="space-y-2">
        {links.map(([label, href]) => (
          <li key={label}>
            <a
              href={href}
              className="font-mono text-sm text-zinc-400 transition-colors hover:text-robin"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
