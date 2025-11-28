type Mock = ReturnType<typeof vi.fn>;
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./../convertToObject", () => ({
  convertToObjects: vi.fn(),
}));

import { getSalesValues } from "../getSalesValues";
import { convertToObjects } from "../convertToObject";

describe("getSalesValues", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty array if convertToObjects returns empty", () => {
    (convertToObjects as unknown as Mock).mockReturnValue([]);

    const result = getSalesValues({
      rows: { rows: [] },
      numberOfItems: 5,
    });

    expect(result).toEqual([]);
  });

  it("filters out rows where Product Name contains subtotal, no-upsell, or plain (case-insensitive)", () => {
    (convertToObjects as unknown as Mock).mockReturnValue([
      { "Product Name": "Burger", "Value of Sales": "100" },
      { "Product Name": "Subtotal Sales", "Value of Sales": "200" },
      { "Product Name": "Plain Chips", "Value of Sales": "50" },
      { "Product Name": "No-Upsell Item", "Value of Sales": "80" },
    ]);

    const result = getSalesValues({
      rows: { rows: [] },
      numberOfItems: 10,
    });

    expect(result).toEqual([
      { "Product Name": "Burger", "Value of Sales": 100 },
    ]);
  });

  it("sorts rows by Value of Sales (numeric) descending", () => {
    (convertToObjects as unknown as Mock).mockReturnValue([
      { "Product Name": "Burger", "Value of Sales": "100" },
      { "Product Name": "Pizza", "Value of Sales": "250" },
      { "Product Name": "Wrap", "Value of Sales": "150" },
    ]);

    const result = getSalesValues({
      rows: { rows: [] },
      numberOfItems: 5,
    });

    expect(result).toEqual([
      { "Product Name": "Pizza", "Value of Sales": 250 },
      { "Product Name": "Wrap", "Value of Sales": 150 },
      { "Product Name": "Burger", "Value of Sales": 100 },
    ]);
  });

  it("limits the number of returned items based on numberOfItems", () => {
    (convertToObjects as unknown as Mock).mockReturnValue([
      { "Product Name": "Burger", "Value of Sales": "100" },
      { "Product Name": "Pizza", "Value of Sales": "250" },
      { "Product Name": "Wrap", "Value of Sales": "150" },
    ]);

    const result = getSalesValues({
      rows: { rows: [] },
      numberOfItems: 2,
    });

    expect(result).toEqual([
      { "Product Name": "Pizza", "Value of Sales": 250 },
      { "Product Name": "Wrap", "Value of Sales": 150 },
    ]);
  });

  it("handles non-numeric Value of Sales by converting to 0", () => {
    (convertToObjects as unknown as Mock).mockReturnValue([
      { "Product Name": "Burger", "Value of Sales": "not-a-number" },
      { "Product Name": "Pizza", "Value of Sales": "50" },
    ]);

    const result = getSalesValues({
      rows: { rows: [] },
      numberOfItems: 5,
    });

    expect(result).toEqual([
      { "Product Name": "Pizza", "Value of Sales": 50 },
      { "Product Name": "Burger", "Value of Sales": 0 },
    ]);
  });

  it("keeps all original fields besides converting Value of Sales to number", () => {
    (convertToObjects as unknown as Mock).mockReturnValue([
      {
        "Product Name": "Burger",
        "Value of Sales": "100",
        Category: "Food",
        Extra: "Sample",
      },
    ]);

    const result = getSalesValues({
      rows: { rows: [] },
      numberOfItems: 5,
    });

    expect(result).toEqual([
      {
        "Product Name": "Burger",
        "Value of Sales": 100,
        Category: "Food",
        Extra: "Sample",
      },
    ]);
  });
});
