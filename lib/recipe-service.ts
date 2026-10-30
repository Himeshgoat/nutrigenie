import type { Meal, Recipe, RecipeIngredient, UserProfile } from "@/lib/types";

const curatedSteps: Record<string, string[]> = {
  "oats-with-chia-and-banana": [
    "Add oats, chia seeds, and the measured liquid to a bowl or saucepan.",
    "Stir until the oats soften; warm gently if serving hot.",
    "Top with sliced banana and serve immediately."
  ],
  "quinoa-chickpea-power-bowl": [
    "Rinse and cook the quinoa according to the package instructions.",
    "Warm the chickpeas with the listed seasoning and prepare the vegetables.",
    "Combine quinoa, chickpeas, and vegetables in a bowl and finish with the dressing."
  ],
  "grilled-chicken-brown-rice-plate": [
    "Season the chicken and rest it for 10 minutes.",
    "Cook the brown rice and prepare the vegetables while the chicken rests.",
    "Cook the chicken until the centre reaches a safe temperature, then slice and serve with rice and vegetables."
  ],
  "paneer-tikka-salad-bowl": [
    "Coat the paneer with yogurt and the listed spices.",
    "Grill or pan-sear the paneer until lightly browned.",
    "Toss the salad vegetables with the dressing and serve with the warm paneer."
  ],
  "tofu-stir-fry-cauliflower-rice": [
    "Press and cube the tofu, then pat it dry.",
    "Sear the tofu in the measured oil until lightly browned.",
    "Add the vegetables and sauce, stir-fry until tender, and serve over cauliflower rice."
  ]
};

const baseIngredients: Record<string, RecipeIngredient[]> = {
  "oats-with-chia-and-banana": [
    { id: "oats", name: "Rolled oats", quantity: 50, unit: "g" },
    { id: "chia", name: "Chia seeds", quantity: 10, unit: "g" },
    { id: "milk", name: "Milk or unsweetened plant milk", quantity: 180, unit: "ml", allergen: "dairy" },
    { id: "banana", name: "Banana", quantity: 1, unit: "medium" }
  ],
  "quinoa-chickpea-power-bowl": [
    { id: "quinoa", name: "Cooked quinoa", quantity: 160, unit: "g" },
    { id: "chickpeas", name: "Cooked chickpeas", quantity: 130, unit: "g" },
    { id: "vegetables", name: "Mixed vegetables", quantity: 180, unit: "g" },
    { id: "dressing", name: "Lemon-herb dressing", quantity: 20, unit: "ml" }
  ],
  "grilled-chicken-brown-rice-plate": [
    { id: "chicken", name: "Chicken breast", quantity: 150, unit: "g" },
    { id: "rice", name: "Cooked brown rice", quantity: 170, unit: "g" },
    { id: "vegetables", name: "Seasonal vegetables", quantity: 150, unit: "g" },
    { id: "oil", name: "Oil", quantity: 5, unit: "ml" }
  ],
  "paneer-tikka-salad-bowl": [
    { id: "paneer", name: "Paneer", quantity: 120, unit: "g", allergen: "dairy" },
    { id: "yogurt", name: "Plain yogurt", quantity: 40, unit: "g", allergen: "dairy" },
    { id: "vegetables", name: "Salad vegetables", quantity: 180, unit: "g" },
    { id: "oil", name: "Oil", quantity: 5, unit: "ml" }
  ],
  "tofu-stir-fry-cauliflower-rice": [
    { id: "tofu", name: "Firm tofu", quantity: 160, unit: "g", allergen: "soy" },
    { id: "cauliflower", name: "Riced cauliflower", quantity: 220, unit: "g" },
    { id: "vegetables", name: "Stir-fry vegetables", quantity: 150, unit: "g" },
    { id: "oil", name: "Oil", quantity: 5, unit: "ml" }
  ]
};

export function getRecipeForMeal(meal: Meal): Recipe {
  const key = slugify(meal.title);
  const ingredients = baseIngredients[key] ?? fallbackIngredients(meal);
  return {
    id: meal.recipeId,
    mealId: meal.id,
    name: meal.title,
    description: `A practical ${meal.mealType.toLowerCase()} built around ${meal.title.toLowerCase()}.`,
    category: meal.mealType,
    servings: 1,
    prepMinutes: key.includes("smoothie") || key.includes("bowl") ? 8 : 12,
    cookMinutes: key.includes("oats") || key.includes("smoothie") ? 5 : 18,
    difficulty: key.includes("bowl") || key.includes("smoothie") ? "Easy" : "Medium",
    ingredients,
    steps: curatedSteps[key] ?? fallbackSteps(meal.title),
    calories: meal.calories,
    protein: meal.protein,
    carbs: meal.carbs,
    fat: meal.fat,
    dietaryCompatibility: compatibilityForMeal(meal),
    allergens: [...new Set(ingredients.flatMap((ingredient) => ingredient.allergen ? [ingredient.allergen] : []))],
    substitutions: substitutionForMeal(meal),
    tips: ["Nutrition values are estimates based on the associated meal data.", "Adjust seasoning and cooking liquid to taste; these small additions are not fully represented in the estimate."],
    source: baseIngredients[key] ? "Curated application recipe" : "Rule-Based Recipe Fallback",
    nutritionNote: "Per-serving values inherit the selected meal's available food data; preparation method and brands may change the final values."
  };
}

export function scaleRecipe(recipe: Recipe, servings: number): Recipe {
  const safeServings = Math.min(12, Math.max(1, Math.round(servings)));
  const ratio = safeServings / recipe.servings;
  return {
    ...recipe,
    servings: safeServings,
    ingredients: recipe.ingredients.map((ingredient) => ({ ...ingredient, quantity: roundQuantity(ingredient.quantity * ratio) })),
    calories: Math.round(recipe.calories * ratio) / safeServings,
    protein: Math.round(recipe.protein * ratio) / safeServings,
    carbs: Math.round(recipe.carbs * ratio) / safeServings,
    fat: Math.round(recipe.fat * ratio) / safeServings
  };
}

export function recipeIsCompatible(recipe: Recipe, profile: UserProfile): { compatible: boolean; ambiguous: string[] } {
  const exclusions = [...(profile.allergies ?? []), ...(profile.excludedFoods ?? []), ...(profile.dislikedIngredients ?? [])].map((item) => item.toLowerCase());
  const ambiguous = recipe.ingredients
    .filter((ingredient) => exclusions.some((excluded) => ingredient.name.toLowerCase().includes(excluded)))
    .map((ingredient) => ingredient.name);
  return { compatible: ambiguous.length === 0, ambiguous };
}

function fallbackIngredients(meal: Meal): RecipeIngredient[] {
  const title = meal.title.toLowerCase();
  const ingredients: RecipeIngredient[] = [{ id: "main", name: meal.title, quantity: 1, unit: "serving" }];
  if (title.includes("rice") || title.includes("pasta") || title.includes("toast") || title.includes("roti")) ingredients.push({ id: "base", name: "Prepared grain or bread accompaniment", quantity: 1, unit: "serving" });
  if (title.includes("salad") || title.includes("vegetable") || title.includes("greens")) ingredients.push({ id: "produce", name: "Fresh vegetables or greens", quantity: 150, unit: "g" });
  ingredients.push({ id: "seasoning", name: "Herbs, spices, and lemon", quantity: 1, unit: "to taste", optional: true });
  return ingredients;
}

function fallbackSteps(title: string): string[] {
  return [
    `Prepare the ingredients for ${title} and measure the listed portions.`,
    "Cook or assemble the main item using the appropriate method for the ingredients.",
    "Add the vegetables, grains, or accompaniment listed in the recipe.",
    "Season, check the texture, and serve the measured portion."
  ];
}

function compatibilityForMeal(meal: Meal): string[] {
  return meal.foods[0]?.tags.filter((tag) => ["vegetarian", "vegan", "balanced", "high_protein", "low_carb"].includes(tag)) ?? [];
}

function substitutionForMeal(meal: Meal): string[] {
  if (meal.title.toLowerCase().includes("paneer")) return ["Replace paneer with firm tofu for a dairy-free variation; nutrition will change."];
  if (meal.title.toLowerCase().includes("milk") || meal.title.toLowerCase().includes("yogurt")) return ["Use an unsweetened plant-based alternative when compatible with your profile."];
  return ["Choose a comparable vegetable or grain available in your kitchen; review the nutrition estimate after changing ingredients."];
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function roundQuantity(value: number): number {
  return Math.round(value * 10) / 10;
}

