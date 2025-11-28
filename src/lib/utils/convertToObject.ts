export interface RowObject {
  rows: string[][];
}

/**
 * Converts a 2D array of rows into an array of objects using a header row.
 * The header row is identified by searching for a cell containing "Product Name" (case-insensitive).
 * Each subsequent row is mapped to an object where keys are header values and values are the corresponding cell values.
 * If a cell is missing, its value defaults to an empty string.
 * Returns an empty array if there are fewer than 2 rows or if the header row cannot be found.
 *
 * @param rows - An object containing a `rows` property, which is a 2D array of strings representing table data.
 * @returns An array of objects, each representing a row of data mapped to header keys.
 */
export const convertToObjects = ({ rows }: RowObject) => {
  if (!rows || rows.length < 2) return [];

  // Finds the header row from the report by looking for "Product Name"
  const headerIndex = rows.findIndex((r) =>
    r.some((cell) => cell.toLowerCase().includes("product name"))
  );
  if (headerIndex < 0 || headerIndex === rows.length - 1) return [];

  const headers = rows[headerIndex];
  const dataRows = rows.slice(headerIndex + 1);

  return dataRows.map((row) =>
    Object.fromEntries(headers.map((h, i) => [h, row[i] || ""]))
  );
};
