import type { FoodItem } from "@/lib/types";

export const foodLibrary: FoodItem[] = [
  { name: "Oats with chia and banana", calories: 390, protein: 14, carbs: 67, fat: 10, tags: ["breakfast", "balanced", "vegetarian", "vegan"] },
  { name: "Greek yogurt berry bowl", calories: 310, protein: 24, carbs: 38, fat: 8, tags: ["breakfast", "snack", "balanced", "vegetarian", "high_protein"], allergens: ["dairy"] },
  { name: "Moong dal chilla with mint curd", calories: 360, protein: 22, carbs: 45, fat: 10, tags: ["breakfast", "vegetarian", "high_protein"], allergens: ["dairy"] },
  { name: "Tofu scramble millet toast", calories: 420, protein: 25, carbs: 48, fat: 15, tags: ["breakfast", "vegan", "high_protein"] },
  { name: "Egg white veggie omelette", calories: 290, protein: 28, carbs: 12, fat: 14, tags: ["breakfast", "low_carb", "high_protein"], allergens: ["egg"] },
  { name: "Quinoa chickpea power bowl", calories: 520, protein: 22, carbs: 76, fat: 15, tags: ["lunch", "balanced", "vegetarian", "vegan"] },
  { name: "Paneer tikka salad bowl", calories: 560, protein: 35, carbs: 38, fat: 30, tags: ["lunch", "dinner", "vegetarian", "high_protein", "low_carb"], allergens: ["dairy"] },
  { name: "Grilled chicken brown rice plate", calories: 610, protein: 48, carbs: 65, fat: 16, tags: ["lunch", "dinner", "balanced", "high_protein"] },
  { name: "Rajma brown rice with salad", calories: 590, protein: 24, carbs: 92, fat: 13, tags: ["lunch", "balanced", "vegetarian", "vegan"] },
  { name: "Lentil soup with roasted vegetables", calories: 430, protein: 23, carbs: 58, fat: 12, tags: ["lunch", "dinner", "vegetarian", "vegan"] },
  { name: "Salmon avocado greens", calories: 540, protein: 38, carbs: 18, fat: 35, tags: ["lunch", "dinner", "low_carb", "high_protein"], allergens: ["fish"] },
  { name: "Soya chunk masala with phulka", calories: 500, protein: 38, carbs: 58, fat: 12, tags: ["lunch", "dinner", "vegetarian", "vegan", "high_protein"], allergens: ["soy"] },
  { name: "Sprouts bhel with peanuts", calories: 280, protein: 15, carbs: 36, fat: 9, tags: ["snack", "vegetarian", "vegan"], allergens: ["peanut"] },
  { name: "Apple with almond butter", calories: 240, protein: 6, carbs: 28, fat: 13, tags: ["snack", "balanced", "vegetarian", "vegan"], allergens: ["tree nut"] },
  { name: "Protein smoothie with spinach", calories: 330, protein: 30, carbs: 36, fat: 8, tags: ["snack", "high_protein", "vegetarian"], allergens: ["dairy"] },
  { name: "Cucumber hummus plate", calories: 220, protein: 9, carbs: 25, fat: 10, tags: ["snack", "vegan", "balanced"] },
  { name: "Turkey lettuce wraps", calories: 340, protein: 36, carbs: 14, fat: 16, tags: ["snack", "dinner", "low_carb", "high_protein"] },
  { name: "Vegetable khichdi with curd", calories: 480, protein: 20, carbs: 70, fat: 13, tags: ["dinner", "balanced", "vegetarian"], allergens: ["dairy"] },
  { name: "Tofu stir fry cauliflower rice", calories: 410, protein: 28, carbs: 24, fat: 24, tags: ["dinner", "vegan", "low_carb", "high_protein"], allergens: ["soy"] },
  { name: "Whole wheat pasta with beans", calories: 560, protein: 26, carbs: 88, fat: 12, tags: ["dinner", "vegetarian", "vegan", "balanced"] }
];

export const alternatives = [
  { insteadOf: "White rice", choose: "Brown rice or quinoa", benefit: "More fiber and steadier energy release" },
  { insteadOf: "Sugary cereal", choose: "Oats with fruit and seeds", benefit: "Higher satiety with less added sugar" },
  { insteadOf: "Fried snacks", choose: "Roasted chana or sprouts bhel", benefit: "More protein with fewer empty calories" },
  { insteadOf: "Creamy dressing", choose: "Hung curd, lemon, or herb dressing", benefit: "Keeps flavor while reducing saturated fat" },
  { insteadOf: "Soft drinks", choose: "Lemon water or unsweetened iced tea", benefit: "Hydration without liquid calories" },
  { insteadOf: "Refined flour bread", choose: "Whole wheat roti or millet toast", benefit: "Better micronutrients and fiber" }
];
