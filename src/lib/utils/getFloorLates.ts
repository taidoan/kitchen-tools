import type { ServiceSummary } from "@components/feat/Productivity/types";

export const getFloorLates = (serviceSummary: ServiceSummary) => {
  const totalLate = serviceSummary.numberOfLateOrders.total.count ?? 0;
  const kitchenLate = serviceSummary.chef1.ordersLate.count ?? 0;
  const count = Math.max(0, totalLate - kitchenLate);
  const orders = serviceSummary.numberOfOrders || 0;
  const percentage = orders > 0 ? Math.round((count / orders) * 100) : 0;

  return { count, percentage };
};
