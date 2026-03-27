// streak.js — ストリーク計算ロジック

import { getStreak, saveStreak, getDailyLogs } from './storage.js';
import { getActiveBooks } from './books.js';
import { today } from './books.js';

// 前日の日付を YYYY-MM-DD 形式で返す
function yesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

// 指定日に全タスクが完了しているか確認
function wasCompletedOn(date) {
  const logs = getDailyLogs();
  const books = getActiveBooks();
  if (books.length === 0) return false;

  // その日に対してアクティブな書籍のログをチェック
  // （書籍が増減している場合を考慮し、その日のログが1つ以上あれば達成とみなす）
  const dayLogs = logs.filter((l) => l.date === date);
  if (dayLogs.length === 0) return false;

  return dayLogs.every((l) => l.taskRead && l.taskMemo);
}

// 起動時にストリークをチェック・更新する
export function checkAndUpdateStreak() {
  const streak = getStreak();
  const todayDate = today();
  const yesterdayDate = yesterday();

  // 今日すでに確認済みなら何もしない
  if (streak.lastLoggedDate === todayDate) {
    return streak;
  }

  // 昨日達成していない場合はリセット
  if (streak.lastLoggedDate !== yesterdayDate && streak.lastLoggedDate !== todayDate) {
    // 最後のログが昨日でも今日でもなければリセット
    if (streak.lastLoggedDate !== null) {
      streak.count = 0;
    }
  }

  saveStreak(streak);
  return streak;
}

// 全タスク完了時にストリークを更新する
export function incrementStreakIfComplete() {
  const streak = getStreak();
  const todayDate = today();

  // 今日すでにカウント済みなら何もしない
  if (streak.lastLoggedDate === todayDate) {
    return streak;
  }

  streak.count += 1;
  streak.lastLoggedDate = todayDate;
  saveStreak(streak);
  return streak;
}

// 現在のストリークを取得
export function getCurrentStreak() {
  return getStreak();
}
