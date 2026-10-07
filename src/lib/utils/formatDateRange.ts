const formatDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatDateRange = (from?: string, to?: string) => {
  const start = from ? formatDate(from) : "";
  const end = to ? formatDate(to) : "";

  if (start && end) return start === end ? start : `${start} – ${end}`;
  if (start) return `From ${start}`;
  if (end) return `To ${end}`;
  return "";
};
