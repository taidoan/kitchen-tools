import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./../convertToObject", () => ({
  convertToObjects: vi.fn(),
}));

import { convertToObjects } from "../convertToObject";
import { getTotalQuantity, getTotalSales } from "../getTotals";

type Mock = ReturnType<typeof vi.fn>;

describe("getTotalQuantity and getTotalSales", () => {
  describe("getTotalQuantity", () => {
    it("returns 0 if rows are empty", () => {
      const result = getTotalQuantity({ rows: { rows: [] } });
      expect(result).toBe(0);
    });

    it("calculates grand total minus sub-cat total for quantity", () => {
      // Mocking the raw rows array structure
      const mockRows = [
        ["Food", "Extras/Options", "Chips", "34"], // product row
        ["Sub-Cat Total", "", "", "201"], // sub-cat total row to subtract
        ["Total", "", "", "1038"], // grand total row
      ];

      const result = getTotalQuantity({ rows: { rows: mockRows } });

      // Expected: Grand Total (1038) - Sub-Cat Total (201) = 837
      expect(result).toBe(837);
    });
  });

  describe("getTotalSales", () => {
    it("returns 0 if rows are empty", () => {
      const result = getTotalSales({ rows: { rows: [] } });
      expect(result).toBe(0);
    });

    it("returns the exact grand total for sales without subtracting sub-cats", () => {
      // Index 2 represents sales in this mock layout example
      const mockRows = [
        ["Food", "Extras/Options", "Chips", "34", "100.00"],
        ["Sub-Cat Total", "", "", "201", "18.78"],
        ["Total", "", "", "1038", "3383.14"],
      ];

      const result = getTotalSales({ rows: { rows: mockRows } });

      // Expected: Leaves sales completely untouched, returns 3383.14
      expect(result).toBe(3383.14);
    });
  });
});
