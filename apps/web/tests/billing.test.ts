import { describe, expect, it } from "vitest";

import { canAgentPublish, processBillingWebhook } from "@/lib/billing";

describe("billing orchestrator", () => {
  it("activates a subscription after successful webhook", () => {
    const subscription = processBillingWebhook({
      provider: "FLUTTERWAVE",
      customerEmail: "agent@example.com",
      reference: "trx-1",
      status: "SUCCESS",
    });

    expect(subscription?.status).toBe("ACTIVE");
  });

  it("allows publishing when active", () => {
    expect(canAgentPublish("user-agent-1")).toBe(true);
  });
});
