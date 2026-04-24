export type Role = "ADMIN" | "PARTNER" | "AGENT" | "INVESTOR" | "USER";
export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
export type SubscriptionStatus = "TRIAL" | "ACTIVE" | "PAST_DUE" | "CANCELED";

export type Property = {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  price: number;
  currency: string;
  category: "LAND" | "HOUSE" | "APARTMENT";
  type: "SALE" | "RENT" | "DEVELOPMENT";
  verificationStatus: VerificationStatus;
  trustTier: "MINISTRY_VERIFIED" | "AGENT_LISTING";
  whatsappNumber: string;
  imageUrl: string;
  ownerUserId: string;
};

export type Lead = {
  id: string;
  propertyId: string;
  channel: "WHATSAPP" | "CALL";
  createdAt: string;
};

export type Subscription = {
  id: string;
  agentUserId: string;
  provider: "PAYSTACK" | "FLUTTERWAVE";
  status: SubscriptionStatus;
  renewalDate: string;
};
