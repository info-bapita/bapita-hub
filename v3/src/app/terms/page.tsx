import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Bapita",
  description: "Terms of Service for Bapita: our agreements with you.",
};

export default function TermsOfService() {
  return (
    <main className="bg-ink min-h-screen">
      <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
        <Link
          href="/"
          className="text-sm text-cream/50 hover:text-cream transition-colors"
        >
          ← Back to bapita.com
        </Link>

        <h1 className="mt-12 text-display-lg font-extrabold tracking-tight text-cream">
          Terms of Service
        </h1>

        <p className="text-[0.95rem] leading-relaxed text-cream/70 mb-4 mt-6">
          Last updated: July 2026
        </p>

        <section>
          <h2 className="mt-10 mb-3 text-xl font-bold text-cream">
            Our services
          </h2>
          <p className="text-[0.95rem] leading-relaxed text-cream/70 mb-4">
            Bapita provides a suite of digital tools for local, appointment-based
            service businesses, including a booking system (Bapita Book), social
            media management (Bapita Social), WhatsApp/Telegram assistants (Bapita
            Bots), and local growth tools (Bapita Reach). These services are
            provided on a subscription basis. Your use of Bapita means you agree
            to these terms.
          </p>
        </section>

        <section>
          <h2 className="mt-10 mb-3 text-xl font-bold text-cream">
            Accounts and access
          </h2>
          <p className="text-[0.95rem] leading-relaxed text-cream/70 mb-4">
            To use Bapita, you need to create an account with your email and
            password. You are responsible for keeping your login credentials
            secure and confidential. Do not share your account with others
            unless you explicitly add them as authorized users. If you suspect
            unauthorized access, notify us immediately at{" "}
            <a href="mailto:hello@bapita.com" className="text-cream hover:underline">
              hello@bapita.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="mt-10 mb-3 text-xl font-bold text-cream">
            Billing and subscriptions
          </h2>
          <p className="text-[0.95rem] leading-relaxed text-cream/70 mb-4">
            Each Bapita product (Book, Social, SEO, etc.) is billed separately on
            a monthly or annual basis, depending on your choice. You&apos;ll be
            charged on the date you sign up, then automatically renewed each
            billing period unless you cancel. We&apos;ll notify you before charging
            your payment method.
          </p>
        </section>

        <section>
          <h2 className="mt-10 mb-3 text-xl font-bold text-cream">
            Cancellation
          </h2>
          <p className="text-[0.95rem] leading-relaxed text-cream/70 mb-4">
            You can cancel any product at any time from your account settings or
            by emailing{" "}
            <a href="mailto:hello@bapita.com" className="text-cream hover:underline">
              hello@bapita.com
            </a>
            . Cancellation takes effect at the end of your current billing
            period. We do not offer refunds for unused days, but you can
            continue using the product until your billing cycle ends. No refunds
            are issued for partial months.
          </p>
        </section>

        <section>
          <h2 className="mt-10 mb-3 text-xl font-bold text-cream">
            Your data ownership
          </h2>
          <p className="text-[0.95rem] leading-relaxed text-cream/70 mb-4">
            You own all data you upload to Bapita, including client information,
            content, schedules, and customer records. When you cancel your
            subscription, we will delete your data after 30 days. If you need
            your data sooner, email us and we&apos;ll export it for you.
          </p>
        </section>

        <section>
          <h2 className="mt-10 mb-3 text-xl font-bold text-cream">
            Acceptable use
          </h2>
          <p className="text-[0.95rem] leading-relaxed text-cream/70 mb-4">
            You agree not to use Bapita to:
          </p>
          <ul className="text-[0.95rem] leading-relaxed text-cream/70 mb-4 list-disc list-inside space-y-2">
            <li>Violate any law, regulation, or third-party rights</li>
            <li>Send spam, abuse, or harass other users or businesses</li>
            <li>Attempt to hack, override, or damage our systems</li>
            <li>Share false or misleading information</li>
            <li>Impersonate another person or business</li>
            <li>Reverse-engineer or scrape our platform</li>
          </ul>
          <p className="text-[0.95rem] leading-relaxed text-cream/70 mb-4">
            Violation of these rules may result in suspension or termination of
            your account without refund.
          </p>
        </section>

        <section>
          <h2 className="mt-10 mb-3 text-xl font-bold text-cream">
            Limitation of liability
          </h2>
          <p className="text-[0.95rem] leading-relaxed text-cream/70 mb-4">
            Bapita is provided &quot;as is.&quot; We make no warranties that our services
            will be error-free, always available, or meet your specific needs.
            To the maximum extent allowed by law, Bapita is not responsible for:
          </p>
          <ul className="text-[0.95rem] leading-relaxed text-cream/70 mb-4 list-disc list-inside space-y-2">
            <li>
              Data loss, corruption, or unauthorized access (except due to our
              negligence)
            </li>
            <li>Lost revenue, profits, or business opportunities</li>
            <li>Service interruptions or downtime</li>
            <li>Third-party content or actions</li>
          </ul>
          <p className="text-[0.95rem] leading-relaxed text-cream/70 mb-4">
            Our total liability to you is limited to the amount you&apos;ve paid us
            in the past 12 months.
          </p>
        </section>

        <section>
          <h2 className="mt-10 mb-3 text-xl font-bold text-cream">
            Indemnity
          </h2>
          <p className="text-[0.95rem] leading-relaxed text-cream/70 mb-4">
            You agree to defend, indemnify, and hold Bapita harmless from any
            claims, damages, or costs (including legal fees) arising from your
            use of Bapita, your data, or your violation of these terms or any
            law.
          </p>
        </section>

        <section>
          <h2 className="mt-10 mb-3 text-xl font-bold text-cream">
            Third-party services
          </h2>
          <p className="text-[0.95rem] leading-relaxed text-cream/70 mb-4">
            Bapita integrates with third-party services (e.g., payment
            processors, email providers). Your use of those services is subject
            to their own terms and privacy policies. We are not responsible for
            their actions or failures.
          </p>
        </section>

        <section>
          <h2 className="mt-10 mb-3 text-xl font-bold text-cream">
            Changes to terms
          </h2>
          <p className="text-[0.95rem] leading-relaxed text-cream/70 mb-4">
            We may update these terms at any time. Material changes will be
            announced via email or a notice on our website. Your continued use
            of Bapita after changes are posted means you accept the updated
            terms. If you do not agree with new terms, you may cancel your
            subscription.
          </p>
        </section>

        <section>
          <h2 className="mt-10 mb-3 text-xl font-bold text-cream">
            Contact us
          </h2>
          <p className="text-[0.95rem] leading-relaxed text-cream/70 mb-4">
            Questions about these terms? Get in touch at{" "}
            <a href="mailto:hello@bapita.com" className="text-cream hover:underline">
              hello@bapita.com
            </a>
            . We&apos;re here to help.
          </p>
        </section>
      </div>
    </main>
  );
}
