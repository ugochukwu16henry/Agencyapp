import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-xl space-y-4 px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Admin Login</h1>
      <p className="text-sm text-slate-600">
        Use Supabase magic-link authentication to access protected admin workflows.
      </p>
      <LoginForm />
    </main>
  );
}
