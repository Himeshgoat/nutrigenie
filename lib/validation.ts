import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1).max(80),
  age: z.coerce.number().int().min(13).max(100),
  gender: z.enum(["female", "male"]),
  heightCm: z.coerce.number().min(120).max(230),
  weightKg: z.coerce.number().min(30).max(250),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very_active"]),
  goal: z.enum(["fat_loss", "maintenance", "muscle_gain"]),
  dietPreference: z.enum(["balanced", "vegetarian", "vegan", "high_protein", "low_carb"]),
  allergies: z.array(z.string()).default([]),
  excludedFoods: z.array(z.string()).default([]),
  dislikedIngredients: z.array(z.string()).default([]),
  preferredIngredients: z.array(z.string()).default([]),
  cuisinePreference: z.string().max(80).optional(),
  mealFrequency: z.coerce.number().int().min(3).max(5).optional(),
  cookingTimePreference: z.enum(["quick", "standard", "any"]).optional()
});

export const logPayloadSchema = z.object({
  profile: profileSchema,
  foodLogs: z.array(z.any()).optional(),
  waterLogs: z.array(z.any()).optional(),
  weightLogs: z.array(z.any()).optional()
});
