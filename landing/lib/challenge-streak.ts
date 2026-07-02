export function calculateConsecutiveStreak(completedDays: readonly number[]): number {
  const completedDaySet = new Set(completedDays);
  let streak = 0;

  while (completedDaySet.has(streak)) {
    streak += 1;
  }

  return streak;
}
