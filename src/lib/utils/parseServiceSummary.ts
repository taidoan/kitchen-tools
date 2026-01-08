import type { ServiceSummary } from "@components/feat/Productivity/types";
import { DEFAULT_SERVICE_SUMMARY } from "@config";
import { createKey } from "./createKeys";

/**
 * Parse a raw service summary string into a structured ServiceSummary object.
 *
 * The function expects `data` to be a non-empty string containing at least one
 * non-blank line. It:
 *  - Splits the input on newline characters and trims each line.
 *  - Uses the first non-empty line as the header which contains the site name
 *    and optional date range separated by the first period (`.`).
 *    - If a period exists, the text before the first period becomes `siteName`
 *      and the text after becomes `dateRange`.
 *    - If no period exists, the entire first line is used as `siteName` and
 *      `dateRange` is set to an empty string.
 *  - Removes Markdown bold markers (`**...**`) from the extracted site name.
 *  - Merges the extracted values with DEFAULT_SERVICE_SUMMARY (deep-cloned via
 *    JSON round-trip) to produce the returned ServiceSummary.
 *  - Any subsequent lines after the first header line are currently ignored.
 *
 * @param data - Raw service summary content to parse.
 * @returns A ServiceSummary derived from DEFAULT_SERVICE_SUMMARY with updated
 *          `siteName` and `dateRange` fields.
 *
 * @throws {Error} If `data` is falsy or not a string.
 * @throws {Error} If the first non-empty line is missing or empty.
 * @throws {Error} If the input contains no valid (non-blank) content.
 */
export const parseServiceSummary = (data: string): ServiceSummary => {
  if (!data || typeof data !== "string") {
    throw new Error("Invalid service summary data format");
  }

  const rawLines = data.split("\n");
  const firstLine = rawLines[0].trim();

  if (!firstLine || firstLine.length === 0) {
    throw new Error("Service summary data is missing the first line");
  }

  const lines = rawLines
    .map((line) => line.trim())
    .filter((line) => line !== "");

  if (lines.length === 0) {
    throw new Error(
      "Service summary data is empty or contains no valid content"
    );
  }

  const firstPeriodIndex = firstLine.indexOf(".");

  let siteName = "";
  let range = "";

  if (firstPeriodIndex !== -1) {
    siteName = firstLine.substring(0, firstPeriodIndex).trim();
    range = firstLine.substring(firstPeriodIndex + 1).trim();
  } else {
    siteName = firstLine.trim();
    range = "";
  }

  const cleanSiteName = siteName.replace(/\*\*(.*?)\*\*/, "$1").trim();
  const site = cleanSiteName || firstLine.trim();

  lines.shift();

  const createSummary = (site: string, range: string): ServiceSummary => ({
    ...JSON.parse(JSON.stringify(DEFAULT_SERVICE_SUMMARY)),
    siteName: site,
    dateRange: range,
  });

  const summary = createSummary(site, range);

  createKey({ serviceSummary: summary, lines });

  return summary;
};
