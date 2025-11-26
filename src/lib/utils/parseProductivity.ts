import type { ProductivityData } from "@/app/productivity/types";
import { convertToMinutesSeconds, convertToHHMM } from "./timeConverter";

export const parseProductivityData = (data: string): ProductivityData => {
  if (!data || typeof data !== "string") {
    throw new Error("Invalid productivity data format");
  }

  const lines = data
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

  if (lines.length === 0) {
    throw new Error("Productivity data is empty or contains no valid content");
  }

  // Parse range from the first line
  const firstLine = lines.shift()!;
  const periodIndex = firstLine.indexOf(".");
  const range =
    periodIndex !== -1
      ? firstLine.substring(periodIndex + 1).trim()
      : firstLine;

  const productivity: ProductivityData = {
    range,
    staffMembers: [],
  };

  if (lines[0]?.startsWith("Station\tName")) {
    lines.shift();
  }

  for (const line of lines) {
    const parts = line.split("\t").map((v) => v.trim());

    if (parts.length < 8) continue; // Skip incomplete lines

    const [
      station,
      name,
      avgTime,
      noOrders,
      noItems,
      ordersLate,
      longestOrder,
      hoursWorked,
    ] = parts;

    if (!station || !name) continue;

    // Parse numeric values safely
    const totalOrders = parseInt(noOrders, 10) || 0;
    const itemCount = parseInt(noItems, 10) || 0;
    const lateOrdersCount = parseInt(ordersLate, 10) || 0;

    const lateOrdersPercentage =
      totalOrders > 0 ? Math.round((lateOrdersCount / totalOrders) * 100) : 0;

    // Convert times safely
    const prepTime = convertToMinutesSeconds(parseFloat(avgTime)) || "0:00";
    const longestOrderTime =
      convertToMinutesSeconds(parseFloat(longestOrder)) || "0:00";
    const hoursWorkedTime = convertToHHMM(parseFloat(hoursWorked)) || "0:00";

    productivity.staffMembers.push({
      name,
      prepTime,
      orders: totalOrders,
      items: itemCount,
      lateOrders: lateOrdersCount,
      lateOrdersPercentage,
      longestOrder: longestOrderTime,
      hoursWorked: hoursWorkedTime,
    });
  }

  return productivity;
};
