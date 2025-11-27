import type { ProductivityData } from "@/app/productivity/types";

import clsx from "clsx";
import style from "./style.module.scss";
import {
  generatePrepTimeClasses,
  generateLatesClasses,
} from "@/lib/utils/generateClasses";

type ProductivityComponentProps = {
  productivity: ProductivityData | null;
  prepTarget: number;
  lateTarget: number;
  foodLift: boolean;
  className?: string;
};

export const ProductivityComponent = ({
  productivity,
  prepTarget,
  foodLift,
  lateTarget,
  className,
}: ProductivityComponentProps) => {
  return (
    <table className={clsx(className, style.productivity__table)}>
      <thead>
        <tr>
          {[
            "Name",
            "Prep Time",
            "Orders",
            "Items",
            "Late Orders",
            "Longest Order",
            "Hours Worked",
          ].map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {productivity?.staffMembers.map((member) => {
          const prepTimeClass = generatePrepTimeClasses(
            member.prepTime,
            prepTarget,
            foodLift
          );

          const latesClass = generateLatesClasses(
            member.lateOrdersPercentage,
            lateTarget
          );

          return (
            <tr key={member.name}>
              <td className="">{member.name}</td>
              <td data-cell="Prep Time: " className={prepTimeClass}>
                {member.prepTime}
              </td>
              <td data-cell="Orders: ">{member.orders}</td>
              <td data-cell="Items: ">{member.items}</td>
              <td data-cell="Late Orders: " className={latesClass}>
                {member.lateOrders}{" "}
                <span className="text--small">
                  ({member.lateOrdersPercentage}%)
                </span>
              </td>
              <td data-cell="Longest Order: ">{member.longestOrder}</td>
              <td data-cell="Hours Worked: ">{member.hoursWorked}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
