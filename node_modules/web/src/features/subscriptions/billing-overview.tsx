import { getSubscriptionOverview } from "@/lib/data";

const renewalDateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});

export async function BillingOverview() {
  const subscriptions = await getSubscriptionOverview();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold text-slate-800">Agent Billing</h2>
      <div className="space-y-3">
        {subscriptions.map((subscription) => (
          <article key={subscription.id} className="rounded-lg border border-slate-200 p-3">
            <p className="text-sm font-medium text-slate-900">
              Agent: {subscription.agentUserId}
            </p>
            <p className="text-xs text-slate-600">Email: {subscription.agentEmail}</p>
            <p className="text-xs text-slate-600">Provider: {subscription.provider}</p>
            <p className="text-xs text-slate-600">Status: {subscription.status}</p>
            <p className="text-xs text-slate-600">Renews: {renewalDateFormatter.format(new Date(subscription.renewalDate))}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
