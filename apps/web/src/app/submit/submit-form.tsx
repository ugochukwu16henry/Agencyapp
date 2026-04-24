"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export function SubmitForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    try {
      const title = String(formData.get("title") ?? "");
      const sitePlan = formData.get("sitePlan");
      let sitePlanUrl: string | null = null;

      if (sitePlan instanceof File && sitePlan.size > 0) {
        const uploadData = new FormData();
        uploadData.append("file", sitePlan);
        uploadData.append("folder", "site-plans");

        const uploadResult = await fetch("/api/storage/upload", {
          method: "POST",
          body: uploadData,
        });
        if (!uploadResult.ok) {
          throw new Error("Failed to upload site plan.");
        }
        const uploadPayload = (await uploadResult.json()) as { publicUrl?: string };
        sitePlanUrl = uploadPayload.publicUrl ?? null;
      }

      const payload = {
        title,
        slug: slugify(title),
        description: String(formData.get("description") ?? ""),
        location: String(formData.get("location") ?? ""),
        price: Number(formData.get("price") ?? 0),
        currency: String(formData.get("currency") ?? "SLE"),
        category: String(formData.get("category") ?? "LAND"),
        type: String(formData.get("type") ?? "SALE"),
        whatsappNumber: String(formData.get("whatsappNumber") ?? ""),
        ownerEmail: String(formData.get("ownerEmail") ?? ""),
        ownerName: String(formData.get("ownerName") ?? ""),
        imageUrl: String(formData.get("imageUrl") ?? ""),
        sitePlanUrl,
      };

      const response = await fetch("/api/properties/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Submission failed.");
      }

      router.push("/dashboard/admin");
      router.refresh();
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Unexpected error.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="title" required placeholder="Property title" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <input name="location" required placeholder="Area / location" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <input name="price" type="number" required placeholder="Price" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <input name="currency" defaultValue="SLE" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <input name="whatsappNumber" required placeholder="WhatsApp number (232...)" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <input name="imageUrl" required placeholder="Cover image URL" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <input name="ownerName" required placeholder="Owner name" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <input name="ownerEmail" required placeholder="Owner email" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      </div>

      <textarea name="description" required placeholder="Description" className="min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />

      <div className="grid gap-4 sm:grid-cols-2">
        <select name="category" className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="LAND">Land</option>
          <option value="HOUSE">House</option>
          <option value="APARTMENT">Apartment</option>
        </select>
        <select name="type" className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="SALE">Sale</option>
          <option value="RENT">Rent</option>
          <option value="DEVELOPMENT">Development</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Site plan document</label>
        <input name="sitePlan" type="file" accept=".pdf,.jpg,.jpeg,.png" className="w-full text-sm" />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button type="submit" disabled={loading} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60">
        {loading ? "Submitting..." : "Submit for Verification"}
      </button>
    </form>
  );
}
