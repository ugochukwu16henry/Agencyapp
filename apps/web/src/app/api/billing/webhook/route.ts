import { NextResponse } from "next/server";

import { processBillingWebhook } from "@/lib/billing";

export async function POST(request: Request) {
  const payload = await request.json();

  const result = processBillingWebhook({
    provider: payload.provider,
    customerEmail: payload.customerEmail,
    reference: payload.reference,
    status: payload.status,
  });

  if (!result) return new NextResponse("No subscription found", { status: 404 });
  return NextResponse.json(result);
}
