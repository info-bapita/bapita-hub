"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotifyForm({ productName, productId }: { productName: string; productId: string }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || pending) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, product: productId }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setPending(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-2 rounded-field bg-success/15 px-4 py-2.5 text-sm font-semibold text-success">
        <Check className="h-4 w-4" />
        You&apos;re on the list!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1.5">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={`Get notified about ${productName}`}
          required
          aria-label={`Email for ${productName} notifications`}
          className="min-w-0 flex-1 rounded-field border border-cream/15 bg-cream/[0.04] px-3.5 py-2 text-sm text-cream placeholder:text-cream/35 focus:border-cream/35 focus:outline-none"
        />
        <Button type="submit" size="sm" variant="outline" disabled={pending}>
          {pending ? "…" : "Notify me"}
        </Button>
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </form>
  );
}
