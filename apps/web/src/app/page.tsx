import Link from "next/link";

import { PropertyCard } from "@/features/properties/property-card";
import { getPublicListings } from "@/lib/data";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<{
    q?: string;
    category?: "LAND" | "HOUSE" | "APARTMENT";
    type?: "SALE" | "RENT" | "DEVELOPMENT";
    minPrice?: string;
    maxPrice?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const listings = await getPublicListings({
    query: params.q,
    category: params.category ?? "",
    type: params.type ?? "",
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
  });

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

      <form className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-5">
        <input name="q" defaultValue={params.q} placeholder="Area or title" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <select name="category" defaultValue={params.category ?? ""} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="">All categories</option>
          <option value="LAND">Land</option>
          <option value="HOUSE">House</option>
          <option value="APARTMENT">Apartment</option>
        </select>
        <select name="type" defaultValue={params.type ?? ""} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="">All types</option>
          <option value="SALE">Sale</option>
          <option value="RENT">Rent</option>
          <option value="DEVELOPMENT">Development</option>
        </select>
        <input name="minPrice" type="number" defaultValue={params.minPrice} placeholder="Min price" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <div className="flex gap-2">
          <input name="maxPrice" type="number" defaultValue={params.maxPrice} placeholder="Max price" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">Search</button>
        </div>
      </form>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </section>
    </main>
  );
}
