import type { ServiceSummary } from "@/app/productivity/types";
import { DEFAULT_SERVICE_SUMMARY } from "@config";
import { describe, it, expect } from "vitest";
import { createKey } from "../createKeys";

const makeEmptySummary = (): ServiceSummary => {
  return JSON.parse(JSON.stringify(DEFAULT_SERVICE_SUMMARY));
};

describe("createKeys", () => {
  it("parses average delivery time correctly", () => {
    const summary = makeEmptySummary();

    createKey({
      serviceSummary: summary,
      lines: ["Average Delivery Time\t1.12\t9.33\t3.19\t9.32"],
    });

    expect(summary.averageDeliveryTime).toEqual({
      starters: "1:12",
      mains: "9:33",
      desserts: "3:19",
      total: "9:32",
    });
  });

  it("parses number of orders", () => {
    const summary = makeEmptySummary();

    createKey({
      serviceSummary: summary,
      lines: ["No. of Orders\t0\t50\t0\t50"],
    });

    expect(summary.numberOfOrders).toBe(50);
  });

  it("parses late orders & calculates percentages", () => {
    const summary = makeEmptySummary();
    summary.numberOfOrders = 100;

    createKey({
      serviceSummary: summary,
      lines: ["No. of Late Orders\t10\t20\t30\t60"],
    });

    expect(summary.numberOfLateOrders).toEqual({
      starters: { count: 10, percentage: 10 },
      mains: { count: 20, percentage: 20 },
      desserts: { count: 30, percentage: 30 },
      total: { count: 60, percentage: 60 },
    });
  });

  it("parses on-time meal checks", () => {
    const summary = makeEmptySummary();

    createKey({
      serviceSummary: summary,
      lines: ["Table/Meal Checks On-Time\t50\t10\t5"],
    });

    expect(summary.checksOnTime).toEqual({
      onTime: 50,
      early: 10,
      late: 5,
    });
  });

  it("parses CHEF1 data", () => {
    const summary = makeEmptySummary();

    createKey({
      serviceSummary: summary,
      lines: ["CHEF1\t9.5\t40\t4\t60\t9\t2\t1"],
    });

    expect(summary.chef1).toEqual({
      averagePrepTime: "9:50",
      numberOfOrders: 40,
      ordersLate: { count: 4, percentage: 10 },
      numberOfItems: 60,
      itemsLate: { count: 9, percentage: 15 },
      ordersBumped: 2,
      manualHolds: 1,
    });
  });

  it("parses DISPENSE data", () => {
    const summary = makeEmptySummary();

    createKey({
      serviceSummary: summary,
      lines: ["DISPENSE\t1.1\t20\t2\t30\t3\t5\t0"],
    });

    expect(summary.dispense).toEqual({
      averagePrepTime: "1:10",
      numberOfOrders: 20,
      ordersLate: { count: 2, percentage: 10 },
      numberOfItems: 30,
      itemsLate: { count: 3, percentage: 10 },
      ordersBumped: 5,
      manualHolds: 0,
    });
  });
});
