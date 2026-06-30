import {
  CalendarCheck,
  Share2,
  SearchCheck,
  Mail,
  Bot,
  Megaphone,
} from "lucide-react";
import type { ProductId } from "@/lib/products";
import type { LucideIcon } from "lucide-react";

export const PRODUCT_ICONS: Record<ProductId, LucideIcon> = {
  book: CalendarCheck,
  social: Share2,
  seo: SearchCheck,
  outreach: Mail,
  bots: Bot,
  ads: Megaphone,
};
