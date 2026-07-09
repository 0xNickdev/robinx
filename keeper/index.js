// RobinX keeper — calls RewardDistributor.distribute() every 30 minutes and
// heals any share desync (AUDIT M-1) with a periodic syncShare sweep.
//
// Runs anywhere Node runs. Built for Railway (see README). Zero privileges:
// the keeper wallet only pays gas to call public functions.

import { ethers } from "ethers";

// ── config (env) ──
const RPC_URL = process.env.RPC_URL || "https://rpc.mainnet.chain.robinhood.com";
const DISTRIBUTOR = process.env.DISTRIBUTOR; // RewardDistributor address
const ROBX = process.env.ROBX; // ROBX token address (for the sync sweep)
const PRIVATE_KEY = process.env.KEEPER_PRIVATE_KEY;
const CHECK_INTERVAL_MS = Number(process.env.CHECK_INTERVAL_MS || 60_000); // poll cadence

if (!DISTRIBUTOR || !PRIVATE_KEY) {
  console.error("Set DISTRIBUTOR and KEEPER_PRIVATE_KEY env vars.");
  process.exit(1);
}

const DIST_ABI = [
  "function canDistribute() view returns (bool)",
  "function distribute()",
  "function lastDistribution() view returns (uint256)",
  "function epochInterval() view returns (uint256)",
  "function epochCount() view returns (uint256)",
  "function syncShare(address account)",
  "function shares(address) view returns (uint256)",
];
const ROBX_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const dist = new ethers.Contract(DISTRIBUTOR, DIST_ABI, wallet);
const robx = ROBX ? new ethers.Contract(ROBX, ROBX_ABI, provider) : null;

const log = (...a) => console.log(new Date().toISOString(), ...a);

// ── distribution loop ──
let running = false;
async function tick() {
  if (running) return;
  running = true;
  try {
    if (await dist.canDistribute()) {
      log("epoch ready → distribute()");
      const tx = await dist.distribute();
      log("  sent", tx.hash);
      const rcpt = await tx.wait();
      const epoch = await dist.epochCount();
      log(`  confirmed in block ${rcpt.blockNumber} · epoch #${epoch}`);
    } else {
      const last = Number(await dist.lastDistribution());
      const interval = Number(await dist.epochInterval());
      const left = Math.max(0, last + interval - Math.floor(Date.now() / 1000));
      log(`not ready · next epoch in ${Math.ceil(left / 60)}m`);
    }
  } catch (e) {
    log("distribute error:", e.shortMessage || e.message);
  } finally {
    running = false;
  }
}

// ── share-sync sweep (AUDIT M-1) ──
// Watch ROBX Transfer events; anyone whose ledger share drifts from their true
// balance gets healed with syncShare(). Cheap insurance against gas-starved
// share hooks. Optional — only runs if ROBX is set.
const seen = new Set();
async function sweep() {
  if (!robx) return;
  const addrs = [...seen];
  seen.clear();
  for (const a of addrs) {
    try {
      const [share, bal] = await Promise.all([dist.shares(a), robx.balanceOf(a)]);
      if (share !== bal) {
        log(`desync ${a}: share ${share} ≠ balance ${bal} → syncShare()`);
        const tx = await dist.syncShare(a);
        await tx.wait();
        log("  healed", tx.hash);
      }
    } catch (e) {
      log("sync error", a, e.shortMessage || e.message);
    }
  }
}

if (robx) {
  robx.on("Transfer", (from, to) => {
    if (from !== ethers.ZeroAddress) seen.add(from);
    if (to !== ethers.ZeroAddress) seen.add(to);
  });
}

async function main() {
  const bal = await provider.getBalance(wallet.address);
  log(`keeper ${wallet.address} · gas balance ${ethers.formatEther(bal)} ETH`);
  log(`distributor ${DISTRIBUTOR} · poll every ${CHECK_INTERVAL_MS / 1000}s`);
  if (bal === 0n) log("WARNING: keeper wallet has no gas — fund it with ~0.01 ETH");

  await tick();
  setInterval(tick, CHECK_INTERVAL_MS);
  if (robx) setInterval(sweep, 5 * 60_000); // sweep desyncs every 5 min
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
