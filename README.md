# 茶ログ (Tea Log)

日本茶の抽出条件と味の記録を、自分だけの「お茶の抽出データベース」として蓄積していく
モバイルファーストの Web アプリの MVP です。

## 技術構成

- Next.js (App Router) / TypeScript
- Tailwind CSS + shadcn/ui（手動セットアップ、`src/components/ui`）
- Supabase（Postgres + Auth、Row Level Security 有効）

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabase プロジェクトの準備

1. [Supabase](https://supabase.com) で新しいプロジェクトを作成します。
2. `supabase/migrations/0001_init.sql` の内容を SQL Editor で実行し、
   `tea_leaves` / `brews` テーブル、RLS ポリシー、MY BEST 設定用の RPC
   (`set_best_brew`) を作成します。
3. Authentication → Providers で Email 認証を有効にします（デフォルトで有効）。
   開発中にメール確認をスキップしたい場合は "Confirm email" をオフにしても構いません。

### 3. 環境変数の設定

`.env.local.example` を参考に `.env.local` を作成し、Supabase の Project URL と
anon key を設定してください。

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

`http://localhost:3000` を開き、新規登録（メール／パスワード）でアカウントを作成すると
利用できます。

## 画面構成

| 画面 | パス | 概要 |
| --- | --- | --- |
| Home | `/` | 記録 CTA、最近の抽出記録、最近飲んだ茶葉 |
| Tea Leaves | `/tea` | 登録済み茶葉の一覧 |
| New Tea Leaf | `/tea/new` | 茶葉の登録フォーム |
| Tea Detail | `/tea/[id]` | 茶葉情報・MY BEST・この茶葉の抽出履歴 |
| New Brew | `/brew/new` | 抽出記録フォーム（最重要画面） |
| Brew Detail | `/brew/[id]` | 抽出記録の詳細・MY BEST 設定 |
| Brew History | `/brew` | すべての抽出記録の一覧 |
| Login | `/login` | ログイン／新規登録 |

ボトムナビゲーションは Home / Record（中央・強調） / Tea の 3 つに絞っています。

## データベース設計

- `tea_leaves`：茶葉マスタ（`user_id` で所有者を紐付け）
- `brews`：1 回の抽出記録。`tea_leaves` に外部キーで紐づき、5 段階の味覚評価
  （香り・甘み・旨み・渋み・苦み）とメモ、`is_best` フラグを持ちます。
- 茶葉ごとに `is_best = true` の行は 1 件のみになるよう部分ユニークインデックスを設定し、
  `set_best_brew(brew_id)` という RPC 関数で「以前の MY BEST を解除 → 新しい記録を
  MY BEST に設定」をアトミックに行います。
- 両テーブルとも RLS を有効化し、`auth.uid() = user_id` の行のみ読み書きできます。

## 今後の拡張（MVP範囲外）

同じ茶葉での抽出比較 UI、レーダーチャート、抽出タイマー、写真、急須・水の種類などの
付帯情報、残量管理、好みの傾向分析などは、テーブル追加やカラム追加で拡張できる設計に
なっています。
