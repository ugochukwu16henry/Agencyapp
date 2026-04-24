import { NextResponse } from "next/server";
import { VerificationStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { assertRole } from "@/lib/rbac";

export async function PATCH(request: Request) {
  const userRole = request.headers.get("x-role") ?? "USER";

  try {
    assertRole(userRole as "ADMIN", ["ADMIN"]);
  } catch {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const payload = await request.json();
  const status = payload.status as VerificationStatus;
  const approvedBy = payload.approvedBy ?? "master-admin";

  const existing = await prisma.property.findUnique({
    where: { id: payload.propertyId },
    select: { id: true, verificationStatus: true },
  });
  if (!existing) return new NextResponse("Property not found", { status: 404 });

  const actor = await prisma.user.upsert({
    where: { id: approvedBy },
    create: {
      id: approvedBy,
      email: `${approvedBy}@agencyapp.local`,
      name: "Admin",
      role: "ADMIN",
    },
    update: {},
  });

  const updated = await prisma.$transaction(async (tx) => {
    const property = await tx.property.update({
      where: { id: payload.propertyId },
      data: {
        verificationStatus: status,
        isVerified: status === "APPROVED",
        verifiedAt: new Date(),
        verifiedBy: actor.id,
      },
    });

    await tx.verificationEvent.create({
      data: {
        propertyId: property.id,
        actorId: actor.id,
        previous: existing.verificationStatus,
        next: status,
        note: payload.note ?? null,
      },
    });

    await tx.auditLog.create({
      data: {
        actorId: actor.id,
        action: "PROPERTY_STATUS_CHANGED",
        entityType: "Property",
        entityId: property.id,
        payload: {
          previous: existing.verificationStatus,
          next: status,
        },
      },
    });

    return property;
  });

  return NextResponse.json(updated);
}
