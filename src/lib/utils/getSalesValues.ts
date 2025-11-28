import type { RowObject } from "./convertToObject";
import { convertToObjects } from "./convertToObject";

type SalesValuesProps = {
  rows: RowObject;
  numberOfItems: number;
};

/**
 * Returns the top sales values from a list of sales data rows.
 *
 * This function converts the input rows to objects, filters out rows where the "Product Name"
 * contains "subtotal", "no-upsell", or "plain" (case-insensitive), and sorts the remaining rows
 * by the "Value of Sales" column in descending order. It then returns the top `numberOfItems` rows.
 *
 * @param rows - The sales data rows to process.
 * @param numberOfItems - The number of top items to return. Defaults to 5.
 * @returns An array of objects representing the top sales values.
 */
export const getSalesValues = ({
  rows,
  numberOfItems = 5,
}: SalesValuesProps) => {
  const objects = convertToObjects(rows);
  if (!objects.length) return [];

  // Find the column for "Value of Sales"
  const col = "Value of Sales";
  return [...objects]
    .map(
      (r) =>
        ({
          ...r,
          [col]: Number(r[col]) || 0,
          /* eslint-disable  @typescript-eslint/no-explicit-any */
        } as Record<string, any>)
    )
    .filter(
      (r) =>
        r["Product Name"] &&
        !r["Product Name"].toLowerCase().includes("subtotal") &&
        !r["Product Name"].toLowerCase().includes("no-upsell") &&
        !r["Product Name"].toLowerCase().includes("plain")
    )
    .sort((a, b) => b[col] - a[col])
    .slice(0, numberOfItems);
};
