import type { ProductivityResult } from "@/app/productivity/types";
import clsx from "clsx";
import {
  generatePrepTimeClasses,
  generateWaitTimeClasses,
  generateDeliveryTimeClasses,
  generateLatesClasses,
  generateFloorLatesClasses,
} from "@/lib/utils/generateClasses";
import style from "./style.module.scss";

type ServiceSummaryComponentProps = Pick<
  ProductivityResult,
  | "serviceSummary"
  | "floorLates"
  | "kitLates"
  | "prepTarget"
  | "foodLift"
  | "lateTarget"
  | "manualHolds"
> & { className?: string };

export const ServiceSummaryComponent = ({
  serviceSummary,
  floorLates,
  kitLates,
  manualHolds,
  prepTarget,
  foodLift,
  lateTarget,
  className,
}: ServiceSummaryComponentProps) => {
  const servicePrepTimeClass = generatePrepTimeClasses(
    serviceSummary.averagePreparationTime.total,
    prepTarget,
    foodLift
  );

  const serviceWaitTimeClass = generateWaitTimeClasses(
    serviceSummary.averageWaitTime.total,
    foodLift
  );

  const serviceDeliveryTimeClass = generateDeliveryTimeClasses(
    serviceSummary.averageDeliveryTime.total
  );

  const serviceLatesClass = generateLatesClasses(
    serviceSummary.numberOfLateOrders.total.percentage,
    lateTarget
  );

  const serviceFloorLatesClass = generateFloorLatesClasses(
    serviceSummary.numberOfLateOrders.total.percentage -
      serviceSummary.chef1.ordersLate.percentage
  );

  const columns = [
    {
      label: "Prep Time",
      value: serviceSummary.averagePreparationTime.total,
      className: servicePrepTimeClass,
    },
    {
      label: "Wait Time",
      value: serviceSummary.averageWaitTime.total,
      className: serviceWaitTimeClass,
    },
    {
      label: "Delivery Time",
      value: serviceSummary.averageDeliveryTime.total,
      className: serviceDeliveryTimeClass,
    },
    {
      label: "Orders",
      value: serviceSummary.numberOfOrders,
    },
    {
      label: "Lates",
      value: (
        <>
          {serviceSummary.numberOfLateOrders.total.count}{" "}
          <span className="text--small">
            ({serviceSummary.numberOfLateOrders.total.percentage}%)
          </span>
        </>
      ),
      className: serviceLatesClass,
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
          value: (
            <>
              {serviceSummary.numberOfLateOrders.total.count! -
                serviceSummary.chef1.ordersLate.count}{" "}
              <span className="text--small">
                (
                {serviceSummary.numberOfLateOrders.total.percentage -
                  serviceSummary.chef1.ordersLate.percentage}
                %)
              </span>
            </>
          ),
          className: serviceFloorLatesClass,
        }
      : null,

    kitLates
      ? {
          label: "Kitchen Lates",
          value: (
            <>
              {serviceSummary.chef1.ordersLate.count}{" "}
              <span className="text--small">
                ({serviceSummary.chef1.ordersLate.percentage}%)
              </span>
            </>
          ),
          className: serviceLatesClass,
        }
      : null,
  ].filter(Boolean);

  return (
    <div className={clsx("table__wrapper", className)}>
      <table className={style["service-summary__table"]}>
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
              <td
                key={index}
                data-cell={`${col!.label}`}
                className={col!.className}
              >
                <span className={clsx("cell__value")}>{col!.value}</span>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
