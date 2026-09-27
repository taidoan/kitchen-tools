export interface RowObject {
  rows: string[][];
  header?: string;
}

export const convertToObjects = ({ rows }: RowObject) => {
  if (!rows || rows.length < 2) return [];

  const headerIndex = rows.findIndex((r) =>
    r.some((cell) => cell.toLowerCase().includes("product name")),
  );

  if (headerIndex < 0 || headerIndex === rows.length - 1) return [];

  const rawHeaders = rows[headerIndex].map((h) => h.trim());
  const dataRows = rows.slice(headerIndex + 1);

  return dataRows.map((row) => {
    const entries: [string, string][] = [];

    rawHeaders.forEach((header, i) => {
      if (header.toLowerCase() === "product division") return;
      entries.push([header, (row[i] || "").trim()]);
    });

    return Object.fromEntries(entries);
  });
};
