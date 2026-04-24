"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, MessageCircle, ShieldCheck } from "lucide-react";

import type { Property } from "@/lib/types";

const currencyFormatter = new Intl.NumberFormat("en-US");

export function PropertyCard({ property }: { property: Property }) {
  const badgeLabel =
    property.trustTier === "MINISTRY_VERIFIED"
      ? "Verified: Site plan seen by our team + Owner ID confirmed"
      : "Agent Listing: Buyer must do independent due diligence";

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white shadow-sm transition hover:shadow-xl"
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
          <p className="mt-1 inline-flex items-center gap-1 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5" />
            {property.location}
          </p>
        </div>
        <p className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
          <ShieldCheck className="h-3.5 w-3.5" />
          {badgeLabel}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-mono text-xl font-bold text-emerald-600">
            {property.currency} {currencyFormatter.format(property.price)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/properties/${property.slug}`}
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            View Details
          </Link>
          <a
            href={`https://wa.me/${property.whatsappNumber}?text=${encodeURIComponent(`Hello, I am interested in ${property.title}. Can we schedule a visit?`)}`}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-slate-700 transition hover:border-slate-500 hover:bg-slate-50"
            aria-label={`Chat about ${property.title} on WhatsApp`}
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
