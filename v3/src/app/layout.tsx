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
  title: "Bapita — Digital tools for any business",
  description:
    "A suite of professional digital tools for businesses that want to run better online — without hiring an agency. Booking, social media, SEO, outreach, and AI bots.",
  metadataBase: new URL("https://bapita.com"),
  openGraph: {
    title: "Bapita — Digital tools for any business",
    description:
      "Five tools, one toolkit. Booking, social, SEO, outreach, and AI bots — built and maintained for your business.",
    url: "https://bapita.com",
    siteName: "Bapita",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bapita — Digital tools for any business",
    description:
      "Five tools, one toolkit. Built and maintained for your business.",
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
