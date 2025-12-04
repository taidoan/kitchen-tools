import { convertToObjects } from "./convertToObject";

export const getTotals = (rows: string[][]) => {
  const objs = convertToObjects({ rows });
  if (!rows || !rows.length) {
    return { totalSales: 0, totalQuantity: 0 };
  }

  const output = {
    totalSales: 0,
    totalQuantity: 0,
    itemCount: objs.length,
  };

  for (const r of objs) {
    const sales = Number(r["Value of Sales"]) || 0;
    const quantity = Number(r["Quantity Sold"]) || 0;
    output.totalSales += sales;
    output.totalQuantity += quantity;
  }

  return output;
};
