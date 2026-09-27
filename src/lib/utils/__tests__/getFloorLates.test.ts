import { describe, it, expect } from "vitest";
import { getFloorLates } from "../getFloorLates";
import { DEFAULT_SERVICE_SUMMARY } from "@config";
import type { ServiceSummary } from "@components/feat/Productivity/types";

const summary = (overrides: Partial<ServiceSummary>): ServiceSummary => ({
  ...JSON.parse(JSON.stringify(DEFAULT_SERVICE_SUMMARY)),
  ...overrides,
});

describe("getFloorLates", () => {
  it("uses counts, not subtracted percentages", () => {
    const result = getFloorLates(
      summary({
        numberOfOrders: 100,
        numberOfLateOrders: {
          ...DEFAULT_SERVICE_SUMMARY.numberOfLateOrders,
          total: { count: 20, percentage: 20 },
        },
        chef1: {
          ...DEFAULT_SERVICE_SUMMARY.chef1,
          numberOfOrders: 40,
          ordersLate: { count: 8, percentage: 20 },
        },
      })
    );

    expect(result).toEqual({ count: 12, percentage: 12 });
  });

  it("does not go below zero", () => {
    const result = getFloorLates(
      summary({
        numberOfOrders: 50,
        numberOfLateOrders: {
          ...DEFAULT_SERVICE_SUMMARY.numberOfLateOrders,
          total: { count: 2, percentage: 4 },
        },
        chef1: {
          ...DEFAULT_SERVICE_SUMMARY.chef1,
          ordersLate: { count: 5, percentage: 10 },
        },
      })
    );

    expect(result.count).toBe(0);
    expect(result.percentage).toBe(0);
  });
});
