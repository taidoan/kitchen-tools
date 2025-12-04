import { HIDDEN_SALES_COLUMNS } from "@config";
import { getTotals } from "./getTotals";
import { getSalesValues } from "./getSalesValues";
import { getQuantity } from "./getQuantity";
/**
 * Parse a simple CSV string into an array of rows of trimmed cell values.
 *
 * Trims the input, splits into lines on CRLF or LF, splits each line on commas,
 * trims whitespace for each cell, and filters out rows that are entirely empty
 * (every cell is an empty string after trimming).
 *
 * Note: This is a lightweight CSV parser and does NOT support quoted fields,
 * escaped commas, embedded newlines inside quoted fields, or other CSV dialect
 * features. Use a full CSV library for robust parsing.
 *
 * @param csv - The CSV input string to parse.
 * @returns An array of rows where each row is an array of trimmed cell strings.
 *          Returns an empty array for empty or whitespace-only input.
 *
 * @example
 * const rows = csvToRows('a,b,c\n1,2,3\n , , '); // -> [['a','b','c'], ['1','2','3']]
 *
 * @remarks
 * - Lines are split using the regex /\r?\n/.
 * - Cells are split on a literal comma and then trimmed.
 * - Rows that contain only empty strings (after trimming) are removed.
 */

export const csvToRows = (csv: string) => {
  return csv
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(",").map((cell) => cell.trim()))
    .filter((row) => row.some((cell) => cell !== ""));
};

/**
 * Parse and clean CSV text into a filtered 2D array of cell strings.
 *
 * Behavior:
 * - Parses the provided CSV input using csvToRows(csv).
 * - Removes rows that are entirely empty (every cell is blank or whitespace).
 * - Treats the first remaining row as the header row.
 * - Excludes any columns whose header name appears in HIDDEN_SALES_COLUMNS.
 * - Keeps the remaining columns in their original order for every row (including the header).
 * - Replaces missing or undefined cells with the empty string.
 *
 * @param csv - The raw CSV content as a single string.
 * @returns A two-dimensional array of strings (rows × columns) representing the cleaned CSV.
 *          Returns an empty array if the input contains no non-empty rows.
 *
 * @remarks
 * - This function relies on the presence of csvToRows and HIDDEN_SALES_COLUMNS in the same module/scope.
 * - The input string is not mutated; a new array structure is returned.
 *
 * @example
 * // CSV:
 * // "name,age,secret\nAlice,30,abc\n  ,  ,  \nBob,25,def"
 * // HIDDEN_SALES_COLUMNS = ['secret']
 * // => [['name','age'], ['Alice','30'], ['Bob','25']]
 */
export const cleanCSVData = (csv: string) => {
  const rows = csvToRows(csv).filter((r) =>
    r.some((cell) => cell.trim() !== "")
  );
  if (!rows.length) return [];

  const header = rows[0];

  const keepIndexes = header
    .map((name, i) => (HIDDEN_SALES_COLUMNS.includes(name) ? null : i))
    .filter((i) => i !== null) as number[];

  const cleaned = rows.map((row) => keepIndexes.map((i) => row[i] ?? ""));

  return cleaned;
};

export const processCsv = (raw: string, numberOfItems = 5) => {
  const cleanedRows = cleanCSVData(raw);

  const totals = getTotals(cleanedRows);

  const topSales = getSalesValues({
    rows: { rows: cleanedRows },
    numberOfItems: numberOfItems,
  });

  const topQuantity = getQuantity({
    rows: { rows: cleanedRows },
    numberOfItems: numberOfItems,
  });

  return { totals, topSales, topQuantity };
};
