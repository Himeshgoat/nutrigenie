import type { ActivityLevel, DietPreference, Goal, NutritionTargets, UserProfile } from "@/lib/types";

export const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9
};

export const goalAdjustments: Record<Goal, number> = {
  fat_loss: -450,
  maintenance: 0,
  muscle_gain: 350
};

const proteinPerKg: Record<Goal, number> = {
  fat_loss: 1.8,
  maintenance: 1.4,
  muscle_gain: 2
};

const fatRatio: Record<DietPreference, number> = {
  balanced: 0.27,
  vegetarian: 0.28,
  vegan: 0.28,
  high_protein: 0.25,
  low_carb: 0.34
};

export function calculateNutritionTargets(profile: UserProfile): NutritionTargets {
  const genderConstant = profile.gender === "male" ? 5 : -161;
  const bmr =
    10 * profile.weightKg +
    6.25 * profile.heightCm -
    5 * profile.age +
    genderConstant;
  const tdee = bmr * activityMultipliers[profile.activityLevel];
  const goalAdjustment = goalAdjustments[profile.goal];
  const calories = Math.max(1200, tdee + goalAdjustment);

  const proteinGrams = profile.weightKg * proteinPerKg[profile.goal];
  const fatGrams = (calories * fatRatio[profile.dietPreference]) / 9;
  const proteinCalories = proteinGrams * 4;
  const fatCalories = fatGrams * 9;
  const carbCalories = Math.max(0, calories - proteinCalories - fatCalories);
  const carbsGrams = carbCalories / 4;
  const fiberGrams = Math.max(24, (calories / 1000) * 14);
  const waterLiters = Math.max(2.2, profile.weightKg * 0.035 + activityWaterBoost(profile.activityLevel));

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calories: Math.round(calories),
    proteinGrams: Math.round(proteinGrams),
    carbsGrams: Math.round(carbsGrams),
    fatGrams: Math.round(fatGrams),
    fiberGrams: Math.round(fiberGrams),
    waterLiters: Number(waterLiters.toFixed(1)),
    goalAdjustment,
    formula: "Mifflin-St Jeor BMR + activity multiplier + goal adjustment"
  };
}

function activityWaterBoost(level: ActivityLevel): number {
  if (level === "active") return 0.35;
  if (level === "very_active") return 0.55;
  if (level === "moderate") return 0.2;
  return 0;
}

export function profileCompleteness(profile: UserProfile): number {
  const fields = [
    profile.name,
    profile.age,
    profile.gender,
    profile.heightCm,
    profile.weightKg,
    profile.activityLevel,
    profile.goal,
    profile.dietPreference
  ];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}
