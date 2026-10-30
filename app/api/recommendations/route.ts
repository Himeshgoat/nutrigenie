import { NextResponse } from "next/server";
import { AIRecommendationService } from "@/lib/ai-recommendation-service";
import { calculateNutritionTargets } from "@/lib/nutrition-engine";
import { logPayloadSchema } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }
  const parsed = logPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid recommendation request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const targets = calculateNutritionTargets(parsed.data.profile);
  const service = new AIRecommendationService();
  const recommendations = await service.generate({
    profile: parsed.data.profile,
    targets,
    foodLogs: parsed.data.foodLogs,
    waterLogs: parsed.data.waterLogs,
    weightLogs: parsed.data.weightLogs
  });

  return NextResponse.json({ recommendations });
}
