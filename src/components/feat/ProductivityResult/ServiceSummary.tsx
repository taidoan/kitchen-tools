import type { ProductivityResult } from "@/app/productivity/types";

type ServiceSummaryComponentProps = Pick<
  ProductivityResult,
  | "serviceSummary"
  | "floorLates"
  | "kitLates"
  | "prepTarget"
  | "foodLift"
  | "lateTarget"
  | "manualHolds"
>;

export const ServiceSummaryComponent = ({
  serviceSummary,
  floorLates,
  kitLates,
  prepTarget,
  foodLift,
  lateTarget,
  manualHolds,
}: ServiceSummaryComponentProps) => {
  return (
    <ul>
      {[
        {
          label: "Prep Time",
          value: serviceSummary.averagePreparationTime.total,
        },
        {
          label: "Wait Time",
          value: serviceSummary.averageWaitTime.total,
        },
        {
          label: "Delivery Time",
          value: serviceSummary.averageDeliveryTime.total,
        },
        {
          label: "Orders",
          value: serviceSummary.numberOfOrders,
          className: "",
        },
        {
          label: "Lates",
          value: `${serviceSummary.numberOfLateOrders.total.count} (${serviceSummary.numberOfLateOrders.total.percentage}%)`,
        },
        { label: "Items", value: serviceSummary.numberOfItems, className: "" },
        manualHolds
          ? {
              label: "Holds",
              value: serviceSummary.chef1.manualHolds,
              className: "",
            }
          : null,
        floorLates
          ? {
              label: "Floor Lates",
              value:
                serviceSummary.numberOfLateOrders.total.count! -
                serviceSummary.chef1.ordersLate.count +
                ` (${
                  serviceSummary.numberOfLateOrders.total.percentage -
                  serviceSummary.chef1.ordersLate.percentage
                }%)`,
            }
          : null,
        kitLates
          ? {
              label: "Kitchen Lates",
              value: `${serviceSummary.chef1.ordersLate.count} (${serviceSummary.chef1.ordersLate.percentage}%)`,
            }
          : null,
      ]
        .filter(Boolean)
        .map((item, index) => (
          <li key={index}>
            <div>{item?.label}</div>
            <div>{item?.value}</div>
          </li>
        ))}
    </ul>
  );
};
