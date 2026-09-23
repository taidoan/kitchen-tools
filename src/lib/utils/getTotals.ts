import type { RowObject } from "./convertToObject";

type TotalProps = {
  rows: RowObject;
};

const getValueByLabel = (
  rawRows: any[],
  label: string,
  targetIndex: number,
): number => {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const matchingRow = rawRows.find((row: any[]) => {
    if (!Array.isArray(row)) return false;
    return row.some(
      (cell) => String(cell).trim().toLowerCase() === label.toLowerCase(),
    );
  });

  if (!matchingRow) return 0;

  const filledValues = matchingRow.filter(
    (cell: any) =>
      cell !== null && cell !== undefined && String(cell).trim() !== "",
  );

  const val = filledValues[targetIndex];
  return Number(String(val).replace(/,/g, "")) || 0;
};

export const getTotalQuantity = ({ rows }: TotalProps): number => {
  const rawRows = (rows as any).rows || rows;
  if (!Array.isArray(rawRows)) return 0;

  const targetIndex = 1;
  const grandTotal = getValueByLabel(rawRows, "Total", targetIndex);
  const subCatTotal =
    getValueByLabel(rawRows, "Sub-Cat Total", targetIndex) ||
    getValueByLabel(rawRows, "SubTotal", targetIndex);

  return grandTotal - subCatTotal;
};

export const getTotalSales = ({ rows }: TotalProps): number => {
  const rawRows = (rows as any).rows || rows;
  if (!Array.isArray(rawRows)) return 0;

  const targetIndex = 2;
  return getValueByLabel(rawRows, "Total", targetIndex);
};
