import { properties, verificationEvents } from "@/lib/mock-db";

export function VerificationQueue() {
  const pending = properties.filter((property) => property.verificationStatus === "PENDING");

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-slate-800">Approval Queue</h2>
      {pending.length === 0 ? (
        <p className="text-sm text-slate-500">Queue is clear. No pending submissions.</p>
      ) : (
        pending.map((property) => (
          <div key={property.id} className="rounded-lg border border-slate-200 p-4">
            <p className="font-medium text-slate-900">{property.title}</p>
            <p className="text-sm text-slate-500">{property.location}</p>
          </div>
        ))
      )}
      <div className="rounded-lg bg-slate-50 p-4">
        <h3 className="mb-2 font-medium text-slate-800">Verification Audit Log</h3>
        <ul className="space-y-1 text-xs text-slate-600">
          {verificationEvents.length === 0 ? (
            <li>No approvals yet.</li>
          ) : (
            verificationEvents.map((event) => <li key={event}>{event}</li>)
          )}
        </ul>
      </div>
    </section>
  );
}
