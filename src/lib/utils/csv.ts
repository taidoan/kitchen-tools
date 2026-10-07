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

const countUnquoted = (line: string, delimiter: string) => {
  let count = 0;
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (!inQuotes && ch === delimiter) count += 1;
  }

  return count;
};

const detectDelimiter = (text: string) => {
  const lines = text.split("\n").filter((line) => line.trim());
  const header =
    lines.find((line) => /product name/i.test(line)) ?? lines[0] ?? "";
  const tabs = countUnquoted(header, "\t");
  const commas = countUnquoted(header, ",");
  const semis = countUnquoted(header, ";");

  if (tabs > 0 && tabs >= commas && tabs >= semis) return "\t";
  if (semis > commas) return ";";
  return ",";
};

const parseDelimited = (text: string, delimiter: string) => {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"') {
        if (next === '"') {
          cell += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }

    if (ch === delimiter) {
      row.push(cell);
      cell = "";
      continue;
    }

    if (ch === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += ch;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
};

export const decodeSpreadsheetBytes = (buffer: ArrayBuffer | Uint8Array) => {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);

  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) {
    return new TextDecoder("utf-16le").decode(bytes);
  }
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
    return new TextDecoder("utf-16be").decode(bytes);
  }

  const utf8 = new TextDecoder("utf-8").decode(bytes);
  if (utf8.includes("\uFFFD")) {
    return new TextDecoder("windows-1252").decode(bytes);
  }

  return utf8;
};

export const parseSpreadsheetRows = (raw: string) => {
  const text = raw
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  if (!text.trim()) return [];

  return parseDelimited(text, detectDelimiter(text))
    .map((row) => row.map((cell) => cell.replace(/\u00A0/g, " ").trim()))
    .filter((row) => row.some((cell) => cell !== ""));
};

export const toTabSeparatedText = (rows: string[][]) =>
  rows.map((row) => row.join("\t")).join("\n");

export const spreadsheetFileToPasteText = (
  buffer: ArrayBuffer | Uint8Array,
) => {
  const rows = parseSpreadsheetRows(decodeSpreadsheetBytes(buffer));
  if (!rows.length) return "";

  const headerIndex = rows.findIndex((row) =>
    row.some((cell) => cell.toLowerCase().includes("product name")),
  );
  const table = headerIndex >= 0 ? rows.slice(headerIndex) : rows;

  return toTabSeparatedText(table);
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
  const rows = parseSpreadsheetRows(csv).filter((r) => {
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
