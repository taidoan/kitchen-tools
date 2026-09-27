import { HIDDEN_SALES_COLUMNS, SALES_SUMMARY_LABELS } from "@config";
import { getSalesValues } from "./getSalesValues";
import { getQuantity } from "./getQuantity";
import { getTotalQuantity, getTotalSales } from "./getTotals";
import { groupItemsByCategory, type ProductItem } from "./groupCategory";
import { convertToObjects } from "./convertToObject";
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
  if (!csv.trim()) return [];

  return csv
    .split(/\r?\n/)
    .map((line) => line.split(",").map((cell) => (cell ?? "").trim()))
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
type CleanCSVOptions = {
  keepColumns?: string[];
};

export const cleanCSVData = (csv: string, options?: CleanCSVOptions) => {
  const rows = csv
    .split("\n")
    .map((r) => r.split("\t").map((c) => c.replace(/\u00A0/g, " ").trim()))
    .filter((r) => r.some((cell) => cell !== ""))
    .filter((r) => {
      if (!r[0]) return true;
      const label = r[0].replace(/\s+/g, "").toLowerCase();

      if (label === "total") {
        return true;
      }

      return !SALES_SUMMARY_LABELS.includes(r[0].replace(/\s+/g, ""));
    });

  if (!rows.length) return [];

  const header = rows[0];
  const keepColumns = options?.keepColumns ?? [];

  const keepIndexes = header
    .map((name, i) => {
      if (keepColumns.includes(name)) return i;
      return HIDDEN_SALES_COLUMNS.includes(name) ? null : i;
    })
    .filter((i) => i !== null) as number[];

  const cleaned = rows.map((row) => keepIndexes.map((i) => row[i] ?? ""));

  return cleaned;
};

export const processCsv = (raw: string, numberOfItems = 5) => {
  const cleanedRows = cleanCSVData(raw);
  const topSales = getSalesValues({
    rows: { rows: cleanedRows },
    numberOfItems: numberOfItems,
  });

  const topQuantity = getQuantity({
    rows: { rows: cleanedRows },
    numberOfItems: numberOfItems,
  });

  const totalQuantity = getTotalQuantity({ rows: { rows: cleanedRows } });
  const totalSales = getTotalSales({ rows: { rows: cleanedRows } });

  return { topSales, topQuantity, totalQuantity, totalSales };
};

const parseNumber = (value: unknown) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  return Number(String(value ?? "").replace(/,/g, "").trim()) || 0;
};

const isSummaryLabel = (value: string) => {
  const normalised = value.replace(/\s+/g, "").toLowerCase();
  return SALES_SUMMARY_LABELS.some(
    (label) => label.replace(/\s+/g, "").toLowerCase() === normalised,
  );
};

const toProductItem = (raw: Record<string, unknown>): ProductItem | null => {
  const productName = String(raw["Product Name"] ?? "").trim();
  const category = String(raw.Category ?? "").trim();

  if (!productName || !category) return null;
  if (isSummaryLabel(productName) || isSummaryLabel(category)) return null;

  return {
    Category: category,
    "Sub Category": String(raw["Sub Category"] ?? "").trim(),
    "Product Name": productName,
    "Quantity Sold": parseNumber(raw["Quantity Sold"]),
    "Value of Sales": parseNumber(raw["Value of Sales"]),
    "Gross Sales": parseNumber(raw["Gross Sales"]),
    Discount: parseNumber(raw.Discount),
    Promotion: parseNumber(raw.Promotion),
    Tax: parseNumber(raw.Tax),
  };
};

export const processProductSalesCSV = (raw: string) => {
  const cleanedRows = cleanCSVData(raw, { keepColumns: ["Sub Category"] });
  const items = convertToObjects({ rows: cleanedRows })
    .map(toProductItem)
    .filter((item): item is ProductItem => item !== null);
  const categories = groupItemsByCategory(items);

  return { items, categories };
};
