import { getLeadAnalytics, getLeadMetrics } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CrmDashboardPage() {
  const metrics = await getLeadMetrics();
  const analytics = await getLeadAnalytics();

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">CRM & Lead Analytics</h1>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase text-slate-500">Total Leads</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{metrics.totalLeads}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase text-slate-500">WhatsApp Leads</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{metrics.whatsappLeads}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase text-slate-500">Call Leads</p>
          <p className="mt-2 text-2xl font-bold text-amber-600">{metrics.callLeads}</p>
        </article>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Lead Conversion Funnel</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {analytics.byChannel.map((entry) => (
            <li key={entry.channel} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span>{entry.channel}</span>
              <span className="font-semibold">{entry._count.channel}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Top Listings & Partner Performance</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {analytics.byProperty.map((entry) => (
            <li key={entry.propertyId} className="rounded-lg bg-slate-50 px-3 py-2">
              {entry.title} - {entry.count} leads - {entry.partnerEmail}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
