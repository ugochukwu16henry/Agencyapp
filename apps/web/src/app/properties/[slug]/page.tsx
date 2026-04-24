import Link from "next/link";
import { notFound } from "next/navigation";

import { PropertyMap } from "@/components/property-map";
import { createLead, getPropertyBySlug } from "@/lib/data";

const currencyFormatter = new Intl.NumberFormat("en-US");

export const dynamic = "force-dynamic";

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
        <p className="mt-4 font-mono text-2xl font-bold text-emerald-600">{property.currency} {currencyFormatter.format(property.price)}</p>
        {whatsappLink ? (
          <a
            href={whatsappLink}
            className="mt-6 inline-flex rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-500"
          >
            WhatsApp Agent
          </a>
        ) : null}
        <a
          href={`/api/properties/${property.id}/brochure`}
          className="ml-3 mt-6 inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Download Brochure
        </a>
      </section>
      <PropertyMap lat={property.locationLat} lng={property.locationLng} />
    </main>
  );
}
