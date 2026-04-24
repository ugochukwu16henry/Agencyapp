import { NextResponse } from "next/server";

import {
  processBillingWebhook,
  verifyFlutterwaveSignature,
  verifyPaystackSignature,
} from "@/lib/billing";

function normalizeWebhookPayload(
  provider: "PAYSTACK" | "FLUTTERWAVE",
  payload: Record<string, unknown>,
) {
  if (provider === "PAYSTACK") {
    const data = (payload.data ?? {}) as Record<string, unknown>;
    const customer = (data.customer ?? {}) as Record<string, unknown>;
    return {
      customerEmail: String(customer.email ?? ""),
      reference: String(data.reference ?? payload.reference ?? ""),
      status: String(data.status ?? payload.status ?? "").toUpperCase() === "SUCCESS"
        ? ("SUCCESS" as const)
        : ("FAILED" as const),
      amount: Number(data.amount ?? 0) / 100,
    };
  }

  const data = (payload.data ?? {}) as Record<string, unknown>;
  const customer = (data.customer ?? {}) as Record<string, unknown>;
  return {
    customerEmail: String(customer.email ?? ""),
    reference: String(data.tx_ref ?? data.id ?? payload.id ?? ""),
    status: String(data.status ?? payload.status ?? "").toUpperCase() === "SUCCESSFUL"
      ? ("SUCCESS" as const)
      : ("FAILED" as const),
    amount: Number(data.amount ?? 0),
  };
}

export async function POST(request: Request) {
  const providerHeader = request.headers.get("x-provider");
  if (providerHeader !== "PAYSTACK" && providerHeader !== "FLUTTERWAVE") {
    return new NextResponse("Invalid provider", { status: 400 });
  }

  const rawPayload = await request.text();
  const validSignature =
    providerHeader === "PAYSTACK"
      ? verifyPaystackSignature(rawPayload, request.headers.get("x-paystack-signature") ?? "")
      : verifyFlutterwaveSignature(request.headers.get("verif-hash") ?? "");

  if (!validSignature) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  const payload = JSON.parse(rawPayload) as Record<string, unknown>;
  const normalized = normalizeWebhookPayload(providerHeader, payload);

  const result = await processBillingWebhook(
    {
    provider: providerHeader,
      customerEmail: normalized.customerEmail,
      reference: normalized.reference,
      status: normalized.status,
      amount: normalized.amount,
    },
    payload,
  );

  if (!result) return new NextResponse("No subscription found", { status: 404 });
  return NextResponse.json(result);
}
