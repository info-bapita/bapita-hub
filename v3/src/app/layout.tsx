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

export const metadata: Metadata = {
  title: "Bapita — Your business, online. Without the tech.",
  description:
    "Done-for-you digital tools for salons, barbers, clinics & studios — booking, social, WhatsApp bots, and local reach. We set it up under your brand, live in 48 hours; you run it from your phone.",
  metadataBase: new URL("https://bapita.com"),
  openGraph: {
    title: "Bapita — Your business, online. Without the tech.",
    description:
      "Done-for-you digital tools for local service businesses — booking, social, WhatsApp bots & local reach. Live in 48 hours; run it from your phone.",
    url: "https://bapita.com",
    siteName: "Bapita",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bapita — Your business, online. Without the tech.",
    description:
      "Done-for-you digital tools for local service businesses — booking, social, WhatsApp bots & local reach. Live in 48 hours; run it from your phone.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={heebo.variable}>
      <body>
        <LenisProvider>
          <ScrollProgress />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
