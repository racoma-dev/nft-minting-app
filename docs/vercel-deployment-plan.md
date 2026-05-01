# Vercel デプロイ移行計画

最終更新: 2026-04-29

このドキュメントは、現在 AWS Elastic Beanstalk + 別配信となっている `nft-minting-app` を、**Vercel 単一プロジェクト**へ移行するための計画と作業手順をまとめたものである。
実装は本ドキュメント承認後に開始する。

---

## 1. 背景と現状

### 1.1 リポジトリ構成（モノレポ）

| ディレクトリ | 役割 | 主要技術 |
|---|---|---|
| `frontend/` | Next.js 14 (App Router) UI | Next.js / Bun / TypeScript / `@web3modal/ethers` / `ethers@6` |
| `backend/` | リレイヤー署名・gasless mint API | Hono + `@hono/node-server` / Bun |
| `contract/` | スマートコントラクト + デプロイ成果物 | Hardhat / Hardhat Ignition |

### 1.2 既存デプロイ（移行前）

- **backend**: AWS Elastic Beanstalk（`ap-northeast-1`, application `nft-minting-app-backend`）。`.github/workflows/deploy-backend.yml` が `main` push でデプロイ。**現在は停止済み**。
- **frontend**: 旧ドメイン `nft-minting-app.rcm0208.xyz` で配信されていた。
- backend → frontend 通信: フロント側は `NEXT_PUBLIC_API_URL` で backend エンドポイントを呼び、backend 側は CORS allowlist でオリジン制御。

### 1.3 重要な前提条件

- **backend の処理は 2 エンドポイントのみ**で、いずれもステートレス
  - `POST /get-mint-params`
  - `POST /mint`
- フロント・バック双方が `../../contract/ignition/deployments/...` 配下の ABI / アドレス JSON を直接 import している
- 機密値は `RELAYER_PRIVATE_KEY`（backend）、`NEXT_PUBLIC_PROJECT_ID`（WalletConnect projectId, frontend）

---

## 2. 採用方針（決定事項）

### 2.1 Vercel 移行戦略: **案 A — backend を Next.js Route Handlers に統合**

`backend/src/*` のロジックを `frontend/app/api/**/route.ts` に移植し、**Vercel 単一プロジェクト**で完結させる。

**選定理由**

- backend が 2 関数・ステートレスでサーバーレスとの相性が極めて良い
- CORS allowlist と `NEXT_PUBLIC_API_URL` という運用上の負債を解消できる
- Preview Deployment が 1 PR で frontend / API 両方を反映するためレビューが容易
- EB / Docker / ELB 関連の重複インフラを完全廃止できる

### 2.2 AWS EB の扱い

- **既に停止済み**。並行運用は不要。
- 移行完了後、リポジトリから EB / Docker 関連ファイルを削除する。

### 2.3 ドメイン

- 既存ドメイン `nft-minting-app.rcm0208.xyz` は使用しない。
- **新ドメイン `racoma.dev` を新規取得**し、Vercel プロジェクトに紐付ける。
  - サブドメイン構成（例: `nft.racoma.dev` / `mint.racoma.dev` / apex `racoma.dev`）は取得後に確定する。
- ドメイン取得・DNS 設定後、ハードコード箇所（§ 7）を一括更新する。

### 2.4 コントラクト成果物のクロス参照対応

`frontend/` 配下から `../../contract/...` を import している既存実装を維持するため、**Vercel の Root Directory はリポジトリルート (`./`) のまま**とする。
ビルドコマンドで `frontend/` に降りて Next.js をビルドする方式を採用する（コード書き換え不要・最小変更）。

---

## 3. 移行後のアーキテクチャ

```
┌────────────────────────── Vercel Project (single) ──────────────────────────┐
│                                                                              │
│  ┌─────────────────────────┐         ┌──────────────────────────────────┐   │
│  │  Next.js (App Router)   │         │  Route Handlers (Node runtime)   │   │
│  │  - app/page.tsx         │ fetch   │  - app/api/get-mint-params/      │   │
│  │  - app/gasless-mint/... │ ──────▶ │      route.ts                    │   │
│  │  - app/mint/...         │ (相対)  │  - app/api/mint/route.ts         │   │
│  │  - app/sbt-mint/...     │         │  - lib/server/signature-service  │   │
│  └─────────────────────────┘         │  - lib/server/relayer-wallet     │   │
│                                       └────────────┬─────────────────────┘   │
│                                                    │ ethers v6              │
│                                                    │ (RELAYER_PRIVATE_KEY)  │
└────────────────────────────────────────────────────┼─────────────────────────┘
                                                     │
                                                     ▼
                                       各 Testnet RPC エンドポイント
                                       (Sepolia / Amoy / Base / Arbitrum / ...)
```

主な変化点:

- ブラウザ → API 通信は **同一オリジンの相対パス** (`/api/get-mint-params` 等) に変わる
- `NEXT_PUBLIC_API_URL` は廃止
- backend の CORS allowlist は廃止
- Hono は使用しない（`Request` / `Response` のネイティブ Web 標準 API を Route Handler で利用）

---

## 4. 環境変数

| 変数 | スコープ | 値 | 備考 |
|---|---|---|---|
| `NEXT_PUBLIC_PROJECT_ID` | Production / Preview / Development | WalletConnect Project ID | `frontend/context/web3modal.tsx` で起動時に必須 |
| `RELAYER_PRIVATE_KEY` | Production / Preview | **新規生成**したリレイヤーウォレットの秘密鍵 | **`NEXT_PUBLIC_` を絶対に付けない**。Vercel Encrypted Env のみで保持 |

- **キーは移行を機にローテーションする**（決定事項）。
  - 新リレイヤーウォレットを生成 → 各テストネットでガス補給 → Vercel Encrypted Env に登録 → 旧キーは破棄。
  - 旧キーは EB 環境（停止済み）に置かれていたため、これを完全に隔離する目的。
- ローカル開発用に `frontend/.env.local` を `.env.example` で雛形化する（commit しない）。

---

## 5. Vercel プロジェクト設定

| 項目 | 値 |
|---|---|
| Framework Preset | Next.js |
| Root Directory | `./`（リポジトリルート） |
| Install Command | `cd frontend && bun install --frozen-lockfile` |
| Build Command | `cd frontend && bun run build` |
| Output Directory | `frontend/.next` |
| Node.js Version | 20.x |
| Package Manager | Bun（`frontend/bun.lockb` を使用） |

必要に応じて `vercel.json` をリポジトリルートに配置し、上記設定をコード化する（GUI 設定でも可）。
`frontend/next.config.mjs` には、モノレポ警告抑止のため `experimental.outputFileTracingRoot` をリポジトリルートに設定することを検討。

各 Route Handler には以下を必須付与する（ethers が Edge ランタイムで動作しないため）:

```ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
```

加えて、`tx.wait()` がネットワークによっては遅延するため、`/api/mint` Route Handler には `export const maxDuration = 30;` を設定する（決定事項）。
30 秒で頻繁にタイムアウトするネットワークが見つかった場合は、リスク § 8 の通り個別に延長または非同期化を検討する。

---

## 6. 作業タスク

### フェーズ 1: backend を Next.js に移植

- [ ] 1-1. `frontend/lib/server/relayer-wallet.ts` を作成し、`backend/src/utils/ethers.ts` の `getRelayerWallet` を移植
- [ ] 1-2. `frontend/lib/server/signature-service.ts` を作成し、`backend/src/services/signatureService.ts` の純粋ロジック（`getMintParams` / `verifyAndMint` / `gaslessERC721AbiMap` / `isSupportedNetwork`）を移植
  - import パスを `../../contract/...` のまま維持できるか、`frontend/` ルート視点で `../contract/...` に調整するかは実装時に確認
- [ ] 1-3. `frontend/app/api/get-mint-params/route.ts` を作成
  - `POST` ハンドラで `request.json()` を読み、`getMintParams` を呼ぶ
  - `runtime = 'nodejs'`, `dynamic = 'force-dynamic'` を設定
  - エラーハンドリングは既存 controller と同等のレスポンス形に揃える
- [ ] 1-4. `frontend/app/api/mint/route.ts` を作成（同様に `verifyAndMint` を呼ぶ）
  - `export const maxDuration = 30;` を付与
- [ ] 1-5. `frontend/package.json` に `ethers` を依存追加（既に入っていれば不要）
- [ ] 1-6. ローカル `bun run dev` で `/api/get-mint-params`, `/api/mint` を curl 等で疎通確認

### フェーズ 2: フロントエンドの API 呼び出し置換

- [ ] 2-1. `frontend/app/gasless-mint/[networkUrl]/components/mint-button.tsx` の `apiUrl` 解決を削除し、`fetch('/api/get-mint-params', ...)` / `fetch('/api/mint', ...)` の相対パスに書き換え
- [ ] 2-2. `grep -rn NEXT_PUBLIC_API_URL frontend/` で残存参照ゼロを確認
- [ ] 2-3. ローカルで gasless mint フローの E2E 動作確認（最低 Sepolia 1 件）

### フェーズ 3: Vercel ビルド設定 + リレイヤー鍵ローテーション

- [ ] 3-1. **新リレイヤーウォレット**を生成（ローカルで `ethers.Wallet.createRandom()` 等。生成手順は記録に残す）
- [ ] 3-2. 新リレイヤーアドレスへ各テストネットのガス（ETH/POL/BNB 等）を Faucet で補給
- [ ] 3-3. Vercel プロジェクトを作成し Git 連携
- [ ] 3-4. § 5 の Build / Install / Output 設定を適用（GUI または `vercel.json`）
- [ ] 3-5. § 4 の環境変数を Vercel ダッシュボードで設定（`RELAYER_PRIVATE_KEY` は **3-1 で生成した新キー**）
- [ ] 3-6. 適当な feature ブランチを push して **Preview Deployment** が成功することを確認
- [ ] 3-7. 旧リレイヤーキーの破棄（EB 環境変数の削除確認、ローカル `.env.local` の上書き）

### フェーズ 4: 検証

- [ ] 4-1. Preview URL 上で gasless mint を実機テスト（Sepolia / Amoy / Base Sepolia 等、複数ネットワーク）
- [ ] 4-2. Standard mint / SBT mint の read 経路（コントラクト直接読み）が動作することを確認
- [ ] 4-3. Vercel Function ログでリレイヤー署名・送信のエラーが無いことを確認
- [ ] 4-4. Function 実行時間が `maxDuration` 内に収まるかを観測。超過するネットワークがあれば `maxDuration` 調整 or RPC を変更
- [ ] 4-5. Wallet 接続時 `NEXT_PUBLIC_PROJECT_ID` が読めていることを DevTools Network から確認

### フェーズ 5: 本番化・ドメイン接続

- [ ] 5-1. `racoma.dev` をレジストラで取得
- [ ] 5-2. 利用するサブドメイン構成を確定（候補: apex `racoma.dev` / `nft.racoma.dev` / `mint.racoma.dev` 等）
- [ ] 5-3. `main` にマージ → Production Deployment
- [ ] 5-4. `racoma.dev`（確定したサブドメイン）を Vercel プロジェクトに追加し、DNS レコードを設定
- [ ] 5-5. SSL 証明書の自動発行を確認
- [ ] 5-6. 旧ドメイン `nft-minting-app.rcm0208.xyz` への参照（§ 7）を新ドメインに一括置換

### フェーズ 6: 旧基盤・不要ファイル撤去

- [ ] 6-1. `.github/workflows/deploy-backend.yml` を削除
- [ ] 6-2. `.elasticbeanstalk/` を削除
- [ ] 6-3. ルートの `Dockerfile` を削除
- [ ] 6-4. `docker-compose-dev.yml` を削除（ローカル開発で使わない方針 — 決定事項）
- [ ] 6-5. `frontend/Dockerfile` を削除
- [ ] 6-6. `backend/Dockerfile.dev` を削除（`backend/` ごと削除されるため自動的に消える）
- [ ] 6-7. `backend/` ディレクトリ全体を削除
- [ ] 6-8. `frontend/lib/utils.ts` の `getURL` 関数を見直し（未使用なら削除、利用継続なら `VERCEL_URL` も考慮）
- [ ] 6-9. README を更新し、新しい開発フロー（`cd frontend && bun dev`）とデプロイフロー（Vercel）を記載

---

## 7. 旧ドメイン・旧 URL のハードコード箇所

ドメイン変更に伴い、以下を新ドメインに書き換える（フェーズ 5-4 で実施）:

| ファイル | 該当 |
|---|---|
| `frontend/context/web3modal.tsx` | `metadata.url = 'https://nft-minting-app.rcm0208.xyz'` |
| `frontend/context/web3modal.tsx` | `metadata.icons` の GitHub raw URL（必要に応じて差し替え） |
| `backend/src/index.ts` | CORS allowlist の `rcm0208.xyz` / `nft-minting-app.rcm0208.xyz`（**§ 6 で backend ごと削除** されるため対応不要） |

---

## 8. リスクと対策

| リスク | 影響 | 対策 |
|---|---|---|
| Route Handler の実行時間が `tx.wait()` で 10s を超える | mint API がタイムアウト | `maxDuration` を 30〜60s に設定。必要なら "送信のみ完了で 202 を返し、receipt は別取得" の非同期化を検討 |
| RPC レート制限 | mint 失敗の散発 | `thirdweb` 系の公開 RPC は制限が厳しいため、Alchemy / Infura のキー付き RPC へ切替を検討 |
| `RELAYER_PRIVATE_KEY` 露出 | 資金流出 | `NEXT_PUBLIC_` を絶対に付けない / Vercel Encrypted Env のみで保持 / コミット前に `git diff` で確認 |
| Bun ビルドの差異 | ローカル成功・Vercel 失敗 | Vercel は Bun サポート済だが、初回 Preview で必ず通すこと。失敗時は `npm` / `pnpm` フォールバックも検討 |
| `frontend/context/web3modal.tsx` が build 時に projectId 未定義で throw | ビルド失敗 | Vercel 環境変数を **Production / Preview / Development の 3 環境すべて** に設定 |
| クロス import (`../../contract/...`) が Vercel ビルドコンテキストに含まれない | ビルド失敗 | Root Directory を `./` に固定。`outputFileTracingRoot` 設定で Function バンドルにも含める |

---

## 9. 未決事項（着手前に確定したい）

すべて決着済み:

- [x] **新ドメイン名** → `racoma.dev` を新規取得（サブドメイン構成はフェーズ 5-2 で確定）
- [x] `RELAYER_PRIVATE_KEY` のローテーション要否 → **ローテーションする**
- [x] gasless mint の Function `maxDuration` → **30 秒**
- [x] ローカル開発で Docker / docker-compose を引き続き使うか → **使わない（全削除）**

残る微小な決定事項:

- [ ] `racoma.dev` のサブドメイン構成（apex 直当て / `nft.` / `mint.` / その他）— フェーズ 5-2

---

## 10. 参考: ファイル削除/変更サマリ（移行完了時点）

**新規作成**
- `frontend/app/api/get-mint-params/route.ts`
- `frontend/app/api/mint/route.ts`
- `frontend/lib/server/signature-service.ts`
- `frontend/lib/server/relayer-wallet.ts`
- `vercel.json`（任意）
- `frontend/.env.example`

**変更**
- `frontend/app/gasless-mint/[networkUrl]/components/mint-button.tsx`
- `frontend/context/web3modal.tsx`（メタデータ URL）
- `frontend/next.config.mjs`（必要なら `outputFileTracingRoot`）
- `README.md`

**削除**
- `backend/`（ディレクトリごと、`Dockerfile.dev` 含む）
- `.github/workflows/deploy-backend.yml`
- `.elasticbeanstalk/`
- `Dockerfile`（ルート）
- `docker-compose-dev.yml`
- `frontend/Dockerfile`
