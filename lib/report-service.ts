import type { FoodLog, NutritionTargets, UserProfile, WaterLog, WeightLog, WeeklyReport } from "@/lib/types";

export function buildWeeklyReport(
  endDate: string,
  profile: UserProfile,
  targets: NutritionTargets,
  foodLogs: FoodLog[],
  waterLogs: WaterLog[],
  weightLogs: WeightLog[]
): WeeklyReport {
  const dates = lastSevenDays(endDate);
  const days = dates.map((date) => {
    const foods = foodLogs.filter((log) => log.date === date);
    const water = waterLogs.filter((log) => log.date === date);
    const weight = weightLogs.filter((log) => log.date === date).at(-1);
    return {
      date,
      calories: sum(foods.map((log) => log.calories)),
      protein: sum(foods.map((log) => log.protein)),
      carbs: sum(foods.map((log) => log.carbs)),
      fat: sum(foods.map((log) => log.fat)),
      water: sum(water.map((log) => log.liters)),
      foodEntries: foods.length,
      waterEntries: water.length,
      ...(weight ? { weightKg: weight.weightKg } : {})
    };
  });
  const foodDays = days.filter((day) => day.foodEntries > 0);
  const waterDays = days.filter((day) => day.waterEntries > 0);
  const averages = {
    calories: average(foodDays.map((day) => day.calories)),
    protein: average(foodDays.map((day) => day.protein)),
    carbs: average(foodDays.map((day) => day.carbs)),
    fat: average(foodDays.map((day) => day.fat)),
    water: average(waterDays.map((day) => day.water))
  };
  const insights: string[] = [];
  const suggestions: string[] = [];
  if (!foodDays.length) {
    insights.push("No food entries were recorded in this seven-day period, so intake averages are not available.");
    suggestions.push("Start by logging one meal each day; a small consistent record makes the report more useful.");
  } else {
    const belowProtein = foodDays.filter((day) => day.protein < targets.proteinGrams).length;
    const aboveCalories = foodDays.filter((day) => day.calories > targets.calories).length;
    if (belowProtein >= 3) insights.push(`Recorded protein was below your target on ${belowProtein} of the ${foodDays.length} logged food days.`);
    if (aboveCalories >= 3) insights.push(`Recorded calories were above your estimated target on ${aboveCalories} of the ${foodDays.length} logged food days.`);
    if (!insights.length) insights.push(`Food tracking was completed on ${foodDays.length} of 7 days; use the pattern as a guide, not a score.`);
    if (averages.protein < targets.proteinGrams) suggestions.push("Plan one protein-rich option in advance for the eating window you find hardest to log.");
    if (averages.calories > targets.calories) suggestions.push("Review portions and meal timing before making a large change to your overall plan.");
    if (foodDays.length < 5) suggestions.push("Improve logging consistency so future averages reflect more of your real week.");
  }
  if (!waterDays.length) {
    insights.push("No water entries were recorded, so hydration behavior cannot be compared with your target.");
    suggestions.push("Keep a bottle nearby and record each refill rather than estimating the whole day at once.");
  } else if (averages.water < targets.waterLiters) {
    insights.push(`Average recorded water intake was ${averages.water.toFixed(1)} L across ${waterDays.length} logged days, below the configured ${targets.waterLiters} L target.`);
    suggestions.push("Add a small hydration checkpoint around the first meal and afternoon activity.");
  }
  const weights = days.filter((day) => day.weightKg !== undefined).map((day) => ({ date: day.date, weightKg: day.weightKg as number }));
  if (weights.length < 2) insights.push("At least two recorded weigh-ins are needed before describing a weight trend.");
  else {
    const delta = weights.at(-1)!.weightKg - weights[0].weightKg;
    insights.push(`Recorded weight changed by ${delta >= 0 ? "+" : ""}${delta.toFixed(1)} kg across the available weigh-ins; this does not establish cause.`);
  }
  return {
    startDate: dates[0],
    endDate,
    days,
    averages,
    recordedFoodDays: foodDays.length,
    recordedWaterDays: waterDays.length,
    weightEntries: weights,
    insights: unique(insights).slice(0, 4),
    nextWeekSuggestions: unique(suggestions).slice(0, 4),
    dataSufficient: foodDays.length > 0 || waterDays.length > 0 || weights.length > 0
  };
}

function lastSevenDays(endDate: string): string[] {
  const end = new Date(`${endDate}T12:00:00`);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(end);
    date.setDate(end.getDate() - (6 - index));
    return date.toISOString().slice(0, 10);
  });
}
function sum(values: number[]): number { return Math.round(values.reduce((total, value) => total + value, 0) * 10) / 10; }
function average(values: number[]): number { return values.length ? Math.round((sum(values) / values.length) * 10) / 10 : 0; }
function unique(values: string[]): string[] { return [...new Set(values)]; }

