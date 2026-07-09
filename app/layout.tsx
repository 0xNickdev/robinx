import type { Metadata, Viewport } from "next";
import { Inter, Caveat, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-hand",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RobinX — Synthetic HOOD Exposure on Robinhood Chain",
  description:
    "Gain synthetic exposure to Robinhood (HOOD) stock — 24/7, on-chain, no brokerage account. Hold the token, accrue a treasury claim, and speculate on the next oracle mark with on-chain perps. Built on Robinhood Chain.",
  keywords: [
    "Robinhood",
    "HOOD",
    "DeFi",
    "Robinhood Chain",
    "synthetic asset",
    "perpetuals",
    "treasury",
  ],
  openGraph: {
    title: "RobinX",
    description: "Synthetic Robinhood (HOOD) stock exposure on Robinhood Chain.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0B05",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${caveat.variable} ${spaceMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
