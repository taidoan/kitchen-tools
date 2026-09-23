import { describe, it, expect, vi } from "vitest";

vi.mock("./../convertToObject", () => ({
  convertToObjects: vi.fn(),
}));

import { getTotalQuantity, getTotalSales } from "../getTotals";

describe("getTotalQuantity and getTotalSales", () => {
  describe("getTotalQuantity", () => {
    it("returns 0 if rows are empty", () => {
      const result = getTotalQuantity({ rows: { rows: [] } });
      expect(result).toBe(0);
    });

    it("calculates grand total minus sub-cat total for quantity", () => {
      const mockRows = [
        ["Food", "Extras/Options", "Chips", "34"],
        ["Sub-Cat Total", "", "", "201"],
        ["Total", "", "", "1038"],
      ];

      const result = getTotalQuantity({ rows: { rows: mockRows } });

      expect(result).toBe(837);
    });
  });

  describe("getTotalSales", () => {
    it("returns 0 if rows are empty", () => {
      const result = getTotalSales({ rows: { rows: [] } });
      expect(result).toBe(0);
    });

    it("returns the exact grand total for sales without subtracting sub-cats", () => {
      const mockRows = [
        ["Food", "Extras/Options", "Chips", "34", "100.00"],
        ["Sub-Cat Total", "", "", "201", "18.78"],
        ["Total", "", "", "1038", "3383.14"],
      ];

      const result = getTotalSales({ rows: { rows: mockRows } });

      expect(result).toBe(3383.14);
    });
  });
});
