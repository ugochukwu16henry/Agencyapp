export type BillingProvider = "PAYSTACK" | "FLUTTERWAVE";

export type BillingEvent = {
  provider: BillingProvider;
  eventType: string;
  customerEmail: string;
  reference: string;
  amount: number;
};

export interface BillingAdapter {
  verifySignature(payload: string, signature: string): boolean;
  parseEvent(payload: string): BillingEvent;
}
