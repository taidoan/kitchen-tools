import { describe, it, expect } from "vitest";
import { sortStaffMembers } from "../sortStaffMembers";
import type { StaffMember } from "@components/feat/Productivity/types";

const staff = (overrides: Partial<StaffMember>): StaffMember => ({
  name: "A",
  prepTime: "8:00",
  orders: 1,
  items: 1,
  lateOrders: 0,
  lateOrdersPercentage: 0,
  longestOrder: "9:00",
  hoursWorked: "08:00",
  ...overrides,
});

describe("sortStaffMembers", () => {
  it("sorts prep times numerically, not as strings", () => {
    const sorted = sortStaffMembers(
      [staff({ name: "Ten", prepTime: "10:00" }), staff({ name: "Nine", prepTime: "9:00" })],
      "prep",
      "asc"
    );

    expect(sorted.map((member) => member.name)).toEqual(["Nine", "Ten"]);
  });

  it("reverses order when direction is desc", () => {
    const sorted = sortStaffMembers(
      [staff({ name: "Ten", prepTime: "10:00" }), staff({ name: "Nine", prepTime: "9:00" })],
      "prep",
      "desc"
    );

    expect(sorted.map((member) => member.name)).toEqual(["Ten", "Nine"]);
  });
});
