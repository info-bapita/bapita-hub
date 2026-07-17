import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Bapita",
  description: "Privacy Policy for Bapita: how we handle your data.",
};

export default function PrivacyPolicy() {
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
          Privacy Policy
        </h1>

        <p className="text-[0.95rem] leading-relaxed text-cream/70 mb-4 mt-6">
          Last updated: July 2026
        </p>

        <section>
          <h2 className="mt-10 mb-3 text-xl font-bold text-cream">
            Who we are
          </h2>
          <p className="text-[0.95rem] leading-relaxed text-cream/70 mb-4">
            Bapita is a suite of digital tools for small and medium-sized
            businesses in Israel and beyond. We help business owners manage
            bookings, grow on social media, improve search visibility, reach
            customers, and automate common tasks. We&apos;re run by a small team and
            care about keeping your data safe.
          </p>
        </section>

        <section>
          <h2 className="mt-10 mb-3 text-xl font-bold text-cream">
            What data we collect
          </h2>
          <p className="text-[0.95rem] leading-relaxed text-cream/70 mb-4">
            We collect information you give us directly:
          </p>
          <ul className="text-[0.95rem] leading-relaxed text-cream/70 mb-4 list-disc list-inside space-y-2">
            <li>
              <strong>Waitlist & contact forms:</strong> name, email, business
              name, and phone number when you express interest in Bapita.
            </li>
            <li>
              <strong>Bapita Book (booking tool):</strong> business owner
              account details, client names, phone numbers, emails, appointment
              times, and service details needed to manage bookings on your
              behalf.
            </li>
            <li>
              <strong>Product usage:</strong> information about how you use our
              tools (pages visited, features used, actions taken) to help us
              improve and track service performance.
            </li>
            <li>
              <strong>Cookies & tracking:</strong> we use minimal analytics
              cookies to understand how visitors use our site, including through
              tools like Google Analytics.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mt-10 mb-3 text-xl font-bold text-cream">
            How we use your data
          </h2>
          <p className="text-[0.95rem] leading-relaxed text-cream/70 mb-4">
            We use the information we collect to:
          </p>
          <ul className="text-[0.95rem] leading-relaxed text-cream/70 mb-4 list-disc list-inside space-y-2">
            <li>Provide and operate our services (e.g., manage your bookings)</li>
            <li>Respond to inquiries and communicate with you</li>
            <li>Improve and personalize our products</li>
            <li>Send updates about our tools (if you opt in)</li>
            <li>Comply with legal obligations</li>
            <li>Prevent fraud and abuse</li>
          </ul>
        </section>

        <section>
          <h2 className="mt-10 mb-3 text-xl font-bold text-cream">
            Where we store your data
          </h2>
          <p className="text-[0.95rem] leading-relaxed text-cream/70 mb-4">
            We store your data on Supabase, a secure cloud database platform.
            Your data may be processed and stored in data centers outside of
            Israel. We use standard security practices including encryption,
            secure access controls, and regular backups to protect your
            information.
          </p>
        </section>

        <section>
          <h2 className="mt-10 mb-3 text-xl font-bold text-cream">
            Sharing your data
          </h2>
          <p className="text-[0.95rem] leading-relaxed text-cream/70 mb-4">
            We do not sell, rent, or share your personal data with third parties
            for marketing purposes. We may share data only when:
          </p>
          <ul className="text-[0.95rem] leading-relaxed text-cream/70 mb-4 list-disc list-inside space-y-2">
            <li>Required by law or court order</li>
            <li>
              Necessary to protect the security or integrity of our services
            </li>
            <li>
              With service providers who help us operate (like our hosting
              provider), under confidentiality agreements
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mt-10 mb-3 text-xl font-bold text-cream">
            Your rights
          </h2>
          <p className="text-[0.95rem] leading-relaxed text-cream/70 mb-4">
            You have the right to:
          </p>
          <ul className="text-[0.95rem] leading-relaxed text-cream/70 mb-4 list-disc list-inside space-y-2">
            <li>Request a copy of your personal data</li>
            <li>Request that we delete your data (with some exceptions)</li>
            <li>Opt out of marketing communications at any time</li>
            <li>Disable cookies in your browser settings</li>
          </ul>
          <p className="text-[0.95rem] leading-relaxed text-cream/70 mb-4">
            To exercise these rights, email us at{" "}
            <a href="mailto:hello@bapita.com" className="text-cream hover:underline">
              hello@bapita.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="mt-10 mb-3 text-xl font-bold text-cream">
            Changes to this policy
          </h2>
          <p className="text-[0.95rem] leading-relaxed text-cream/70 mb-4">
            We may update this privacy policy from time to time. If we make
            material changes, we&apos;ll notify you by email or a prominent notice
            on our website. Your continued use of our services means you accept
            the updated policy.
          </p>
        </section>

        <section>
          <h2 className="mt-10 mb-3 text-xl font-bold text-cream">
            Questions?
          </h2>
          <p className="text-[0.95rem] leading-relaxed text-cream/70 mb-4">
            If you have any questions about our privacy practices, please
            contact us at{" "}
            <a href="mailto:hello@bapita.com" className="text-cream hover:underline">
              hello@bapita.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
