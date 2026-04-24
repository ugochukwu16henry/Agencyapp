import { NextResponse } from "next/server";

import { properties } from "@/lib/mock-db";

export async function POST(request: Request) {
  const payload = await request.json();

  const record = {
    id: `prop-${properties.length + 1}`,
    title: payload.title,
    slug: payload.slug,
    description: payload.description,
    location: payload.location,
    price: payload.price,
    currency: payload.currency ?? "SLE",
    category: payload.category ?? "LAND",
    type: payload.type ?? "SALE",
    verificationStatus: "PENDING" as const,
    trustTier: "MINISTRY_VERIFIED" as const,
    whatsappNumber: payload.whatsappNumber,
    imageUrl: payload.imageUrl,
    ownerUserId: payload.ownerUserId ?? "user-partner-1",
  };

  properties.push(record);
  return NextResponse.json(record, { status: 201 });
}
