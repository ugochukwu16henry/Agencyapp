import { VerificationQueue } from "@/features/admin/queue";
import { BillingOverview } from "@/features/subscriptions/billing-overview";

export default function AdminDashboardPage() {
  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-3">
      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-1">
        <h1 className="text-2xl font-bold text-slate-900">Admin Control Tower</h1>
        <ul className="space-y-2 text-sm text-slate-600">
          <li>Overview</li>
          <li>Approval Queue</li>
          <li>Land Bank</li>
          <li>Financials</li>
        </ul>
      </section>
      <div className="space-y-6 lg:col-span-2">
        <VerificationQueue />
        <BillingOverview />
      </div>
    </main>
  );
}
