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
    "We build and run your digital tools — booking, social, and more. You use them in one tap. Made for businesses that want to run better online without hiring an agency.",
  metadataBase: new URL("https://bapita.com"),
  openGraph: {
    title: "Bapita — Your business, online. Without the tech.",
    description:
      "We build and run your digital tools — booking, social, and more. You use them in one tap.",
    url: "https://bapita.com",
    siteName: "Bapita",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bapita — Your business, online. Without the tech.",
    description:
      "We build and run your digital tools — booking, social, and more. You use them in one tap.",
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
