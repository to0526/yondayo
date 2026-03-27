# 読書習慣アプリ CLAUDE.md

## プロジェクト概要

毎日の読書習慣を継続するためのPWAアプリ。
フロントエンドのみ（HTML + CSS + Vanilla JS）で実装し、データはlocalStorageで管理する。

## 目的・コンセプト

- 毎日の「やらされ感」で読書を継続させる
- フィットボクシングのように軽いデイリータスクで習慣化
- シンプルに保ち、続けることを最優先とする

---

## 技術スタック

| 項目 | 内容 |
|------|------|
| 実装 | HTML + CSS + Vanilla JS（フレームワークなし） |
| データ永続化 | localStorage |
| PWA | manifest.json + Service Worker |
| 外部ライブラリ | 原則使用しない |

---

## ファイル構成

```
/
├── index.html        # メイン画面（今日のタスク）
├── books.html        # 書籍一覧・管理画面
├── add-book.html     # 書籍追加画面
├── history.html      # 過去ログ画面
├── manifest.json     # PWA設定
├── sw.js             # Service Worker
├── css/
│   └── style.css     # 共通スタイル
└── js/
    ├── storage.js    # localStorageの読み書き
    ├── tasks.js      # タスク生成・管理ロジック
    ├── streak.js     # ストリーク計算
    └── books.js      # 書籍管理ロジック
```

---

## データ設計（localStorage）

### `books` — 書籍リスト

```json
[
  {
    "id": "uuid",
    "title": "ゆるストイック",
    "author": "田中あさ美",
    "totalChapters": 12,
    "currentChapter": 7,
    "isActive": true,
    "createdAt": "2026-03-01"
  }
]
```

### `dailyLogs` — 日次ログ

```json
[
  {
    "date": "2026-03-28",
    "bookId": "uuid",
    "taskRead": true,
    "taskMemo": true,
    "memo": "習慣化には小さな目標が重要だとわかった。..."
  }
]
```

### `streak` — ストリーク情報

```json
{
  "count": 5,
  "lastLoggedDate": "2026-03-27"
}
```

---

## 画面仕様

### index.html（今日のタスク）

- 今日の日付表示
- ストリーク日数（炎アイコン付き）
- 読書中の本（最大2冊）の進捗カード
- 今日のタスク（本ごとにグループ化）
  - 「第N章を読む」チェック
  - 「3行メモを書く」チェック → チェック外すとメモ欄が展開
- 全タスク完了でストリーク+1

### books.html（書籍一覧）

- 読書中の本一覧（進捗バー付き）
- 完了済みの本一覧
- 「本を追加」ボタン → add-book.htmlへ

### add-book.html（書籍追加）

- 入力項目：タイトル（必須）、著者名、総章数、開始章
- 追加後はbooks.htmlに戻る

### history.html（過去ログ）

- 日付ごとのログ一覧
- メモの確認

---

## ロジック仕様

### 今日のタスク生成

- `isActive: true` の書籍から最大2冊を選ぶ
- 各書籍に「読む」「メモ」の2タスクを生成（合計最大4タスク）
- 今日のログが存在する場合は完了状態を復元する

### ストリーク計算

- 全タスク完了 → その日のストリーク達成とみなす
- 翌日起動時に昨日達成済みか確認し、未達成なら0にリセット
- 日付は `YYYY-MM-DD` 文字列で管理する

### 進捗更新

- タスク「読む」を完了したタイミングで `currentChapter + 1` を促す確認を出す（任意）
- `currentChapter >= totalChapters` で読了フラグを立てる

---

## UX方針

- 操作は最小限（タップ1〜2回で完結）
- メモ欄はタスクチェックを外したときだけ展開する
- ストリークが崩れそうなときは視覚的に警告しない（プレッシャーより継続を優先）
- 完了済みタスクは薄くなるだけでリストから消さない

---

## PWA設定方針

- オフライン動作を基本とする（全データlocalStorage）
- Service Workerでアセットをキャッシュする
- ホーム画面追加時のアイコン・名称を設定する（名称：読書ログ）
- スプラッシュ画面は不要

---

## コーディング規約

- Vanilla JSのみ、`import/export` はESModules形式で統一
- クラスより関数ベースで書く
- コメントは日本語で書く
- `storage.js` を唯一のlocalStorage操作口とし、他のモジュールから直接 `localStorage` を触らない
- エラーは `console.error` に留め、ユーザーにはやさしい文言で表示する

---

## 今後の拡張候補（MVP対象外）

- Rails API + 認証によるサーバーサイド保存
- Claudeによる週次補足・クイズセッション
- 複数デバイス間のデータ同期
