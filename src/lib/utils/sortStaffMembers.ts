import type { StaffMember } from "@components/feat/Productivity/types";
import { convertTimeToMinutes } from "./timeConverter";

export type StaffSortField =
  | "name"
  | "prep"
  | "lates"
  | "orders"
  | "items"
  | "longest"
  | "hours";

export type StaffSortDirection = "asc" | "desc";

const compareTime = (a: string, b: string) =>
  convertTimeToMinutes(a) - convertTimeToMinutes(b);

const compare = (
  a: StaffMember,
  b: StaffMember,
  field: StaffSortField
): number => {
  switch (field) {
    case "name":
      return a.name.localeCompare(b.name);
    case "prep":
      return compareTime(a.prepTime, b.prepTime);
    case "lates":
      return a.lateOrdersPercentage - b.lateOrdersPercentage;
    case "orders":
      return a.orders - b.orders;
    case "items":
      return a.items - b.items;
    case "longest":
      return compareTime(a.longestOrder, b.longestOrder);
    case "hours":
      return compareTime(a.hoursWorked, b.hoursWorked);
    default:
      return 0;
  }
};

export const sortStaffMembers = (
  staffMembers: StaffMember[],
  field: StaffSortField,
  direction: StaffSortDirection = "asc"
) => {
  const dir = direction === "asc" ? 1 : -1;
  return [...staffMembers].sort((a, b) => compare(a, b, field) * dir);
};
