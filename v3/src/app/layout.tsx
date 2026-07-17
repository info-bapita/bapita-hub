import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { ScrollProgress } from "@/components/scroll-progress";
import { LenisProvider } from "@/components/lenis-provider";
import "./globals.css";

const heebo = Heebo({
  subsets: ["latin"],
  variable: "--font-heebo",
  display: "swap",
});

const TITLE = "Bapita | Your business, online. Without the tech.";
const DESCRIPTION =
  "Done-for-you digital tools for salons, barbers, clinics & studios: booking, social, WhatsApp bots, and local reach. We set it up under your brand, live in 48 hours; you run it from your phone.";
const OG_DESCRIPTION =
  "Done-for-you digital tools for local service businesses: booking, social, WhatsApp bots & local reach. Live in 48 hours; run it from your phone.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL("https://bapita.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: TITLE,
    description: OG_DESCRIPTION,
    url: "https://bapita.com",
    siteName: "Bapita",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: OG_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Organization entity so Google and AI assistants can answer "what is Bapita".
const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Bapita",
  url: "https://bapita.com",
  description:
    "Bapita builds and runs done-for-you digital tools for local service businesses in Israel: a booking website, owner dashboard, social scheduling, WhatsApp bots, and local reach. Set up under your brand in 48 hours.",
  areaServed: {
    "@type": "Country",
    name: "Israel",
  },
  knowsLanguage: ["en", "he"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={heebo.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }}
        />
        <LenisProvider>
          <ScrollProgress />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
