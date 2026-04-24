"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createSupabaseBrowser } from "@/lib/supabase";

type Props = {
  propertyId: string;
};

const actions = [
  { label: "Approve & Publish", status: "APPROVED", className: "bg-emerald-600 hover:bg-emerald-500" },
  { label: "Reject", status: "REJECTED", className: "bg-rose-600 hover:bg-rose-500" },
  { label: "Need More Info", status: "PENDING", className: "bg-amber-500 hover:bg-amber-400 text-slate-900" },
  { label: "Suspend", status: "SUSPENDED", className: "bg-slate-700 hover:bg-slate-600" },
] as const;

export function VerificationActions({ propertyId }: Props) {
  const router = useRouter();
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
  const supabase = createSupabaseBrowser();

  async function updateStatus(status: string) {
    setLoadingStatus(status);
    const session = await supabase.auth.getSession();
    const accessToken = session.data.session?.access_token;

    const response = await fetch("/api/properties/verify", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        "x-role": "ADMIN",
      },
      body: JSON.stringify({
        propertyId,
        status,
        approvedBy: "admin@agencyapp.sl",
      }),
    });
    setLoadingStatus(null);

    if (response.ok) {
      router.refresh();
    }
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {actions.map((action) => (
        <button
          key={action.status + action.label}
          type="button"
          onClick={() => updateStatus(action.status)}
          disabled={loadingStatus !== null}
          className={`rounded-md px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50 ${action.className}`}
        >
          {loadingStatus === action.status ? "Processing..." : action.label}
        </button>
      ))}
    </div>
  );
}
