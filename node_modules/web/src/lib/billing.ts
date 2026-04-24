import crypto from "node:crypto";

import { SubscriptionStatus } from "@prisma/client";

type Provider = "PAYSTACK" | "FLUTTERWAVE";

export type BillingWebhookEvent = {
  provider: Provider;
  customerEmail: string;
  reference: string;
  status: "SUCCESS" | "FAILED";
  amount?: number;
};

const hashHmac = (payload: string, secret: string) =>
  crypto.createHmac("sha512", secret).update(payload).digest("hex");

export const verifyPaystackSignature = (
  payload: string,
  signature: string,
) => {
  const secret =
    process.env.PAYSTACK_WEBHOOK_SECRET ?? process.env.PAYSTACK_SECRET_KEY;
  if (!secret || !signature) {
    return false;
  }

  const expected = hashHmac(payload, secret);
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== signatureBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
};

export const verifyFlutterwaveSignature = (signature: string) => {
  const expected = process.env.FLUTTERWAVE_WEBHOOK_SECRET ?? process.env.FLW_SECRET_HASH;
  if (!expected || !signature) {
    return false;
  }
  return signature === expected;
};

export const processBillingWebhook = async (event: BillingWebhookEvent, payload: unknown) => {
  const { prisma } = await import("./prisma");

  const existingEvent = await prisma.webhookEvent.findUnique({
    where: {
      provider_reference: {
        provider: event.provider,
        reference: event.reference,
      },
    },
  });
  if (existingEvent) {
    return { alreadyProcessed: true };
  }

  const subscription = await prisma.subscription.findFirst({
    where: { agent: { user: { email: event.customerEmail } } },
    include: { agent: { include: { user: true } } },
  });
  if (!subscription) {
    return null;
  }

  const nextStatus =
    event.status === "SUCCESS" ? SubscriptionStatus.ACTIVE : SubscriptionStatus.PAST_DUE;

  const result = await prisma.$transaction(async (tx) => {
    await tx.webhookEvent.create({
      data: {
        provider: event.provider,
        reference: event.reference,
        payload: payload as never,
      },
    });

    const updatedSubscription = await tx.subscription.update({
      where: { id: subscription.id },
      data: {
        provider: event.provider,
        status: nextStatus,
        renewalDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
    });

    await tx.subscriptionInvoice.upsert({
      where: { providerRef: event.reference },
      create: {
        subscriptionId: subscription.id,
        providerRef: event.reference,
        amount: event.amount ?? 0,
        status: event.status,
        paidAt: event.status === "SUCCESS" ? new Date() : null,
      },
      update: {
        status: event.status,
        paidAt: event.status === "SUCCESS" ? new Date() : null,
      },
    });

    return updatedSubscription;
  });

  return result;
};

export const canAgentPublish = async (agentUserId: string) => {
  const { prisma } = await import("./prisma");

  const active = await prisma.subscription.count({
    where: {
      status: SubscriptionStatus.ACTIVE,
      agent: { userId: agentUserId },
    },
  });
  return active > 0;
};
