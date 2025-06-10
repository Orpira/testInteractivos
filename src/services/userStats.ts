// services/userStats.ts
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { User } from "@auth0/auth0-react";
import { UserStats } from "../types/UserStats";

export async function updateUserStats(
  user: User,
  category: string,
  correct: number,
  total: number
) {
  const userRef = doc(db, "userStats", user.email!);
  const snapshot = await getDoc(userRef);
  const now = new Date().toISOString();

  let stats: UserStats;

  if (snapshot.exists()) {
    stats = snapshot.data() as UserStats;
  } else {
    stats = {
      totalTests: 0,
      lastTestAt: now,
      categories: {},
    };
  }

  const catStats = stats.categories[category] || {
    tests: 0,
    correctAnswers: 0,
    totalQuestions: 0,
  };

  catStats.tests += 1;
  catStats.correctAnswers += correct;
  catStats.totalQuestions += total;

  stats.categories[category] = catStats;
  stats.totalTests += 1;
  stats.lastTestAt = now;

  await setDoc(userRef, stats);
}
