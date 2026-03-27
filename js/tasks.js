// tasks.js — タスク生成・管理ロジック

import { getDailyLog, saveDailyLog, getDailyLogs } from './storage.js';
import { getActiveBooks, advanceChapter } from './books.js';
import { today } from './books.js';

// 今日のタスクリストを生成（ログがあれば完了状態を復元）
export function getTodayTasks() {
  const books = getActiveBooks();
  const date = today();

  return books.map((book) => {
    const log = getDailyLog(date) || getDailyLogForBook(date, book.id);
    return {
      bookId: book.id,
      bookTitle: book.title,
      currentChapter: book.currentChapter,
      totalChapters: book.totalChapters,
      taskRead: log ? log.taskRead : false,
      taskMemo: log ? log.taskMemo : false,
      memo: log ? log.memo : '',
    };
  });
}

// 特定日・特定書籍のログを取得
function getDailyLogForBook(date, bookId) {
  const logs = getDailyLogs();
  return logs.find((l) => l.date === date && l.bookId === bookId) || null;
}

// 「読む」タスクを完了/未完了にする
export function toggleTaskRead(bookId, done) {
  const date = today();
  const existing = getDailyLogForBook(date, bookId) || {
    date,
    bookId,
    taskRead: false,
    taskMemo: false,
    memo: '',
  };
  existing.taskRead = done;
  saveDailyLog(existing);

  // 読むタスク完了時に章を進める確認を返す
  if (done) {
    return { shouldAdvanceChapter: true };
  }
  return { shouldAdvanceChapter: false };
}

// 「メモ」タスクを完了/未完了にする
export function toggleTaskMemo(bookId, done, memoText = '') {
  const date = today();
  const existing = getDailyLogForBook(date, bookId) || {
    date,
    bookId,
    taskRead: false,
    taskMemo: false,
    memo: '',
  };
  existing.taskMemo = done;
  if (done) {
    existing.memo = memoText;
  }
  saveDailyLog(existing);
}

// メモテキストを保存
export function saveMemo(bookId, memoText) {
  const date = today();
  const existing = getDailyLogForBook(date, bookId) || {
    date,
    bookId,
    taskRead: false,
    taskMemo: false,
    memo: '',
  };
  existing.memo = memoText;
  saveDailyLog(existing);
}

// 今日の全タスクが完了しているか確認
export function areAllTasksComplete() {
  const tasks = getTodayTasks();
  if (tasks.length === 0) return false;
  return tasks.every((t) => t.taskRead && t.taskMemo);
}
