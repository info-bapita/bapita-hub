import { BrandMark } from "@/components/ui/brand-mark";
import { PRODUCTS } from "@/lib/products";
import { FALAFEL_COLORS } from "@/components/ui/pita";

const FOOTER_LINKS = [
  { label: "Products", href: "#products" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Book a free call", href: "#connect" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="about" style={{ background: "#231710" }}>
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr]">
          <div>
            <BrandMark className="text-clay opacity-90" />
            <p className="mt-4 max-w-[280px] text-[0.875rem] leading-relaxed text-clay/45">
              Done-for-you booking, social, WhatsApp bots and local reach for salons,
              barbers, clinics and studios. Set up and kept running under your brand.
            </p>
            <a
              href="mailto:hello@bapita.com"
              className="mt-4 inline-block text-sm font-medium text-clay/45 underline underline-offset-4 transition-colors hover:text-clay/80"
            >
              hello@bapita.com
            </a>
          </div>

          <div>
            <p className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-clay/40">
              Products
            </p>
            <ul className="flex flex-col gap-2.5">
              {PRODUCTS.map((product) => (
                <li key={product.id}>
                  <a
                    href="#products"
                    className="flex items-center gap-2.5 text-[0.875rem] font-medium text-clay/55 transition-colors hover:text-clay"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: FALAFEL_COLORS[product.id].base }}
                    />
                    Bapita {product.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-clay/40">
              Company
            </p>
            <ul className="flex flex-col gap-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[0.875rem] font-medium text-clay/45 transition-colors hover:text-clay/80"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-clay/[0.08] pt-8">
          <p className="text-xs text-clay/40">© {year} Bapita. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="/privacy" className="text-xs text-clay/40 transition-colors hover:text-clay/70">
              Privacy Policy
            </a>
            <a href="/terms" className="text-xs text-clay/40 transition-colors hover:text-clay/70">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
