import type { Lead, Property, Subscription } from "./types";

const buildWhatsappMessage = (phone: string, propertyTitle: string) => {
  const message = encodeURIComponent(
    `Hello, I am interested in ${propertyTitle}. Can we schedule a visit?`,
  );

  return `https://wa.me/${phone}?text=${message}`;
};

export const properties: Property[] = [
  {
    id: "prop-1",
    title: "3-Acre Plot, Tokeh",
    slug: "3-acre-plot-tokeh",
    description: "Ministry-verified land with clear boundary references.",
    location: "Tokeh, Western Area",
    price: 12500,
    currency: "USD",
    category: "LAND",
    type: "SALE",
    verificationStatus: "APPROVED",
    trustTier: "MINISTRY_VERIFIED",
    whatsappNumber: "23276000000",
    imageUrl:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
    ownerUserId: "user-partner-1",
  },
  {
    id: "prop-2",
    title: "4 Bed Home, Lumley",
    slug: "4-bed-home-lumley",
    description: "External agent listing with premium finish and backup power.",
    location: "Lumley, Freetown",
    price: 1800,
    currency: "USD",
    category: "HOUSE",
    type: "RENT",
    verificationStatus: "APPROVED",
    trustTier: "AGENT_LISTING",
    whatsappNumber: "23277000000",
    imageUrl:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
    ownerUserId: "user-agent-1",
  },
];

export const leads: Lead[] = [];
export const subscriptions: Subscription[] = [
  {
    id: "sub-1",
    agentUserId: "user-agent-1",
    provider: "PAYSTACK",
    status: "ACTIVE",
    renewalDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(),
  },
];

export const verificationEvents: string[] = [];

export const getPublicListings = () => properties.filter((p) => p.verificationStatus === "APPROVED");
export const getPropertyBySlug = (slug: string) => properties.find((p) => p.slug === slug);

export const updateVerificationStatus = (propertyId: string, status: Property["verificationStatus"], approvedBy: string) => {
  const property = properties.find((item) => item.id === propertyId);
  if (!property) return null;
  property.verificationStatus = status;
  verificationEvents.push(`${approvedBy} -> ${property.title} -> ${status} @ ${new Date().toISOString()}`);
  return property;
};

export const addLead = (propertyId: string, channel: Lead["channel"]) => {
  leads.push({ id: `lead-${leads.length + 1}`, propertyId, channel, createdAt: new Date().toISOString() });
};

export const getWhatsappLink = (propertyId: string) => {
  const property = properties.find((item) => item.id === propertyId);
  if (!property) return null;
  return buildWhatsappMessage(property.whatsappNumber, property.title);
};
