// books.js — 書籍管理ロジック

import { getBooks, saveBooks } from './storage.js';

// UUIDを生成（簡易実装）
function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// 今日の日付を YYYY-MM-DD 形式で返す
export function today() {
  return new Date().toISOString().slice(0, 10);
}

// 書籍を追加
export function addBook({ title, author = '', totalChapters = 1, currentChapter = 1 }) {
  const books = getBooks();
  const book = {
    id: generateId(),
    title,
    author,
    totalChapters: Number(totalChapters),
    currentChapter: Number(currentChapter),
    isActive: true,
    createdAt: today(),
  };
  books.push(book);
  saveBooks(books);
  return book;
}

// 書籍を更新
export function updateBook(id, changes) {
  const books = getBooks();
  const idx = books.findIndex((b) => b.id === id);
  if (idx < 0) return null;
  books[idx] = { ...books[idx], ...changes };
  // 読了チェック
  if (books[idx].currentChapter >= books[idx].totalChapters) {
    books[idx].isActive = false;
  }
  saveBooks(books);
  return books[idx];
}

// 章を1進める
export function advanceChapter(id) {
  const books = getBooks();
  const book = books.find((b) => b.id === id);
  if (!book) return null;
  const nextChapter = book.currentChapter + 1;
  return updateBook(id, { currentChapter: nextChapter });
}

// アクティブな書籍を最大2冊取得
export function getActiveBooks() {
  const books = getBooks();
  return books.filter((b) => b.isActive).slice(0, 2);
}

// 全書籍を取得（アクティブ・完了含む）
export function getAllBooks() {
  return getBooks();
}

// 書籍を削除
export function deleteBook(id) {
  const books = getBooks().filter((b) => b.id !== id);
  saveBooks(books);
}
