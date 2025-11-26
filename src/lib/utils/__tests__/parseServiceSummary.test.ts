import { describe, it, expect } from "vitest";
import { parseServiceSummary } from "../parseServiceSummary";

describe("parseServiceSummary", () => {
  it("should parse valid service summary data", () => {
    const data = `**Wetherspoons**. January 1 - January 31
    Some additional lines
    More details here`;

    const result = parseServiceSummary(data);

    expect(result.siteName).toBe("Wetherspoons");
    expect(result.dateRange).toBe("January 1 - January 31");
  });

  it("should handle missing period in the first line", () => {
    const data = `**Wetherspoons**
    Some additional lines`;

    const result = parseServiceSummary(data);

    expect(result.siteName).toBe("Wetherspoons");
    expect(result.dateRange).toBe("");
  });

  it("should throw an error for empty data", () => {
    expect(() => parseServiceSummary("")).toThrow(
      "Invalid service summary data format"
    );
  });

  it("should throw an error for non-string data", () => {
    expect(() => parseServiceSummary(null as unknown as string)).toThrow(
      "Invalid service summary data format"
    );
  });

  it("should throw an error for missing first line", () => {
    const data = `
    
    Some additional lines`;

    expect(() => parseServiceSummary(data)).toThrow(
      "Service summary data is missing the first line"
    );
  });
});
