import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./../convertToObject", () => ({
  convertToObjects: vi.fn(),
}));

import { convertToObjects } from "../convertToObject";
import { getQuantity } from "./../getQuantity";

// Helper type for mocking
type Mock = ReturnType<typeof vi.fn>;

describe("getQuantity", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty array if toObjects returns empty", () => {
    (convertToObjects as unknown as Mock).mockReturnValue([]);

    const result = getQuantity({
      rows: { rows: [] },
      numberOfItems: 5,
    });

    expect(result).toEqual([]);
  });

  it("filters out rows with Product Name containing subtotal, no-upsell, or plain", () => {
    (convertToObjects as unknown as Mock).mockReturnValue([
      {
        Category: "Main",
        "Product Name": "Burger",
        "Quantity Sold": "100",
        "Sub Category": "Food",
      },
      {
        Category: "Main",
        "Product Name": "Subtotal Item",
        "Quantity Sold": "200",
        "Sub Category": "Food",
      },
      {
        Category: "Side",
        "Product Name": "Plain Chips",
        "Quantity Sold": "50",
        "Sub Category": "Food",
      },
      {
        Category: "Main",
        "Product Name": "No-Upsell Item",
        "Quantity Sold": "80",
        "Sub Category": "Food",
      },
    ]);

    const result = getQuantity({
      rows: { rows: [] },
      numberOfItems: 10,
    });

    expect(result).toEqual([
      {
        Category: "Main",
        "Product Name": "Burger",
        "Quantity Sold": 100,
        "Sub Category": "Food",
      },
    ]);
  });

  it("filters out rows where Sub Category contains choices/options", () => {
    (convertToObjects as unknown as Mock).mockReturnValue([
      {
        Category: "Burgers",
        "Product Name": "Burger",
        "Quantity Sold": "100",
        "Sub Category": "Food",
      },
    ]);

    const result = getQuantity({
      rows: { rows: [] },
      numberOfItems: 10,
    });

    expect(result).toEqual([
      {
        Category: "Burgers",
        "Product Name": "Burger",
        "Quantity Sold": 100,
        "Sub Category": "Food",
      },
    ]);
  });

  it("sorts by Quantity Sold descending", () => {
    (convertToObjects as unknown as Mock).mockReturnValue([
      {
        Category: "Main",
        "Product Name": "Burger",
        "Quantity Sold": "100",
        "Sub Category": "Food",
      },
      {
        Category: "Main",
        "Product Name": "Pizza",
        "Quantity Sold": "250",
        "Sub Category": "Food",
      },
      {
        Category: "Main",
        "Product Name": "Wrap",
        "Quantity Sold": "150",
        "Sub Category": "Food",
      },
    ]);

    const result = getQuantity({
      rows: { rows: [] },
      numberOfItems: 5,
    });

    expect(result).toEqual([
      {
        Category: "Main",
        "Product Name": "Pizza",
        "Quantity Sold": 250,
        "Sub Category": "Food",
      },
      {
        Category: "Main",
        "Product Name": "Wrap",
        "Quantity Sold": 150,
        "Sub Category": "Food",
      },
      {
        Category: "Main",
        "Product Name": "Burger",
        "Quantity Sold": 100,
        "Sub Category": "Food",
      },
    ]);
  });

  it("limits the number of returned items based on numberOfItems", () => {
    (convertToObjects as unknown as Mock).mockReturnValue([
      {
        Category: "Main",
        "Product Name": "Burger",
        "Quantity Sold": "100",
        "Sub Category": "Food",
      },
      {
        Category: "Main",
        "Product Name": "Pizza",
        "Quantity Sold": "250",
        "Sub Category": "Food",
      },
      {
        Category: "Main",
        "Product Name": "Wrap",
        "Quantity Sold": "150",
        "Sub Category": "Food",
      },
    ]);

    const result = getQuantity({
      rows: { rows: [] },
      numberOfItems: 2,
    });

    expect(result).toEqual([
      {
        Category: "Main",
        "Product Name": "Pizza",
        "Quantity Sold": 250,
        "Sub Category": "Food",
      },
      {
        Category: "Main",
        "Product Name": "Wrap",
        "Quantity Sold": 150,
        "Sub Category": "Food",
      },
    ]);
  });

  it("converts non-numeric Quantity Sold to 0", () => {
    (convertToObjects as unknown as Mock).mockReturnValue([
      {
        Category: "Main",
        "Product Name": "Burger",
        "Quantity Sold": "not-a-number",
        "Sub Category": "Food",
      },
      {
        Category: "Main",
        "Product Name": "Pizza",
        "Quantity Sold": "50",
        "Sub Category": "Food",
      },
    ]);

    const result = getQuantity({
      rows: { rows: [] },
      numberOfItems: 5,
    });

    expect(result).toEqual([
      {
        Category: "Main",
        "Product Name": "Pizza",
        "Quantity Sold": 50,
        "Sub Category": "Food",
      },
      {
        Category: "Main",
        "Product Name": "Burger",
        "Quantity Sold": 0,
        "Sub Category": "Food",
      },
    ]);
  });

  it("keeps all original fields besides converting Quantity Sold to number", () => {
    (convertToObjects as unknown as Mock).mockReturnValue([
      {
        Category: "Main",
        "Product Name": "Burger",
        "Quantity Sold": "100",
        "Sub Category": "Food",
        Extra: "Sample",
      },
    ]);

    const result = getQuantity({
      rows: { rows: [] },
      numberOfItems: 5,
    });

    expect(result).toEqual([
      {
        Category: "Main",
        "Product Name": "Burger",
        "Quantity Sold": 100,
        "Sub Category": "Food",
        Extra: "Sample",
      },
    ]);
  });
});
