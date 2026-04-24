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

  const discoveryCount = listings.length;

  return (
    <main className="mx-auto max-w-7xl space-y-10 px-4 pb-14 pt-8 sm:px-6 lg:space-y-12 lg:px-10">
      <header className="hero-grid relative isolate overflow-hidden rounded-[2rem] border border-slate-200/70 bg-slate-950 px-5 py-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.35)] sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <div className="pointer-events-none absolute -left-14 -top-14 h-60 w-60 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-4 h-72 w-72 rounded-full bg-cyan-300/15 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(234,179,8,0.16),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(56,189,248,0.14),transparent_40%)]" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <p className="inline-flex items-center rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-200">
            Trusted Property Intelligence
          </p>
          <h1 className="font-display text-3xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            First-Class Land and Real Estate Listings for Sierra Leone.
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
            Discover ministry-verified opportunities, licensed partner listings, and ready-to-close deals with transparent trust workflow.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/submit"
              className="inline-flex items-center rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-300"
            >
              List Property
            </Link>
            <Link
              href="/dashboard/admin"
              className="inline-flex items-center rounded-xl border border-slate-400/60 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              Admin Desk
            </Link>
          </div>
        </div>

        <div className="relative z-10 mt-8 grid gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur sm:grid-cols-3 lg:mt-10">
          <div className="rounded-xl border border-white/15 bg-slate-950/45 p-3">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-300">Live Inventory</p>
            <p className="mt-1 text-2xl font-semibold text-white">{discoveryCount}</p>
          </div>
          <div className="rounded-xl border border-white/15 bg-slate-950/45 p-3">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-300">Verification Rate</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-300">100%</p>
          </div>
          <div className="rounded-xl border border-white/15 bg-slate-950/45 p-3">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-300">Coverage</p>
            <p className="mt-1 text-2xl font-semibold text-cyan-200">Freetown + Peninsula</p>
          </div>
        </div>
      </header>

      <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:grid-cols-3 sm:p-4">
        <article className="rounded-xl bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Trust</p>
          <p className="mt-1 text-sm font-medium text-slate-800">Site plan reviewed before publication</p>
        </article>
        <article className="rounded-xl bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Speed</p>
          <p className="mt-1 text-sm font-medium text-slate-800">Fast search optimized for mobile data</p>
        </article>
        <article className="rounded-xl bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Conversion</p>
          <p className="mt-1 text-sm font-medium text-slate-800">Direct WhatsApp handoff to agents</p>
        </article>
      </section>

      <section className="rounded-[1.7rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          <Link
            href="/?type=SALE"
            className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
          >
            Buy Land
          </Link>
          <Link
            href="/?type=RENT"
            className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
          >
            Rent House
          </Link>
          <Link
            href="/?type=DEVELOPMENT"
            className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
          >
            Development
          </Link>
        </div>

        <form className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <input
            name="q"
            defaultValue={params.q}
            placeholder="Search by area or title"
            className="rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-slate-500 focus:bg-white focus:outline-none"
          />
          <select
            name="category"
            defaultValue={params.category ?? ""}
            className="rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-500 focus:bg-white focus:outline-none"
          >
            <option value="">All categories</option>
            <option value="LAND">Land</option>
            <option value="HOUSE">House</option>
            <option value="APARTMENT">Apartment</option>
          </select>
          <select
            name="type"
            defaultValue={params.type ?? ""}
            className="rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-500 focus:bg-white focus:outline-none"
          >
            <option value="">All types</option>
            <option value="SALE">Sale</option>
            <option value="RENT">Rent</option>
            <option value="DEVELOPMENT">Development</option>
          </select>
          <input
            name="minPrice"
            type="number"
            defaultValue={params.minPrice}
            placeholder="Min"
            className="rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-slate-500 focus:bg-white focus:outline-none"
          />
          <input
            name="maxPrice"
            type="number"
            defaultValue={params.maxPrice}
            placeholder="Max"
            className="rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-slate-500 focus:bg-white focus:outline-none"
          />
          <button className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800">
            Find My Future
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Verified Marketplace</p>
            <h2 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">Featured Listings</h2>
          </div>
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold text-slate-900">{discoveryCount}</span> opportunities.
          </p>
        </div>

        {listings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="text-base font-medium text-slate-800">No properties match this filter yet.</p>
            <p className="mt-1 text-sm text-slate-600">Adjust search criteria or clear filters to see live inventory.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
