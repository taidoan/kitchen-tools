import { PRODUCT_ALIASES } from "@config";

export function normaliseProductName(raw: string): string {
  const cleaned = raw.trim();

  for (const [key, value] of Object.entries(PRODUCT_ALIASES)) {
    if (cleaned.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  return cleaned;
}
