import { describe, it, expect } from "vitest";
import { convertToObjects } from "./../convertToObject";

describe("convertToObjects", () => {
  it("returns empty array when rows is undefined or has fewer than 2 rows", () => {
    expect(convertToObjects({ rows: [] })).toEqual([]);
    expect(convertToObjects({ rows: [["Only one row"]] })).toEqual([]);
    // @ts-expect-error – testing invalid input
    expect(convertToObjects({ rows: undefined })).toEqual([]);
  });

  it("returns empty array when header row with 'Product Name' is not found", () => {
    const rows = [
      ["Header1", "Header2"],
      ["Value1", "Value2"],
    ];
    expect(convertToObjects({ rows })).toEqual([]);
  });

  it("returns empty array when header row is the last row", () => {
    const rows = [
      ["Value1", "Value2"],
      ["Product Name", "Price"],
    ];
    expect(convertToObjects({ rows })).toEqual([]);
  });

  it("correctly maps rows to objects when header row exists", () => {
    const rows = [
      ["Random", "Header"],
      ["Product Name", "Price", "Amount"],
      ["Burger", "5.99", "10"],
      ["Pizza", "7.99", "5"],
    ];

    expect(convertToObjects({ rows })).toEqual([
      {
        "Product Name": "Burger",
        Price: "5.99",
        Amount: "10",
      },
      {
        "Product Name": "Pizza",
        Price: "7.99",
        Amount: "5",
      },
    ]);
  });

  it("fills missing row values with empty strings", () => {
    const rows = [
      ["Product Name", "Price", "Amount"],
      ["Burger", "5.99"], // missing "Amount"
    ];

    expect(convertToObjects({ rows })).toEqual([
      {
        "Product Name": "Burger",
        Price: "5.99",
        Amount: "",
      },
    ]);
  });
});
