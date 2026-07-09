"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CURRENT_MARK,
  TREASURY,
  type ClosedPosition,
  type Direction,
  type Position,
} from "./mock";
import { ROBX_TOKEN_ADDRESS } from "./config";

// Real EIP-1193 wallet connection — works with MetaMask, Rabby, and any
// injected EVM wallet. Balances are read from the chain; until the ROBX
// contract address is set in lib/config.ts the token balance is 0.

type Eip1193 = {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  on?(event: string, cb: (accounts: string[]) => void): void;
  removeListener?(event: string, cb: (accounts: string[]) => void): void;
};

declare global {
  interface Window {
    ethereum?: Eip1193;
  }
}

type WalletState = {
  connected: boolean;
  address: string;
};

type Store = {
  wallet: WalletState;
  robxBalance: number;
  claimUsdc: number;
  walletUsdc: number;
  shareBps: number;
  positions: Position[];
  history: ClosedPosition[];
  // actions
  connect: () => void;
  disconnect: () => void;
  buyToken: (usdc: number) => void;
  sellToken: (robx: number) => void;
  openPosition: (p: {
    direction: Direction;
    leverage: number;
    marginUsdc: number;
  }) => void;
  closePosition: (id: string) => void;
};

const StoreCtx = createContext<Store | null>(null);

let idCounter = 9000;
const nextId = () => `pos_${idCounter++}`;

// ERC-20 balanceOf(address) via raw eth_call — no SDK dependency.
async function fetchRobxBalance(
  eth: Eip1193,
  address: string,
): Promise<number> {
  if (!ROBX_TOKEN_ADDRESS) return 0; // token not deployed yet
  try {
    const data =
      "0x70a08231" +
      address.toLowerCase().replace(/^0x/, "").padStart(64, "0");
    const res = (await eth.request({
      method: "eth_call",
      params: [{ to: ROBX_TOKEN_ADDRESS, data }, "latest"],
    })) as string;
    if (!res || res === "0x") return 0;
    return Number(BigInt(res)) / 1e18;
  } catch {
    return 0;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: "",
  });
  const [robxBalance, setRobx] = useState(0);
  const [claimUsdc, setClaim] = useState(0);
  const [walletUsdc, setWalletUsdc] = useState(0);
  const [shareBps] = useState(0);
  const [positions, setPositions] = useState<Position[]>([]);
  const [history, setHistory] = useState<ClosedPosition[]>([]);

  const connect = useCallback(async () => {
    const eth = window.ethereum;
    if (!eth) {
      window.alert(
        "No EVM wallet detected. Install MetaMask or Rabby, then try again.",
      );
      return;
    }
    try {
      const accounts = (await eth.request({
        method: "eth_requestAccounts",
      })) as string[];
      const address = accounts?.[0];
      if (!address) return;
      setWallet({ connected: true, address });
      setRobx(await fetchRobxBalance(eth, address));
    } catch {
      /* user rejected the request */
    }
  }, []);

  const disconnect = useCallback(() => {
    setWallet({ connected: false, address: "" });
    setRobx(0);
  }, []);

  // follow account switches in MetaMask / Rabby
  useEffect(() => {
    const eth = window.ethereum;
    if (!eth?.on) return;
    const onAccounts = async (accounts: string[]) => {
      const address = accounts?.[0];
      if (!address) {
        disconnect();
        return;
      }
      setWallet({ connected: true, address });
      setRobx(await fetchRobxBalance(eth, address));
    };
    eth.on("accountsChanged", onAccounts);
    return () => eth.removeListener?.("accountsChanged", onAccounts);
  }, [disconnect]);

  // Trade is gated behind FEATURES.tradeLive — these stay inert until launch.
  const buyToken = useCallback((usdc: number) => {
    if (usdc <= 0 || TREASURY.tokenPriceUsd <= 0) return;
    const taxed = usdc * (1 - TREASURY.taxRateBps / 10_000);
    const tokens = taxed / TREASURY.tokenPriceUsd;
    setWalletUsdc((b) => Math.max(0, b - usdc));
    setRobx((b) => b + tokens);
    setClaim((c) => c + usdc * (TREASURY.taxRateBps / 10_000) * 0.4);
  }, []);

  const sellToken = useCallback((robx: number) => {
    if (robx <= 0 || TREASURY.tokenPriceUsd <= 0) return;
    const gross = robx * TREASURY.tokenPriceUsd;
    const taxed = gross * (1 - TREASURY.taxRateBps / 10_000);
    setRobx((b) => Math.max(0, b - robx));
    setWalletUsdc((b) => b + taxed);
  }, []);

  const openPosition = useCallback(
    (p: { direction: Direction; leverage: number; marginUsdc: number }) => {
      const sizeUsd = p.marginUsdc * p.leverage;
      const entry = CURRENT_MARK.price;
      // liquidation when loss ≈ margin: move of (1/leverage) against you
      const move = entry / p.leverage;
      const liq =
        p.direction === "long" ? entry - move * 0.95 : entry + move * 0.95;
      setClaim((c) => Math.max(0, c - p.marginUsdc));
      setPositions((list) => [
        {
          id: nextId(),
          direction: p.direction,
          leverage: p.leverage,
          marginUsdc: p.marginUsdc,
          entryPrice: entry,
          sizeUsd,
          liqPrice: Math.round(liq * 10) / 10,
          openedAt: new Date().toISOString(),
        },
        ...list,
      ]);
    },
    [],
  );

  const closePosition = useCallback(
    (id: string) => {
      setPositions((list) => {
        const pos = list.find((p) => p.id === id);
        if (pos) {
          const mark = CURRENT_MARK.price;
          const dir = pos.direction === "long" ? 1 : -1;
          const pnl =
            ((mark - pos.entryPrice) / pos.entryPrice) * pos.sizeUsd * dir;
          setClaim((c) => c + pos.marginUsdc + pnl);
          setHistory((h) => [
            {
              id: pos.id,
              direction: pos.direction,
              leverage: pos.leverage,
              marginUsdc: pos.marginUsdc,
              entryPrice: pos.entryPrice,
              exitPrice: mark,
              pnlUsd: pnl,
              settledAt: new Date().toISOString(),
            },
            ...h,
          ]);
        }
        return list.filter((p) => p.id !== id);
      });
    },
    [],
  );

  const value = useMemo<Store>(
    () => ({
      wallet,
      robxBalance,
      claimUsdc,
      walletUsdc,
      shareBps,
      positions,
      history,
      connect,
      disconnect,
      buyToken,
      sellToken,
      openPosition,
      closePosition,
    }),
    [
      wallet,
      robxBalance,
      claimUsdc,
      walletUsdc,
      shareBps,
      positions,
      history,
      connect,
      disconnect,
      buyToken,
      sellToken,
      openPosition,
      closePosition,
    ],
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
