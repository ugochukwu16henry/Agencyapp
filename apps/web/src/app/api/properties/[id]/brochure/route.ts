import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const property = await prisma.property.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      price: true,
      currency: true,
      trustTier: true,
      verificationStatus: true,
      whatsappNumber: true,
    },
  });

  if (!property) {
    return new NextResponse("Property not found", { status: 404 });
  }

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const titleFont = await pdf.embedFont(StandardFonts.HelveticaBold);

  page.drawText("AgencyApp Property Brochure", {
    x: 40,
    y: 790,
    size: 20,
    font: titleFont,
    color: rgb(0.06, 0.1, 0.16),
  });
  page.drawText(property.title, {
    x: 40,
    y: 750,
    size: 16,
    font: titleFont,
  });
  page.drawText(`Location: ${property.location}`, { x: 40, y: 720, size: 12, font });
  page.drawText(`Price: ${property.currency} ${property.price.toString()}`, {
    x: 40,
    y: 700,
    size: 12,
    font,
  });
  page.drawText(`Trust Tier: ${property.trustTier}`, { x: 40, y: 680, size: 12, font });
  page.drawText(`Verification: ${property.verificationStatus}`, {
    x: 40,
    y: 660,
    size: 12,
    font,
  });
  page.drawText(`WhatsApp: ${property.whatsappNumber ?? "N/A"}`, {
    x: 40,
    y: 640,
    size: 12,
    font,
  });

  page.drawText("Description:", { x: 40, y: 610, size: 12, font: titleFont });
  const lines = property.description.match(/.{1,85}/g) ?? [];
  lines.slice(0, 12).forEach((line, index) => {
    page.drawText(line, { x: 40, y: 590 - index * 18, size: 11, font });
  });

  const bytes = await pdf.save();
  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${property.id}-brochure.pdf"`,
    },
  });
}
