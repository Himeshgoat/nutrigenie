import type { AIRecommendationResponse, FoodLog, NutritionTargets, UserProfile, WaterLog, WeightLog } from "@/lib/types";

interface RecommendationInput {
  profile: UserProfile;
  targets: NutritionTargets;
  foodLogs?: FoodLog[];
  waterLogs?: WaterLog[];
  weightLogs?: WeightLog[];
}

export class AIRecommendationService {
  async generate(input: RecommendationInput): Promise<AIRecommendationResponse> {
    if (!process.env.OPENAI_API_KEY) {
      return this.rulesBasedRecommendations(input);
    }

    try {
      return await this.openAICompatibleRecommendations(input);
    } catch {
      return this.rulesBasedRecommendations(input);
    }
  }

  private async openAICompatibleRecommendations(input: RecommendationInput): Promise<AIRecommendationResponse> {
    const baseUrl = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
    const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are NutriGenie's recommendation engine. Return concise JSON with summary and recommendations array. Do not diagnose disease."
          },
          {
            role: "user",
            content: JSON.stringify(input)
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error("AI provider request failed");
    }

    const payload = await response.json();
    const text = payload.choices?.[0]?.message?.content;
    const parsed = JSON.parse(text);

    return {
      engine: "OpenAI-Compatible LLM",
      summary: parsed.summary ?? "Personalized suggestions generated from your profile and logs.",
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations.slice(0, 4) : []
    };
  }

  private rulesBasedRecommendations(input: RecommendationInput): AIRecommendationResponse {
    const today = new Date().toISOString().slice(0, 10);
    const todayCalories =
      input.foodLogs?.filter((log) => log.date === today).reduce((sum, log) => sum + log.calories, 0) ?? 0;
    const todayWater =
      input.waterLogs?.filter((log) => log.date === today).reduce((sum, log) => sum + log.liters, 0) ?? 0;
    const latestWeight = input.weightLogs?.at(-1)?.weightKg ?? input.profile.weightKg;
    const calorieGap = input.targets.calories - todayCalories;

    return {
      engine: "Rules-based Recommendation Engine",
      summary: `${input.profile.name || "Your"} plan is calibrated to ${input.targets.calories} kcal/day using deterministic nutrition targets and rule-based personalization.`,
      recommendations: [
        {
          title: calorieGap > 0 ? "Complete today's calorie target" : "Keep dinner lighter",
          message:
            calorieGap > 0
              ? `You have about ${Math.round(calorieGap)} kcal remaining. Prioritize protein and vegetables in the next meal.`
              : `You are ${Math.abs(Math.round(calorieGap))} kcal above target. Choose a high-fiber, low-oil meal next.`,
          priority: "high"
        },
        {
          title: "Protein distribution",
          message: `Aim for roughly ${Math.round(input.targets.proteinGrams / 4)}g protein in each major eating window to support ${input.profile.goal.replace("_", " ")}.`,
          priority: "medium"
        },
        {
          title: "Hydration checkpoint",
          message: `Logged ${todayWater.toFixed(1)}L water today. Your target is ${input.targets.waterLiters}L, adjusted for body weight and activity.`,
          priority: todayWater < input.targets.waterLiters ? "high" : "low"
        },
        {
          title: "Progress feedback",
          message: `Latest weight entry is ${latestWeight}kg. Compare weekly averages instead of reacting to one-day changes.`,
          priority: "low"
        }
      ]
    };
  }
}
