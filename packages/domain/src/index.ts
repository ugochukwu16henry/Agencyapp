export enum Role {
  ADMIN = "ADMIN",
  PARTNER = "PARTNER",
  AGENT = "AGENT",
  INVESTOR = "INVESTOR",
  USER = "USER",
}

export enum VerificationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  SUSPENDED = "SUSPENDED",
}

export type PropertySummary = {
  id: string;
  title: string;
  slug: string;
  location: string;
  price: number;
  currency: string;
  verificationStatus: VerificationStatus;
  whatsappNumber: string;
};
