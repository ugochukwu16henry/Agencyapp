import { SubmitForm } from "./submit-form";

export default function SubmitPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Partner Mobile Intake</h1>
      <p className="text-sm text-slate-600">
        Submit listings with a site plan and owner details. New records are created
        as <strong>PENDING</strong> and routed to the admin verification queue.
      </p>
      <SubmitForm />
    </main>
  );
}
