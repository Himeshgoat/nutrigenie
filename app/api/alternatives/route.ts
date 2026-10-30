import { NextResponse } from "next/server";
import { alternatives } from "@/lib/meal-data";

export async function GET() {
  return NextResponse.json({ alternatives });
}
