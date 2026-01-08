"use client";
import type { ProductivityData } from "@/app/productivity/types";
import { useState, useMemo } from "react";
import clsx from "clsx";
import style from "./style.module.scss";
import {
  generatePrepTimeClasses,
  generateLatesClasses,
} from "@/lib/utils/generateClasses";
import { Select } from "@/components/ui/Select";

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
  const [sortOption, setSortOption] = useState("name-asc");

  const sortedStaff = useMemo(() => {
    if (!productivity) return [];

    const staff = [...productivity.staffMembers]; // shallow copy

    switch (sortOption) {
      case "name-asc":
        return staff.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return staff.sort((a, b) => b.name.localeCompare(a.name));
      case "prep-asc":
        return staff.sort((a, b) => a.prepTime.localeCompare(b.prepTime));
      case "prep-desc":
        return staff.sort((a, b) => b.prepTime.localeCompare(a.prepTime));
      case "lates-asc":
        return staff.sort(
          (a, b) => a.lateOrdersPercentage - b.lateOrdersPercentage
        );
      case "lates-desc":
        return staff.sort(
          (a, b) => b.lateOrdersPercentage - a.lateOrdersPercentage
        );
      case "orders-asc":
        return staff.sort((a, b) => a.orders - b.orders);
      case "orders-desc":
        return staff.sort((a, b) => b.orders - a.orders);
      case "items-asc":
        return staff.sort((a, b) => a.items - b.items);
      case "items-desc":
        return staff.sort((a, b) => b.items - a.items);
      case "longest-asc":
        return staff.sort(
          (a, b) => parseFloat(a.longestOrder) - parseFloat(b.longestOrder)
        );
      case "longest-desc":
        return staff.sort(
          (a, b) => parseFloat(b.longestOrder) - parseFloat(a.longestOrder)
        );
      case "hours-asc":
        return staff.sort(
          (a, b) => parseFloat(a.hoursWorked) - parseFloat(b.hoursWorked)
        );
      case "hours-desc":
        return staff.sort(
          (a, b) => parseFloat(b.hoursWorked) - parseFloat(a.hoursWorked)
        );

      default:
        return staff;
    }
  }, [productivity, sortOption]);

  const headerSortMap: Record<string, { asc: string; desc: string }> = {
    Name: { asc: "name-asc", desc: "name-desc" },
    "Prep Time": { asc: "prep-asc", desc: "prep-desc" },
    Orders: { asc: "orders-asc", desc: "orders-desc" },
    Items: { asc: "items-asc", desc: "items-desc" },
    "Late Orders": { asc: "lates-asc", desc: "lates-desc" },
    "Longest Order": { asc: "longest-asc", desc: "longest-desc" },
    "Hours Worked": { asc: "hours-asc", desc: "hours-desc" },
  };

  const handleHeaderClick = (header: string) => {
    const sortKeys = headerSortMap[header];

    if (!sortKeys) return;

    setSortOption((prev) =>
      prev === sortKeys.asc ? sortKeys.desc : sortKeys.asc
    );
  };

  return (
    <div className="fdt__productivity">
      <div className="results__sort">
        <div>
          <h2 className={style.title}>Productivity</h2>
          <p>
            This table shows the performance of kitchen staff members in the
            various metrics provided by KSRS. You can sort the table using the
            dropdown below or by clicking on the column headers.
          </p>
        </div>

        <form className={clsx("results__sort__form")}>
          <Select
            id="sort-select"
            label="Sort by"
            className="input--small"
            defaultValue="name-asc"
            containerClassName={clsx("form__input--row")}
            hideRequiredIndicator={true}
            onChange={(e) => setSortOption(e.target.value)}
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
        </form>
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
              <th key={header} onClick={() => handleHeaderClick(header)}>
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sortedStaff.map((member, index) => {
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
              <tr key={`${member.name}-${index}`}>
                <td>{member.name}</td>
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
    </div>
  );
};
