import { NextResponse } from "next/server";
import { VerificationStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { createSupabaseAdmin } from "@/lib/supabase";
import { logEvent } from "@/lib/logger";

export async function PATCH(request: Request) {
  const authHeader = request.headers.get("authorization");
  const allowedAdmin = process.env.ADMIN_EMAIL ?? "admin@agencyapp.sl";

  if (!authHeader?.startsWith("Bearer ")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "").trim();
  let authUserEmail: string | null = null;
  let authUserName: string | null = null;

  try {
    const supabaseAdmin = createSupabaseAdmin();
    const {
      data: { user },
    } = await supabaseAdmin.auth.getUser(token);

    authUserEmail = user?.email ?? null;
    authUserName = typeof user?.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : null;
  } catch {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!authUserEmail || authUserEmail !== allowedAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const payload = (await request.json()) as {
    propertyId?: string;
    status?: string;
    note?: string;
  };

  if (!payload.propertyId || typeof payload.propertyId !== "string") {
    return new NextResponse("Invalid property id", { status: 400 });
  }

  if (!payload.status || !Object.values(VerificationStatus).includes(payload.status as VerificationStatus)) {
    return new NextResponse("Invalid verification status", { status: 400 });
  }

  const status = payload.status as VerificationStatus;

  const existing = await prisma.property.findUnique({
    where: { id: payload.propertyId },
    select: { id: true, verificationStatus: true },
  });
  if (!existing) return new NextResponse("Property not found", { status: 404 });

  const actor = await prisma.user.upsert({
    where: { email: authUserEmail },
    create: {
      email: authUserEmail,
      name: authUserName ?? "Admin",
      role: "ADMIN",
    },
    update: {
      name: authUserName ?? "Admin",
      role: "ADMIN",
    },
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

  logEvent("info", "property_status_changed", {
    propertyId: updated.id,
    nextStatus: status,
    actorId: actor.id,
  });

  return NextResponse.json(updated);
}
