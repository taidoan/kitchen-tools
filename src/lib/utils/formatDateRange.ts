export type DateRangeParts = {
  from: string;
  to: string;
  isSingleDay: boolean;
};

const formatDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

export const getDateRangeParts = (
  from?: string,
  to?: string,
): DateRangeParts | null => {
  const start = from ? formatDate(from) : "";
  const end = to ? formatDate(to) : "";

  if (!start && !end) return null;
  if (start && end) {
    return { from: start, to: end, isSingleDay: start === end };
  }

  const only = start || end;
  return { from: only, to: only, isSingleDay: true };
};

export const formatDateRange = (from?: string, to?: string) => {
  const range = getDateRangeParts(from, to);
  if (!range) return "";
  if (range.isSingleDay) return range.from;
  return `${range.from} – ${range.to}`;
};
