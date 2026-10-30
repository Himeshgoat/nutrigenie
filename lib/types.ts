export type Gender = "female" | "male";
export type Goal = "fat_loss" | "maintenance" | "muscle_gain";
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";
export type DietPreference =
  | "balanced"
  | "vegetarian"
  | "vegan"
  | "high_protein"
  | "low_carb";

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  dietPreference: DietPreference;
  allergies: string[];
  excludedFoods?: string[];
  dislikedIngredients?: string[];
  preferredIngredients?: string[];
  cuisinePreference?: string;
  mealFrequency?: number;
  cookingTimePreference?: "quick" | "standard" | "any";
}

export interface NutritionTargets {
  bmr: number;
  tdee: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  waterLiters: number;
  goalAdjustment: number;
  formula: string;
}

export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tags: string[];
  allergens?: string[];
}

export interface Meal {
  id: string;
  mealType: "Breakfast" | "Lunch" | "Snack" | "Dinner";
  title: string;
  foods: FoodItem[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  reason: string;
  source: "Rule-Based Recommendation" | "OpenAI-Compatible LLM" | "Demo Recommendation";
  personalizationFactors: string[];
  selectionReason: string;
  recipeId: string;
}

export interface MealPlan {
  profileName: string;
  totalCalories: number;
  meals: Meal[];
  notes: string[];
}

export interface FoodLog {
  id: string;
  date: string;
  meal: string;
  item: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface WaterLog {
  id: string;
  date: string;
  liters: number;
}

export interface WeightLog {
  id: string;
  date: string;
  weightKg: number;
}

export interface Recommendation {
  title: string;
  message: string;
  priority: "high" | "medium" | "low";
}

export interface AIRecommendationResponse {
  engine: "OpenAI-Compatible LLM" | "Rules-based Recommendation Engine";
  summary: string;
  recommendations: Recommendation[];
}

export interface RecipeIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  allergen?: string;
  optional?: boolean;
}

export interface Recipe {
  id: string;
  mealId: string;
  name: string;
  description: string;
  category: Meal["mealType"];
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  difficulty: "Easy" | "Medium";
  ingredients: RecipeIngredient[];
  steps: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  dietaryCompatibility: string[];
  allergens: string[];
  substitutions: string[];
  tips: string[];
  source: "Curated application recipe" | "Rule-Based Recipe Fallback" | "AI-Generated Recipe";
  nutritionNote: string;
}

export interface NutritionDaySummary {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
  foodEntries: number;
  waterEntries: number;
  weightKg?: number;
}

export interface WeeklyReport {
  startDate: string;
  endDate: string;
  days: NutritionDaySummary[];
  averages: { calories: number; protein: number; carbs: number; fat: number; water: number };
  recordedFoodDays: number;
  recordedWaterDays: number;
  weightEntries: { date: string; weightKg: number }[];
  insights: string[];
  nextWeekSuggestions: string[];
  dataSufficient: boolean;
}
