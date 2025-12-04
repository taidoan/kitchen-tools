import { describe, it, expect } from "vitest";
import { csvToRows } from "./../csv";

describe("csvToRows", () => {
  it("returns empty array for empty or whitespace-only input", () => {
    expect(csvToRows("")).toEqual([]);
    expect(csvToRows("   \n  \r\n ")).toEqual([]);
  });

  it("parses basic CSV into rows and cells", () => {
    const input = "a,b,c\n1,2,3";
    expect(csvToRows(input)).toEqual([
      ["a", "b", "c"],
      ["1", "2", "3"],
    ]);
  });

  it("trims whitespace around cells and lines", () => {
    const input = " a , b , c \n  1 , 2 , 3  ";
    expect(csvToRows(input)).toEqual([
      ["a", "b", "c"],
      ["1", "2", "3"],
    ]);
  });

  it("supports CRLF (\\r\\n) as a line separator", () => {
    const input = "a,b\r\n1,2";
    expect(csvToRows(input)).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });

  it("filters out rows that are entirely empty after trimming", () => {
    const input = " , , \n1,2,3\n\n , ";
    expect(csvToRows(input)).toEqual([["1", "2", "3"]]);
  });

  it("preserves empty cells within a non-empty row", () => {
    const input = "a,,c\n,only";
    expect(csvToRows(input)).toEqual([
      ["a", "", "c"],
      ["", "only"],
    ]);
  });

  it("does not handle quoted fields specially (splits on literal commas)", () => {
    const input = '"a,b",c';
    expect(csvToRows(input)).toEqual([['"a', 'b"', "c"]]);
  });

  it("keeps trailing empty cell if present", () => {
    const input = "a,b,";
    expect(csvToRows(input)).toEqual([["a", "b", ""]]);
  });
});
