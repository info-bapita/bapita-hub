export type ProductId = "book" | "social" | "bots" | "reach";

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

// The menu — 4 falafels. Book is the live hero; the rest are honestly tiered.
// Order matters: hero first.
export const PRODUCTS: Product[] = [
  {
    id: "book",
    name: "Book",
    tagline: "Your own booking site. Clients book 24/7.",
    description:
      "Your own branded booking site, owner dashboard, and automations. Clients book around the clock; you see everything in one place — no more back-and-forth on WhatsApp.",
    status: "live",
    statusLabel: "Live",
    href: "https://book.bapita.com",
    pricingNote: "Live now",
    pricingCta: "See Book",
    features: [
      "Booking website with your brand",
      "Owner dashboard & calendar",
      "Email & WhatsApp reminders",
      "Online payments",
    ],
  },
  {
    id: "social",
    name: "Social",
    tagline: "Show up and grow — without the daily grind.",
    description:
      "Social media, handled. Schedule posts, generate captions, and run Instagram & Facebook from one place — plus a unified inbox for DMs and comments, and analytics that show what's working.",
    status: "soon",
    statusLabel: "Coming next",
    href: "#connect",
    pricingNote: "Coming next",
    pricingCta: "Book a free call",
    features: [
      "Post scheduler & content calendar",
      "AI caption generator",
      "Instagram & Facebook posting",
      "Unified inbox + analytics",
    ],
  },
  {
    id: "bots",
    name: "Bots",
    tagline: "Answer and book on WhatsApp, 24/7.",
    description:
      "An AI assistant on WhatsApp and Telegram that answers FAQs, qualifies leads, and books appointments straight into Book. Stop losing clients to whoever replies first.",
    status: "soon",
    statusLabel: "Rolling out",
    href: "#connect",
    pricingNote: "Rolling out",
    pricingCta: "Book a free call",
    features: [
      "WhatsApp & Telegram assistant",
      "Answers FAQs 24/7",
      "Qualifies leads automatically",
      "Books straight into Book",
    ],
  },
  {
    id: "reach",
    name: "Reach",
    tagline: "Get found and promoted locally.",
    description:
      "Show up where nearby clients are looking — Google and Maps — boost your best post, and run a simple local promo. Local growth, done for you.",
    status: "soon",
    statusLabel: "Rolling out",
    href: "#connect",
    pricingNote: "Rolling out",
    pricingCta: "Book a free call",
    features: [
      "Google Business Profile setup",
      "Show up on Google Maps",
      "Boost your best posts",
      "Simple local promotions",
    ],
  },
];

// Local, appointment-based service businesses only (Israel-first ICP).
export const BUSINESS_TYPES: BusinessType[] = [
  { id: "barber", label: "Barber / Salon", example: "Barbershop, hair salon, nail tech", products: ["book", "social", "reach"] },
  { id: "clinic", label: "Clinic / Practice", example: "Physio, dentist, wellness", products: ["book", "bots", "social"] },
  { id: "studio", label: "Studio", example: "Tattoo, massage, beauty", products: ["book", "social", "reach"] },
  { id: "coach", label: "Coach / Freelancer", example: "Personal trainer, consultant", products: ["book", "social", "bots"] },
  { id: "local", label: "Any local business", example: "Pick what you need", products: ["book", "social", "bots", "reach"] },
];

export const SERVED_CATEGORIES = [
  "Barbershops",
  "Hair salons",
  "Nail techs",
  "Beauty clinics",
  "Physios",
  "Dog groomers",
  "Massage studios",
  "Tattoo studios",
  "Coaches",
  "Personal trainers",
];
