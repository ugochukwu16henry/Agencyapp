import Link from "next/link";

import { PropertyCard } from "@/features/properties/property-card";
import { getPublicListings } from "@/lib/mock-db";

export default function Home() {
  const listings = getPublicListings();

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6">
      <header className="rounded-3xl bg-slate-900 p-8 text-white">
        <p className="text-sm uppercase tracking-widest text-amber-300">Agency App</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Ministry-verified properties and trusted agent inventory</h1>
        <p className="mt-4 max-w-2xl text-sm text-slate-200 sm:text-base">
          Search land, homes, and development opportunities with transparent trust badges and direct WhatsApp conversion.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/submit" className="rounded-lg bg-amber-500 px-4 py-2 font-medium text-slate-900 hover:bg-amber-400">List Property</Link>
          <Link href="/dashboard/admin" className="rounded-lg border border-slate-500 px-4 py-2 font-medium text-white hover:bg-slate-800">Admin Desk</Link>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </section>
    </main>
  );
}
