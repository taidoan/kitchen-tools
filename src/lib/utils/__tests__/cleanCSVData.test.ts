import { describe, it, expect, vi } from "vitest";
import { HIDDEN_SALES_COLUMNS } from "@config";
import { cleanCSVData } from "./../csv";

vi.mock("./../csvToRows", () => ({
  csvToRows: (csv: string) => {
    return csv
      .trim()
      .split("\n")
      .map((line) => line.split(",").map((cell) => cell.trim())); // trim each cell
  },
}));

describe("cleanCSVData", () => {
  it("removes columns listed in HIDDEN_SALES_COLUMNS and keeps main data", () => {
    const csv = `Product Division\tCategory\tSub Category\tDestination\tProduct Name\tPortion\tQuantity Sold\tValue of Sales\tNet Value of Sales\t% of Total Sales\t% of Division\t% of Category\t% of Sub-Cat\tGross Sales\tDiscount\tPromotion\tTax
Food\tBreakfasts\tBreakfast\tStandard\t1 Slice Toast\tStandard\t10\t100\t90\t0.07\t0.07\t0.29\t0.29\t100\t0\t0\t0.41
Food\tBreakfasts\tBreakfast\tStandard\tAdd 1 Black Pud\tStandard\t5\t50\t45\t0.03\t0.03\t0.14\t0.14\t50\t0\t0\t0.2
Food\tBreakfasts\tBreakfast\tStandard\tAdd 1 Hash Brown\tStandard\t4\t40\t36\t0.02\t0.02\t0.12\t0.12\t40\t0\t0\t0.15`;

    const cleaned = cleanCSVData(csv);

    // Check header still has main columns
    const header = cleaned[0];
    HIDDEN_SALES_COLUMNS.forEach((col) => {
      expect(header).not.toContain(col);
    });
    expect(header).toContain("Product Name");
    expect(header).toContain("Category");
    expect(header).toContain("Quantity Sold");
    expect(header).toContain("Value of Sales");

    // Only check the relevant columns in data rows
    const dataRows = cleaned.slice(1).map((row) => ({
      product: row[header.indexOf("Product Name")],
      category: row[header.indexOf("Category")],
      quantity: row[header.indexOf("Quantity Sold")],
      value: row[header.indexOf("Value of Sales")],
    }));

    expect(dataRows[0]).toEqual({
      product: "1 Slice Toast",
      category: "Breakfasts",
      quantity: "10",
      value: "100",
    });
    expect(dataRows[1]).toEqual({
      product: "Add 1 Black Pud",
      category: "Breakfasts",
      quantity: "5",
      value: "50",
    });
    expect(dataRows[2]).toEqual({
      product: "Add 1 Hash Brown",
      category: "Breakfasts",
      quantity: "4",
      value: "40",
    });
  });

  it("handles empty CSV gracefully", () => {
    const cleaned = cleanCSVData("");
    expect(cleaned).toEqual([]);
  });
});
