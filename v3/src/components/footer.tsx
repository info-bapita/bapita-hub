import { BrandMark } from "@/components/ui/brand-mark";
import { PRODUCTS } from "@/lib/products";
import { accentStyle } from "@/lib/accent";

const FOOTER_LINKS = [
  { label: "What we offer", href: "#products" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
  { label: "Book a free call", href: "#connect" },
  { label: "Contact", href: "mailto:hello@bapita.com" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="about" className="border-t border-cream/[0.08] bg-ink-800">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <BrandMark className="text-cream opacity-90" />
            <p className="mt-4 max-w-[280px] text-[0.875rem] leading-relaxed text-cream/55">
              Done-for-you digital tools for local service businesses: booking, social, WhatsApp bots &amp; local reach. Live in 48 hours.
            </p>
            <a
              href="mailto:hello@bapita.com"
              className="mt-4 inline-block text-sm font-medium text-cream/50 underline underline-offset-2 hover:text-cream/80 transition-colors"
            >
              hello@bapita.com
            </a>
          </div>

          {/* Products */}
          <div>
            <p className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-cream/50">
              Products
            </p>
            <ul className="flex flex-col gap-2.5">
              {PRODUCTS.map((product) => (
                <li key={product.id}>
                  <a
                    href="#products"
                    style={accentStyle(product.id)}
                    className="accent-text flex items-center gap-2 text-[0.875rem] font-medium opacity-70 transition-opacity hover:opacity-100"
                  >
                    <span
                      style={{ background: "var(--accent)" }}
                      className="h-1.5 w-1.5 rounded-full"
                    />
                    Bapita {product.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <p className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-cream/50">
              Company
            </p>
            <ul className="flex flex-col gap-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[0.875rem] font-medium text-cream/50 transition-colors hover:text-cream/80"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-cream/[0.08] pt-8">
          <p className="text-xs text-cream/50">
            © {year} Bapita. All rights reserved.
          </p>
          <div className="flex gap-5">
            <a href="/privacy" className="text-xs text-cream/50 hover:text-cream/80 transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-xs text-cream/50 hover:text-cream/80 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
