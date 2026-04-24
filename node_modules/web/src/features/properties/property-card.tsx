"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import type { Property } from "@/lib/types";

export function PropertyCard({ property }: { property: Property }) {
  const badgeLabel =
    property.trustTier === "MINISTRY_VERIFIED"
      ? "Verified: Site plan seen by our team + Owner ID confirmed"
      : "Agent Listing: Buyer must do independent due diligence";

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl"
    >
      <div className="relative h-64 overflow-hidden">
        <Image
          src={property.imageUrl}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <span className="absolute left-4 top-4 rounded-full border border-amber-200 bg-amber-100 px-2 py-1 text-xs font-bold uppercase tracking-wider text-amber-700">
          {property.trustTier === "MINISTRY_VERIFIED" ? "Ministry Verified" : "Agent Listing"}
        </span>
      </div>
      <div className="space-y-3 p-5">
        <div>
          <h3 className="text-lg font-bold text-slate-800">{property.title}</h3>
          <p className="text-sm text-slate-500">{property.location}</p>
        </div>
        <p className="text-xs text-slate-500">{badgeLabel}</p>
        <div className="flex items-center justify-between">
          <span className="font-mono text-xl font-bold text-emerald-600">
            {property.currency} {property.price.toLocaleString()}
          </span>
          <Link
            href={`/properties/${property.slug}`}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
