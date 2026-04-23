// Shared formatting helpers.
// Extracted during cleanup so screens can share a single source of truth
// for price/date rendering when needed.

/**
 * Formats a numeric price with thousands separators and the Saudi riyal suffix.
 * Example: formatPrice(21700) -> "21,700 ر.س"
 */
export function formatPrice(amount: number, currency: string = "ر.س"): string {
  if (!Number.isFinite(amount)) return `0 ${currency}`;
  return `${amount.toLocaleString("en-US")} ${currency}`;
}

/**
 * Formats an ISO-like date string (e.g. "2026-02-15") into a compact
 * locale-friendly representation.
 *
 * If the input isn't a parseable date, the original string is returned
 * unchanged so existing screens behave identically to the raw string.
 */
export function formatDate(
  input: string | Date,
  locale: string = "ar-SA"
): string {
  const d = input instanceof Date ? input : new Date(input);
  if (isNaN(d.getTime())) {
    return typeof input === "string" ? input : "";
  }
  try {
    return d.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return d.toISOString().slice(0, 10);
  }
}
