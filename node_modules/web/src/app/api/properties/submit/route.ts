import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { PropertyCategory, PropertyType, VerificationStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const payload = await request.json();

  const ownerId = payload.ownerUserId ?? crypto.randomUUID();
  const ownerEmail = payload.ownerEmail ?? `${ownerId}@agencyapp.local`;

  await prisma.user.upsert({
    where: { id: ownerId },
    create: {
      id: ownerId,
      email: ownerEmail,
      name: payload.ownerName ?? "Partner User",
      role: "PARTNER",
    },
    update: {
      email: ownerEmail,
      name: payload.ownerName ?? "Partner User",
    },
  });

  const property = await prisma.property.create({
    data: {
      title: payload.title,
      slug: payload.slug,
      description: payload.description,
      location: payload.location,
      locationLat:
        typeof payload.locationLat === "number" ? payload.locationLat : null,
      locationLng:
        typeof payload.locationLng === "number" ? payload.locationLng : null,
      price: payload.price,
      currency: payload.currency ?? "SLE",
      category: (payload.category ?? "LAND") as PropertyCategory,
      type: (payload.type ?? "SALE") as PropertyType,
      verificationStatus: VerificationStatus.PENDING,
      trustTier: "MINISTRY_VERIFIED",
      whatsappNumber: payload.whatsappNumber,
      coverImageUrl: payload.imageUrl ?? null,
      ownerId,
      sitePlanUrl: payload.sitePlanUrl ?? null,
    },
  });

  return NextResponse.json(property, { status: 201 });
}
