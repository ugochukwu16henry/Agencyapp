import { NextResponse } from "next/server";

import { getLeadMetrics } from "@/lib/data";

export async function GET() {
  const metrics = await getLeadMetrics();
  return NextResponse.json(metrics);
}
