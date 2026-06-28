import type { LucideIcon } from "lucide-react";

export type ProductId = "book" | "social" | "seo" | "outreach" | "bots";

export type ProductStatus = "live" | "beta" | "soon";

export interface Product {
  id: ProductId;
  name: string;
  tagline: string;
  description: string;
  status: ProductStatus;
  statusLabel: string;
  href: string;
  pricingNote: string;
  pricingCta: string;
  features: string[];
}

export interface BusinessType {
  id: string;
  label: string;
  example: string;
  products: ProductId[];
}

export const PRODUCTS: Product[] = [
  {
    id: "book",
    name: "Book",
    tagline: "Your own booking site. Clients book 24/7.",
    description:
      "Appointment booking platform — your own site, dashboard, and automations. Clients book 24/7, you see everything in one place.",
    status: "live",
    statusLabel: "Live",
    href: "https://book.bapita.com",
    pricingNote: "From $29/mo",
    pricingCta: "See plans",
    features: [
      "Booking website with your brand",
      "Owner dashboard & analytics",
      "Email & WhatsApp reminders",
      "Online payments",
    ],
  },
  {
    id: "social",
    name: "Social",
    tagline: "Schedule, post, and grow — from one place.",
    description:
      "Social media management for SMBs — schedule posts, generate captions, translate content, manage Instagram & Facebook from one dashboard.",
    status: "soon",
    statusLabel: "Coming soon",
    href: "https://social.bapita.com",
    pricingNote: "From $19/mo",
    pricingCta: "Get notified",
    features: [
      "Post scheduler & content calendar",
      "AI caption generator",
      "Multi-language support",
      "Instagram & Facebook integration",
    ],
  },
  {
    id: "seo",
    name: "SEO",
    tagline: "Rank higher with tools that make SEO simple.",
    description:
      "SEO tools for SMBs — keyword research, clustering, SERP analysis, page improvement, content brief generation. Made for non-experts.",
    status: "soon",
    statusLabel: "Coming soon",
    href: "https://seo.bapita.com",
    pricingNote: "From $19/mo",
    pricingCta: "Get notified",
    features: [
      "Keyword research & clustering",
      "SERP analysis",
      "Page improvement suggestions",
      "Content brief generator",
    ],
  },
  {
    id: "outreach",
    name: "Outreach",
    tagline: "Find leads, build links, grow reach — automatically.",
    description:
      "Link building and outreach automator — find quote opportunities, discover leads, automate follow-ups. Make your backlink profile grow while you work.",
    status: "soon",
    statusLabel: "Coming soon",
    href: "https://outreach.bapita.com",
    pricingNote: "From $29/mo",
    pricingCta: "Get notified",
    features: [
      "Link building automation",
      "Quote opportunity finder",
      "Lead discovery",
      "Automated outreach sequences",
    ],
  },
  {
    id: "bots",
    name: "Bots",
    tagline: "AI chatbots for WhatsApp and Telegram. Never sleep.",
    description:
      "AI chatbots for WhatsApp and Telegram — answer FAQs, qualify leads, book appointments. Plug and play, no coding.",
    status: "soon",
    statusLabel: "Coming soon",
    href: "https://bots.bapita.com",
    pricingNote: "From $19/mo",
    pricingCta: "Get notified",
    features: [
      "WhatsApp chatbot",
      "Telegram chatbot",
      "FAQ automation",
      "Lead qualification & booking",
    ],
  },
];

export const BUSINESS_TYPES: BusinessType[] = [
  { id: "barber", label: "Barber / Salon", example: "Barbershop, hair salon, nail tech", products: ["book", "social"] },
  { id: "shopify", label: "Shopify / E-commerce", example: "Online store, branded goods", products: ["social", "seo", "outreach"] },
  { id: "agency", label: "Marketing Agency", example: "Creative agency, freelance team", products: ["social", "seo", "outreach", "bots"] },
  { id: "clinic", label: "Clinic / Practice", example: "Physio, dentist, wellness", products: ["book", "bots"] },
  { id: "freelancer", label: "Freelancer / Coach", example: "Personal trainer, consultant", products: ["book", "social"] },
  { id: "smb", label: "Any SMB", example: "Pick what you need", products: ["book", "social", "seo", "outreach", "bots"] },
];

export const SERVED_CATEGORIES = [
  "Barbershops",
  "Salons",
  "Nail techs",
  "Clinics",
  "Dog groomers",
  "Physios",
  "Shopify stores",
  "Agencies",
  "Coaches",
  "Freelancers",
  "E-commerce",
  "Local businesses",
];