/**
 * Parse a date value that may arrive as ISO string, space-separated string,
 * timestamp number, or already a Date object.
 */
export function parseDate(value: string | number | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;

  // Handle space-separated format from older backend responses: "2024-05-23 10:30:00"
  const normalized = typeof value === "string" ? value.replace(" ", "T") : value;
  const d = new Date(normalized);
  return isNaN(d.getTime()) ? null : d;
}

export function formatDate(
  value: string | number | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" }
): string {
  const d = parseDate(value);
  return d ? d.toLocaleString([], options) : "—";
}

export function formatDateTime(value: string | number | Date | null | undefined): string {
  return formatDate(value, { dateStyle: "medium", timeStyle: "short" });
}

export function formatDateShort(value: string | number | Date | null | undefined): string {
  return formatDate(value, { dateStyle: "short", timeStyle: "short" });
}
