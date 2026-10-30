import type { Meal, MealPlan, NutritionTargets, Recipe, UserProfile } from "@/lib/types";
import { foodLibrary } from "@/lib/meal-data";

const mealSlots: Meal["mealType"][] = ["Breakfast", "Lunch", "Snack", "Dinner"];
const calorieSplit: Record<Meal["mealType"], number> = {
  Breakfast: 0.24,
  Lunch: 0.32,
  Snack: 0.14,
  Dinner: 0.3
};

export function generateMealPlan(profile: UserProfile, targets: NutritionTargets): MealPlan {
  const meals = mealSlots.map((slot) => buildMeal(slot, profile, targets));
  return {
    profileName: profile.name,
    totalCalories: meals.reduce((sum, meal) => sum + meal.calories, 0),
    meals,
    notes: [
      `Plan targets approximately ${targets.calories} kcal with ${targets.proteinGrams}g protein.`,
      `Food choices avoid: ${profile.allergies.length ? profile.allergies.join(", ") : "no listed allergens"}.`,
      "Portion sizes can be adjusted in the tracker to match actual intake."
    ]
  };
}

function buildMeal(slot: Meal["mealType"], profile: UserProfile, targets: NutritionTargets): Meal {
  const targetCalories = targets.calories * calorieSplit[slot];
  const slotTag = slot.toLowerCase();
  const exclusions = [...(profile.allergies ?? []), ...(profile.excludedFoods ?? []), ...(profile.dislikedIngredients ?? [])]
    .map((value) => value.toLowerCase());
  const candidates = foodLibrary
    .filter((food) => food.tags.includes(slotTag))
    .filter((food) => matchesPreference(food.tags, profile.dietPreference))
    .filter((food) => !food.allergens?.some((allergen) => exclusions.includes(allergen)))
    .filter((food) => !exclusions.some((excluded) => food.name.toLowerCase().includes(excluded)));

  const safeCandidates = candidates.length
    ? candidates
    : foodLibrary.filter(
        (food) =>
          matchesPreference(food.tags, profile.dietPreference) &&
          !food.allergens?.some((allergen) => exclusions.includes(allergen)) &&
          !exclusions.some((excluded) => food.name.toLowerCase().includes(excluded))
      );
  const sorted = [...safeCandidates].sort((a, b) => {
    const aScore = Math.abs(a.calories - targetCalories) - proteinBonus(a.protein, profile.goal);
    const bScore = Math.abs(b.calories - targetCalories) - proteinBonus(b.protein, profile.goal);
    return aScore - bScore;
  });
  const selected = sorted[stableSelectionIndex(profile, slot, sorted.length)] ?? safeCandidates[0];
  if (!selected) throw new Error("No compatible meal is available for this profile");

  const factors = [
    `${profile.dietPreference.replace("_", " ")} preference`,
    `${profile.goal.replace("_", " ")} goal`,
    `${Math.round(targetCalories)} kcal meal allocation`
  ];
  if (profile.allergies.length) factors.push("listed allergens excluded");
  if (profile.activityLevel === "active" || profile.activityLevel === "very_active") factors.push("activity level");
  const mealId = `${slot.toLowerCase()}-${slugify(selected.name)}`;
  return {
    id: mealId,
    mealType: slot,
    title: selected.name,
    foods: [selected],
    calories: selected.calories,
    protein: selected.protein,
    carbs: selected.carbs,
    fat: selected.fat,
    reason: `Selected for ${profile.dietPreference.replace("_", " ")} preference and ${profile.goal.replace("_", " ")} goal.`,
    source: "Rule-Based Recommendation",
    personalizationFactors: factors,
    selectionReason: selected.protein >= targets.proteinGrams / 4
      ? "It offers a useful protein contribution for this eating window while fitting the estimated meal allocation."
      : "It is the closest compatible option in the curated meal library for this eating window.",
    recipeId: recipeIdForMeal(mealId, selected.name)
  };
}

export function recipeIdForMeal(mealId: string, title: string): string {
  return `recipe-${mealId}-${slugify(title)}`;
}

export function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function stableSelectionIndex(profile: UserProfile, slot: Meal["mealType"], length: number): number {
  const seed = `${profile.name}|${profile.age}|${profile.weightKg}|${profile.goal}|${profile.dietPreference}|${slot}`;
  const hash = Array.from(seed).reduce((total, character) => (total * 31 + character.charCodeAt(0)) >>> 0, 7);
  return length ? hash % Math.min(length, 3) : 0;
}

function matchesPreference(tags: string[], preference: UserProfile["dietPreference"]): boolean {
  if (preference === "balanced") return true;
  return tags.includes(preference);
}

function proteinBonus(protein: number, goal: UserProfile["goal"]): number {
  return goal === "muscle_gain" ? protein * 3 : protein;
}

export function replaceMeal(
  plan: MealPlan,
  originalMealId: string,
  replacement: Meal,
  profileName = plan.profileName
): MealPlan {
  const meals = plan.meals.map((meal) => meal.id === originalMealId ? { ...replacement, mealType: meal.mealType } : meal);
  return { ...plan, profileName, meals, totalCalories: meals.reduce((sum, meal) => sum + meal.calories, 0) };
}

export function mealFromFood(
  food: (typeof foodLibrary)[number],
  slot: Meal["mealType"],
  profile: UserProfile,
  targets: NutritionTargets
): Meal {
  const mealId = `${slot.toLowerCase()}-${slugify(food.name)}`;
  return {
    id: mealId,
    mealType: slot,
    title: food.name,
    foods: [food],
    calories: food.calories,
    protein: food.protein,
    carbs: food.carbs,
    fat: food.fat,
    reason: `Suggested as a compatible ${slot.toLowerCase()} alternative for your ${profile.goal.replace("_", " ")} goal.`,
    source: "Rule-Based Recommendation",
    personalizationFactors: [`${profile.dietPreference.replace("_", " ")} preference`, `${profile.goal.replace("_", " ")} goal`, `${Math.round(targets.calories * calorieSplit[slot])} kcal meal allocation`],
    selectionReason: "It matches the meal category and is available in the curated food library.",
    recipeId: recipeIdForMeal(mealId, food.name)
  };
}

export function recipeMeal(recipe: Recipe, slot: Meal["mealType"], profile: UserProfile, targets: NutritionTargets): Meal {
  const mealId = `${slot.toLowerCase()}-${slugify(recipe.name)}`;
  return {
    id: mealId,
    mealType: slot,
    title: recipe.name,
    foods: [{
      name: recipe.name,
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fat: recipe.fat,
      tags: [slot.toLowerCase(), ...recipe.dietaryCompatibility.map((tag) => tag.toLowerCase())],
      allergens: recipe.allergens
    }],
    calories: recipe.calories,
    protein: recipe.protein,
    carbs: recipe.carbs,
    fat: recipe.fat,
    reason: `Recipe variation for your ${profile.goal.replace("_", " ")} goal.`,
    source: "Rule-Based Recommendation",
    personalizationFactors: [`${profile.dietPreference.replace("_", " ")} preference`, `${profile.goal.replace("_", " ")} goal`, `${Math.round(targets.calories * calorieSplit[slot])} kcal meal allocation`],
    selectionReason: "This recipe variation preserves the selected meal category and its nutrition estimate.",
    recipeId: recipe.id
  };
}

