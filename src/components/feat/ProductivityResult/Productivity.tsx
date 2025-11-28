import type { ProductivityData } from "@/app/productivity/types";
import { Select } from "@/components/ui/Select";

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
  foodLift?: boolean;
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
    <>
      <div className="fdt__sort">
        <div></div>
        <div>
          <Select
            id="sort-select"
            label="Sort productivity by"
            className="input--small"
            defaultValue="name-asc"
            containerClassName={clsx("form__input--row")}
            hideRequiredIndicator={true}
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="prep-asc">Prep Time (Low to High)</option>
            <option value="prep-desc">Prep Time (High to Low)</option>
            <option value="lates-asc">Late % (Low to High)</option>
            <option value="lates-desc">Late % (High to Low)</option>
            <option value="orders-asc">Orders (Low to High)</option>
            <option value="orders-desc">Orders (High to Low)</option>
            <option value="items-asc">Items (Low to High)</option>
            <option value="items-desc">Items (High to Low)</option>
            <option value="longest-asc">Longest Order (Low to High)</option>
            <option value="longest-desc">Longest Order (High to Low)</option>
            <option value="hours-asc">Hours Worked (Low to High)</option>
            <option value="hours-desc">Hours Worked (High to Low)</option>
          </Select>
        </div>
      </div>
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
    </>
  );
};
