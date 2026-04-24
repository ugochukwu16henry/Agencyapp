import {
  PropertyCategory,
  PropertyType,
  VerificationStatus,
  type SubscriptionStatus,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

type UiProperty = {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  price: number;
  currency: string;
  category: "LAND" | "HOUSE" | "APARTMENT";
  type: "SALE" | "RENT" | "DEVELOPMENT";
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  trustTier: "MINISTRY_VERIFIED" | "AGENT_LISTING";
  whatsappNumber: string;
  imageUrl: string;
  ownerUserId: string;
};

type ListingFilters = {
  query?: string;
  category?: "LAND" | "HOUSE" | "APARTMENT" | "";
  type?: "SALE" | "RENT" | "DEVELOPMENT" | "";
  minPrice?: number;
  maxPrice?: number;
};

const toUiProperty = (property: {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  price: { toNumber(): number };
  currency: string;
  category: PropertyCategory;
  type: PropertyType;
  verificationStatus: VerificationStatus;
  trustTier: string;
  whatsappNumber: string | null;
  coverImageUrl: string | null;
  ownerId: string;
}) =>
  ({
    id: property.id,
    title: property.title,
    slug: property.slug,
    description: property.description,
    location: property.location,
    price: property.price.toNumber(),
    currency: property.currency,
    category: property.category,
    type: property.type,
    verificationStatus: property.verificationStatus,
    trustTier:
      property.trustTier === "AGENT_LISTING"
        ? "AGENT_LISTING"
        : "MINISTRY_VERIFIED",
    whatsappNumber: property.whatsappNumber ?? "",
    imageUrl: property.coverImageUrl ?? "",
    ownerUserId: property.ownerId,
  }) satisfies UiProperty;

export async function getPublicListings(filters?: ListingFilters) {
  try {
    const properties = await prisma.property.findMany({
      where: {
        verificationStatus: VerificationStatus.APPROVED,
        deletedAt: null,
        ...(filters?.query
          ? {
              OR: [
                { title: { contains: filters.query, mode: "insensitive" } },
                { location: { contains: filters.query, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(filters?.category ? { category: filters.category } : {}),
        ...(filters?.type ? { type: filters.type } : {}),
        ...(filters?.minPrice || filters?.maxPrice
          ? {
              price: {
                ...(filters?.minPrice ? { gte: filters.minPrice } : {}),
                ...(filters?.maxPrice ? { lte: filters.maxPrice } : {}),
              },
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });
    return properties.map(toUiProperty);
  } catch {
    return [];
  }
}

export async function getPropertyBySlug(slug: string) {
  try {
    const property = await prisma.property.findFirst({
      where: {
        slug,
        verificationStatus: VerificationStatus.APPROVED,
        deletedAt: null,
      },
    });
    return property ? toUiProperty(property) : null;
  } catch {
    return null;
  }
}

export async function createLead(propertyId: string, channel: "WHATSAPP" | "CALL") {
  await prisma.lead.create({
    data: {
      propertyId,
      channel,
      source: "PUBLIC_PORTAL",
    },
  });
}

export async function getLeadMetrics() {
  try {
    const [totalLeads, whatsappLeads, callLeads, timeline] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { channel: "WHATSAPP" } }),
      prisma.lead.count({ where: { channel: "CALL" } }),
      prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        select: { id: true, propertyId: true, channel: true, createdAt: true },
      }),
    ]);
    return { totalLeads, whatsappLeads, callLeads, timeline };
  } catch {
    return { totalLeads: 0, whatsappLeads: 0, callLeads: 0, timeline: [] };
  }
}

export async function getLeadAnalytics() {
  try {
    const [byChannel, byProperty] = await Promise.all([
      prisma.lead.groupBy({
        by: ["channel"],
        _count: { channel: true },
      }),
      prisma.lead.groupBy({
        by: ["propertyId"],
        _count: { propertyId: true },
        orderBy: { _count: { propertyId: "desc" } },
        take: 10,
      }),
    ]);

    const topPropertyIds = byProperty.map((item) => item.propertyId);
    const properties = await prisma.property.findMany({
      where: { id: { in: topPropertyIds } },
      select: { id: true, title: true, owner: { select: { email: true } } },
    });
    const propertyMap = new Map(properties.map((p) => [p.id, p]));

    return {
      byChannel,
      byProperty: byProperty.map((entry) => ({
        propertyId: entry.propertyId,
        count: entry._count.propertyId,
        title: propertyMap.get(entry.propertyId)?.title ?? "Unknown",
        partnerEmail: propertyMap.get(entry.propertyId)?.owner.email ?? "Unknown",
      })),
    };
  } catch {
    return { byChannel: [], byProperty: [] };
  }
}

export async function getPendingQueue() {
  try {
    const [pending, events] = await Promise.all([
      prisma.property.findMany({
        where: { verificationStatus: VerificationStatus.PENDING, deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 50,
        select: { id: true, title: true, location: true },
      }),
      prisma.verificationEvent.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          actorId: true,
          previous: true,
          next: true,
          createdAt: true,
          property: { select: { title: true } },
        },
      }),
    ]);
    return { pending, events };
  } catch {
    return { pending: [], events: [] };
  }
}

export async function getSubscriptionOverview() {
  try {
    const rows = await prisma.subscription.findMany({
      include: {
        agent: { include: { user: { select: { id: true, email: true } } } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return rows.map((row) => ({
      id: row.id,
      agentUserId: row.agent.user.id,
      agentEmail: row.agent.user.email,
      provider: row.provider,
      status: row.status as SubscriptionStatus,
      renewalDate: row.renewalDate?.toISOString() ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}
