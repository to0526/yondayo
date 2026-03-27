// storage.js — localStorageの唯一の操作口

const KEYS = {
  BOOKS: 'books',
  DAILY_LOGS: 'dailyLogs',
  STREAK: 'streak',
};

// 書籍リストを取得
export function getBooks() {
  try {
    const data = localStorage.getItem(KEYS.BOOKS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('書籍データの読み込みに失敗しました', e);
    return [];
  }
}

// 書籍リストを保存
export function saveBooks(books) {
  try {
    localStorage.setItem(KEYS.BOOKS, JSON.stringify(books));
  } catch (e) {
    console.error('書籍データの保存に失敗しました', e);
  }
}

// 日次ログを取得
export function getDailyLogs() {
  try {
    const data = localStorage.getItem(KEYS.DAILY_LOGS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('ログデータの読み込みに失敗しました', e);
    return [];
  }
}

// 日次ログを保存
export function saveDailyLogs(logs) {
  try {
    localStorage.setItem(KEYS.DAILY_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('ログデータの保存に失敗しました', e);
  }
}

// 指定日のログを取得（なければnull）
export function getDailyLog(date) {
  const logs = getDailyLogs();
  return logs.find((l) => l.date === date) || null;
}

// 指定日のログを保存（上書き or 追加）
export function saveDailyLog(log) {
  const logs = getDailyLogs();
  const idx = logs.findIndex((l) => l.date === log.date && l.bookId === log.bookId);
  if (idx >= 0) {
    logs[idx] = log;
  } else {
    logs.push(log);
  }
  saveDailyLogs(logs);
}

// ストリーク情報を取得
export function getStreak() {
  try {
    const data = localStorage.getItem(KEYS.STREAK);
    return data ? JSON.parse(data) : { count: 0, lastLoggedDate: null };
  } catch (e) {
    console.error('ストリークデータの読み込みに失敗しました', e);
    return { count: 0, lastLoggedDate: null };
  }
}

// ストリーク情報を保存
export function saveStreak(streak) {
  try {
    localStorage.setItem(KEYS.STREAK, JSON.stringify(streak));
  } catch (e) {
    console.error('ストリークデータの保存に失敗しました', e);
  }
}
