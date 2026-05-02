# NFT Minting App Web

## Getting Started

Install dependencies and start the local development server:

```bash
cd apps/web
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Local Environment

Create `apps/web/.env.local` from the example file:

```bash
cp .env.example .env.local
```

Set these values:

```bash
NEXT_PUBLIC_PROJECT_ID=<walletconnect-project-id>
RELAYER_PRIVATE_KEY=<throwaway-relayer-private-key>
```

`RELAYER_PRIVATE_KEY` must be a disposable development relayer key with the `0x` prefix. Do not commit `.env.local`, and do not reuse a production or personal wallet key.

## Local API Connectivity Check

Start the app:

```bash
cd apps/web
bun run dev
```

Use the local URL printed by Next.js. The default is `http://localhost:3000`, but Next.js may choose another port such as `3001` if `3000` is already in use.

In another shell, verify `POST /api/get-mint-params`:

```bash
curl -i http://localhost:3000/api/get-mint-params \
  -H 'Content-Type: application/json' \
  -d '{
    "address": "0x0000000000000000000000000000000000000001",
    "quantity": 1,
    "networkId": "11155111"
  }'
```

Expected successful response:

- HTTP `200`
- JSON contains `nonce`, `expiry`, and `messageToSign`
- `messageToSign` is a `0x`-prefixed hash

Verify `POST /api/mint` reaches the route and returns the expected error shape with an intentionally invalid signature:

```bash
curl -i http://localhost:3000/api/mint \
  -H 'Content-Type: application/json' \
  -d '{
    "address": "0x0000000000000000000000000000000000000001",
    "quantity": 1,
    "nonce": "0",
    "expiry": 1893456000,
    "signature": "0x",
    "networkId": "11155111"
  }'
```

Expected response:

- HTTP `500`
- JSON contains `error` and `message`
- `error` is `Failed to mint`

A full successful `/api/mint` response requires signing the `messageToSign` from `/api/get-mint-params` with the connected wallet and using a funded relayer wallet. On success, the JSON contains `transactionHash` and `blockNumber`.
