import { describe, it, expect } from "vitest";
import { processCsv } from "../csv";

describe("processCsv", () => {
  const rawCsv = `Product Name,Value of Sales,Quantity Sold,Product Division,Sub Category
    Burger,100,10,Food,Mains
    Fries,50,5,Food,Sides
    Soda,30,8,Drinks,Beverages`;

  it("processes CSV and returns totals, top sales, and top quantity", () => {
    const result = processCsv(rawCsv);

    expect(result.totals.totalSales).toBeGreaterThan(0);
    expect(result.totals.totalQuantity).toBeGreaterThan(0);

    expect(result.topSales.length).toBeGreaterThan(0);
    expect(result.topQuantity.length).toBeGreaterThan(0);
  });

  it("returns empty results for empty CSV", () => {
    const result = processCsv("");

    expect(result.totals).toEqual({ totalSales: 0, totalQuantity: 0 });
    expect(result.topSales).toEqual([]);
    expect(result.topQuantity).toEqual([]);
  });

  it("removes columns listed in HIDDEN_SALES_COLUMNS", () => {
    const rawCsv = `Product Name,Value of Sales,Quantity Sold,Product Division,Category
  Burger,100,10,Food,Fast Food
  Fries,50,5,Food,Fast Food`;

    const result = processCsv(rawCsv);

    // None of the topSales/topQuantity objects should have 'Product Division' or 'Category'
    result.topSales.forEach((item) => {
      expect(item).not.toHaveProperty("Product Division");
      expect(item).not.toHaveProperty("Category");
    });
  });

  it("ignores subtotal, no-upsell, and plain items", () => {
    const rawCsv = `Product Name,Value of Sales,Quantity Sold
  Burger,100,10
  Subtotal,150,15
  No-Upsell Fries,50,5
  Plain Soda,30,8`;

    const result = processCsv(rawCsv);

    expect(result.topSales.map((r) => r["Product Name"])).toEqual(["Burger"]);
    expect(result.topQuantity.map((r) => r["Product Name"])).toEqual([
      "Burger",
    ]);
  });

  it("returns top 5 sales and quantity by default", () => {
    const rawCsv = `Product Name,Value of Sales,Quantity Sold
  A,100,10
  B,90,9
  C,80,8
  D,70,7
  E,60,6
  F,50,5`;

    const result = processCsv(rawCsv);

    expect(result.topSales.length).toBe(5);
    expect(result.topQuantity.length).toBe(5);
  });

  it("returns specified number of top items", () => {
    const rawCsv = `Product Name,Value of Sales,Quantity Sold
  A,100,10
  B,90,9
  C,80,8
  D,70,7
  E,60,6
  F,50,5`;

    const result = processCsv(rawCsv, 3);

    expect(result.topSales.length).toBe(3);
    expect(result.topQuantity.length).toBe(3);
  });
});
