import { NextResponse } from "next/server";

import { updateVerificationStatus } from "@/lib/mock-db";
import { assertRole } from "@/lib/rbac";

export async function PATCH(request: Request) {
  const userRole = request.headers.get("x-role") ?? "USER";

  try {
    assertRole(userRole as "ADMIN", ["ADMIN"]);
  } catch {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const payload = await request.json();
  const updated = updateVerificationStatus(
    payload.propertyId,
    payload.status,
    payload.approvedBy ?? "master-admin",
  );

  if (!updated) return new NextResponse("Property not found", { status: 404 });
  return NextResponse.json(updated);
}
