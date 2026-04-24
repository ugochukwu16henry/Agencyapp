import Link from "next/link";
import { notFound } from "next/navigation";

import { createLead, getPropertyBySlug } from "@/lib/data";

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property || property.verificationStatus !== "APPROVED") notFound();

  const message = encodeURIComponent(
    `Hello, I am interested in ${property.title}. Can we schedule a visit?`,
  );
  const whatsappLink = `https://wa.me/${property.whatsappNumber}?text=${message}`;
  if (whatsappLink) {
    await createLead(property.id, "WHATSAPP");
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6">
      <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">Back to listings</Link>
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-3xl font-bold text-slate-900">{property.title}</h1>
        <p className="mt-2 text-slate-600">{property.description}</p>
        <p className="mt-4 font-mono text-2xl font-bold text-emerald-600">{property.currency} {property.price.toLocaleString()}</p>
        {whatsappLink ? (
          <a
            href={whatsappLink}
            className="mt-6 inline-flex rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-500"
          >
            WhatsApp Agent
          </a>
        ) : null}
      </section>
    </main>
  );
}
