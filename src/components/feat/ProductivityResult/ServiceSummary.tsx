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
  manualHolds,
}: ServiceSummaryComponentProps) => {
  const columns = [
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
    },
    {
      label: "Lates",
      value: `${serviceSummary.numberOfLateOrders.total.count} (${serviceSummary.numberOfLateOrders.total.percentage}%)`,
    },
    {
      label: "Items",
      value: serviceSummary.numberOfItems,
    },
    manualHolds
      ? {
          label: "Holds",
          value: serviceSummary.chef1.manualHolds,
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
  ].filter(Boolean);

  return (
    <div className="table__wrapper">
      <table>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col!.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr>
            {columns.map((col, index) => (
              <td key={index} data-cell={`${col!.label}`}>
                <span className="cell__value">{col!.value}</span>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
