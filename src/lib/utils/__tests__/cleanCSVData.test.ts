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
  it("removes columns listed in HIDDEN_SALES_COLUMNS", () => {
    const csv = `
  Product Name,Category,Sub Category,Quantity Sold,Value of Sales
  Burger,Food,Main,10,100
  Fries,Food,Side,5,50
  `;

    const cleaned = cleanCSVData(csv);

    // Check header
    const header = cleaned[0];
    HIDDEN_SALES_COLUMNS.forEach((col) => {
      expect(header).not.toContain(col);
    });

    // Ensure data columns remain
    expect(header).toContain("Product Name");
    expect(header).toContain("Quantity Sold");
    expect(header).toContain("Value of Sales");

    // Check first data row values remain intact
    expect(cleaned[1]).toEqual(["Burger", "10", "100"]);
    expect(cleaned[2]).toEqual(["Fries", "5", "50"]);
  });

  it("handles empty CSV gracefully", () => {
    const cleaned = cleanCSVData("");
    expect(cleaned).toEqual([]); // update expectation
  });
});
