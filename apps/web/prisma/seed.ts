import {
  PropertyCategory,
  PropertyStatus,
  PropertyType,
  PrismaClient,
  Role,
  SubscriptionStatus,
  VerificationStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

async function seedUsers() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@agencyapp.sl" },
    update: { name: "Master Admin", role: Role.ADMIN },
    create: {
      email: "admin@agencyapp.sl",
      name: "Master Admin",
      role: Role.ADMIN,
      equityPercent: 40,
    },
  });

  const partner = await prisma.user.upsert({
    where: { email: "partner1@agencyapp.sl" },
    update: { name: "Partner One", role: Role.PARTNER },
    create: {
      email: "partner1@agencyapp.sl",
      name: "Partner One",
      role: Role.PARTNER,
      equityPercent: 8.57,
    },
  });

  const agent = await prisma.user.upsert({
    where: { email: "agent1@agencyapp.sl" },
    update: { name: "Agent One", role: Role.AGENT },
    create: {
      email: "agent1@agencyapp.sl",
      name: "Agent One",
      role: Role.AGENT,
    },
  });

  return { admin, partner, agent };
}

async function seedProperties(partnerId: string, adminId: string) {
  const first = await prisma.property.upsert({
    where: { slug: "3-acre-plot-tokeh" },
    update: {
      verificationStatus: VerificationStatus.APPROVED,
      isVerified: true,
      verifiedBy: adminId,
      verifiedAt: new Date(),
    },
    create: {
      title: "3-Acre Plot, Tokeh",
      slug: "3-acre-plot-tokeh",
      description: "Ministry-verified land with clear boundaries and access road.",
      price: 12500,
      currency: "USD",
      category: PropertyCategory.LAND,
      type: PropertyType.SALE,
      status: PropertyStatus.AVAILABLE,
      location: "Tokeh, Western Area",
      verificationStatus: VerificationStatus.APPROVED,
      trustTier: "MINISTRY_VERIFIED",
      whatsappNumber: "23276000000",
      coverImageUrl:
        "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
      ownerId: partnerId,
      isVerified: true,
      verifiedBy: adminId,
      verifiedAt: new Date(),
      sitePlanUrl: "https://storage.example.com/siteplans/tokeh-3-acre.pdf",
    },
  });

  await prisma.verificationEvent.upsert({
    where: { id: `verify-${first.id}` },
    update: {},
    create: {
      id: `verify-${first.id}`,
      propertyId: first.id,
      actorId: adminId,
      previous: VerificationStatus.PENDING,
      next: VerificationStatus.APPROVED,
      note: "Ministry check completed.",
    },
  });

  await prisma.property.upsert({
    where: { slug: "4-bed-home-lumley" },
    update: {},
    create: {
      title: "4 Bed Home, Lumley",
      slug: "4-bed-home-lumley",
      description: "Premium rental house listed by active subscribed agent.",
      price: 1800,
      currency: "USD",
      category: PropertyCategory.HOUSE,
      type: PropertyType.RENT,
      status: PropertyStatus.AVAILABLE,
      location: "Lumley, Freetown",
      verificationStatus: VerificationStatus.APPROVED,
      trustTier: "AGENT_LISTING",
      whatsappNumber: "23277000000",
      coverImageUrl:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
      ownerId: partnerId,
      isVerified: true,
      verifiedBy: adminId,
      verifiedAt: new Date(),
    },
  });
}

async function seedAgentSubscription(agentUserId: string) {
  const profile = await prisma.agentProfile.upsert({
    where: { userId: agentUserId },
    update: { companyName: "Lumley Prime Estates" },
    create: {
      userId: agentUserId,
      companyName: "Lumley Prime Estates",
      licenseNumber: "SL-AG-2026-001",
    },
  });

  const subscription = await prisma.subscription.upsert({
    where: { id: "sub-seed-agent-1" },
    update: {
      provider: "PAYSTACK",
      status: SubscriptionStatus.ACTIVE,
      renewalDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
    create: {
      id: "sub-seed-agent-1",
      agentId: profile.id,
      provider: "PAYSTACK",
      status: SubscriptionStatus.ACTIVE,
      renewalDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  });

  await prisma.subscriptionInvoice.upsert({
    where: { providerRef: "seed-invoice-paystack-001" },
    update: { status: "SUCCESS", paidAt: new Date() },
    create: {
      subscriptionId: subscription.id,
      providerRef: "seed-invoice-paystack-001",
      amount: 1000,
      currency: "SLE",
      status: "SUCCESS",
      paidAt: new Date(),
    },
  });
}

async function main() {
  const { admin, partner, agent } = await seedUsers();
  await seedProperties(partner.id, admin.id);
  await seedAgentSubscription(agent.id);

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "SEED_COMPLETED",
      entityType: "System",
      entityId: "seed-v1",
      payload: { seededAt: new Date().toISOString() },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
