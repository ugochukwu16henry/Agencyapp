import { subscriptions } from "./mock-db";

type Provider = "PAYSTACK" | "FLUTTERWAVE";

export type BillingWebhookEvent = {
  provider: Provider;
  customerEmail: string;
  reference: string;
  status: "SUCCESS" | "FAILED";
};

export const processBillingWebhook = (event: BillingWebhookEvent) => {
  const subscription = subscriptions[0];
  if (!subscription) {
    return null;
  }

  subscription.provider = event.provider;
  subscription.status = event.status === "SUCCESS" ? "ACTIVE" : "PAST_DUE";
  subscription.renewalDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();

  return subscription;
};

export const canAgentPublish = (agentUserId: string) =>
  subscriptions.some(
    (subscription) =>
      subscription.agentUserId === agentUserId && subscription.status === "ACTIVE",
  );
