import { getSubscriptionOverview } from "@/lib/data";

export default async function AgentDashboardPage() {
  const subscriptions = await getSubscriptionOverview();
  const subscription = subscriptions[0];

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">
        Agent Subscription Dashboard
      </h1>
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-600">Provider: {subscription?.provider}</p>
        <p className="text-sm text-slate-600">Status: {subscription?.status}</p>
      </section>
    </main>
  );
}
