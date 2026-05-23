/**
 * Parse a date value that may arrive as ISO string, space-separated string,
 * timestamp number, Jackson array, or already a Date object.
 */
export function parseDate(value: any): Date | null {
  if (value == null || value === "") return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;

  // Jackson may serialize LocalDateTime as an array: [2024, 5, 23, 10, 30, 0, 123456789]
  if (Array.isArray(value)) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = value as number[];
    const d = new Date(year, month - 1, day, hour, minute, second);
    return isNaN(d.getTime()) ? null : d;
  }

  if (typeof value === "string") {
    // Replace space separator with T for ISO compatibility: "2024-05-23 10:30:00"
    let normalized = value.replace(" ", "T");
    // Truncate sub-millisecond precision to 3 digits — JS only supports .NNN
    // e.g. "2024-05-23T10:30:00.123456789" → "2024-05-23T10:30:00.123"
    normalized = normalized.replace(/(\.\d{3})\d+/, "$1");
    const d = new Date(normalized);
    return isNaN(d.getTime()) ? null : d;
  }

  const d = new Date(value as number);
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
