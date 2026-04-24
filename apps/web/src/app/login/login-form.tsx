"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowser } from "@/lib/supabase";

export function LoginForm() {
  const [email, setEmail] = useState("admin@agencyapp.sl");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createSupabaseBrowser();

  async function handleMagicLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard/admin`,
      },
    });
    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }
    setMessage("Magic link sent. Check your email and open the link.");
  }

  return (
    <form onSubmit={handleMagicLink} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <Input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="admin@agencyapp.sl"
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send Magic Link"}
      </Button>
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
    </form>
  );
}
