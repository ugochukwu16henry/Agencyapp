import { NextResponse } from "next/server";

import {
  processBillingWebhook,
  verifyFlutterwaveSignature,
  verifyPaystackSignature,
} from "@/lib/billing";
import { logEvent } from "@/lib/logger";

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
    logEvent("warn", "billing_webhook_invalid_signature", {
      provider: providerHeader,
    });
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

  if (!result) {
    logEvent("warn", "billing_webhook_subscription_missing", {
      provider: providerHeader,
      reference: normalized.reference,
    });
    return new NextResponse("No subscription found", { status: 404 });
  }
  logEvent("info", "billing_webhook_processed", {
    provider: providerHeader,
    reference: normalized.reference,
  });
  return NextResponse.json(result);
}
