import { NextResponse } from "next/server";
import { generateMealPlan } from "@/lib/meal-plan-service";
import { calculateNutritionTargets } from "@/lib/nutrition-engine";
import { profileSchema } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }
  const parsed = profileSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid profile data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const targets = calculateNutritionTargets(parsed.data);
    return NextResponse.json({ plan: generateMealPlan(parsed.data, targets) });
  } catch {
    return NextResponse.json({ error: "No compatible meal plan could be generated" }, { status: 422 });
  }
}
