import crypto from "node:crypto";
import { describe, expect, it } from "vitest";

import {
  verifyFlutterwaveSignature,
  verifyPaystackSignature,
} from "@/lib/billing";

describe("billing orchestrator", () => {
  it("validates paystack webhook signatures", () => {
    process.env.PAYSTACK_SECRET_KEY = "secret";
    const payload = JSON.stringify({ reference: "trx-1" });
    const signature = crypto
      .createHmac("sha512", "secret")
      .update(payload)
      .digest("hex");

    expect(verifyPaystackSignature(payload, signature)).toBe(true);
  });

  it("validates flutterwave hash header", () => {
    process.env.FLW_SECRET_HASH = "flw-hash";
    expect(verifyFlutterwaveSignature("flw-hash")).toBe(true);
  });
});
