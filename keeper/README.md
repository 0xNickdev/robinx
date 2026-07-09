# RobinX Keeper

A tiny worker that keeps the treasury running:

1. **Every 30 minutes** calls `RewardDistributor.distribute()` — swaps the
   accumulated ROBX tax into USDG and credits holders.
2. **Continuously** watches ROBX transfers and calls `syncShare()` on any
   account whose ledger share drifts from its true balance (AUDIT M-1 fix).

It holds **no privileges** — the keeper wallet only pays gas to call public
functions. Worst case if it goes down: distributions pause until it restarts
(or anyone else calls `distribute()`), nothing is lost.

## Env vars

| Var | Required | Default | What |
| --- | --- | --- | --- |
| `DISTRIBUTOR` | ✅ | — | RewardDistributor address |
| `KEEPER_PRIVATE_KEY` | ✅ | — | Keeper wallet key (fund with ~0.01 ETH) |
| `ROBX` | recommended | — | ROBX token address (enables the syncShare sweep) |
| `RPC_URL` | — | Robinhood Chain mainnet | RPC endpoint |
| `CHECK_INTERVAL_MS` | — | `60000` | Poll cadence |

## Run locally

```bash
cd keeper
npm install
DISTRIBUTOR=0x... ROBX=0x... KEEPER_PRIVATE_KEY=0x... npm start
```

## Deploy on Railway

1. New Project → Deploy from GitHub repo → pick this repo, root dir `keeper/`.
2. Railway auto-detects Node and runs `npm start`.
3. Variables tab → add `DISTRIBUTOR`, `ROBX`, `KEEPER_PRIVATE_KEY`
   (and optionally `RPC_URL`).
4. Fund the keeper wallet with ~0.01 ETH on Robinhood Chain.

Keep it as a **Service** (always-on), not a Cron job — it needs the live event
subscription for the syncShare sweep. Gas per run is a few cents; ~0.01 ETH
lasts a long time.

## Optional: Chainlink Automation instead

If Chainlink Automation is available on Robinhood Chain, register the
distributor as a custom-logic upkeep (`checkUpkeep`/`performUpkeep` are already
implemented) and you can skip this bot for distribution — though the syncShare
sweep still benefits from running it.
