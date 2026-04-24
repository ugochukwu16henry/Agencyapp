import { NextResponse } from "next/server";

import { leads } from "@/lib/mock-db";

export async function GET() {
  return NextResponse.json({
    totalLeads: leads.length,
    whatsappLeads: leads.filter((lead) => lead.channel === "WHATSAPP").length,
    callLeads: leads.filter((lead) => lead.channel === "CALL").length,
    timeline: leads,
  });
}
