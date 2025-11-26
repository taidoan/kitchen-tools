import { describe, it, expect } from "vitest";
import { parseProductivityData } from "../parseProductivity";
import type { ProductivityData } from "@/app/productivity/types";

describe("parseProductivityData", () => {
  it("parses a valid productivity string", () => {
    const rawData = `
    2025-01-01 to 2025-01-07
    Station\tName\tAvgTime\tNoOrders\tNoItems\tOrdersLate\tLongestOrder\tHoursWorked
    Kitchen\tAlice\t8.42\t40\t60\t4\t12.50\t8
    Front\tBob\t11.23\t30\t45\t3\t26.12\t7
    `;

    const result: ProductivityData = parseProductivityData(rawData);

    expect(result.range).toBe("2025-01-01 to 2025-01-07");
    expect(result.staffMembers.length).toBe(2);

    const alice = result.staffMembers[0];
    expect(alice.name).toBe("Alice");
    expect(alice.orders).toBe(40);
    expect(alice.items).toBe(60);
    expect(alice.lateOrders).toBe(4);
    expect(alice.lateOrdersPercentage).toBe(10);
    expect(alice.prepTime).toBe("8:42");
    expect(alice.longestOrder).toBe("12:50");
    expect(alice.hoursWorked).toBe("08:00");

    const bob = result.staffMembers[1];
    expect(bob.name).toBe("Bob");
    expect(bob.orders).toBe(30);
    expect(bob.items).toBe(45);
    expect(bob.lateOrders).toBe(3);
    expect(bob.lateOrdersPercentage).toBe(10);
    expect(bob.prepTime).toBe("11:23");
    expect(bob.longestOrder).toBe("26:12");
    expect(bob.hoursWorked).toBe("07:00");
  });

  it("skips incomplete or invalid lines", () => {
    const rawData = `
2025-01-01 to 2025-01-07
Station\tName\tAvgTime\tNoOrders\tNoItems\tOrdersLate\tLongestOrder\tHoursWorked
Kitchen\tAlice\t12\t40\t60\t4\t20\t8
InvalidLineWithoutEnoughColumns
\t\t\t\t\t\t\t
`;

    const result = parseProductivityData(rawData);

    expect(result.staffMembers.length).toBe(1);
    expect(result.staffMembers[0].name).toBe("Alice");
  });

  it("handles zero orders gracefully", () => {
    const rawData = `
2025-01-01 to 2025-01-07
Station\tName\tAvgTime\tNoOrders\tNoItems\tOrdersLate\tLongestOrder\tHoursWorked
Kitchen\tAlice\t12\t0\t0\t0\t20\t8
`;

    const result = parseProductivityData(rawData);
    expect(result.staffMembers[0].lateOrdersPercentage).toBe(0);
  });

  it("throws an error for empty input", () => {
    expect(() => parseProductivityData("")).toThrow(
      "Invalid productivity data format"
    );
  });

  it("throws an error for whitespace-only input", () => {
    expect(() => parseProductivityData("\n \t")).toThrow(
      "Productivity data is empty or contains no valid content"
    );
  });
});
