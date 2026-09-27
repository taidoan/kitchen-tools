"use client";
import type { ProductivityData } from "../types";
import { useState, useMemo } from "react";
import clsx from "clsx";
import style from "./style.module.scss";
import {
  generatePrepTimeClasses,
  generateLatesClasses,
} from "@/lib/utils/generateClasses";
import {
  sortStaffMembers,
  type StaffSortDirection,
  type StaffSortField,
} from "@/lib/utils/sortStaffMembers";

type ProductivityComponentProps = {
  productivity: ProductivityData | null;
  prepTarget: number;
  lateTarget: number;
  foodLift?: boolean;
  className?: string;
};

const COLUMNS: { label: string; field: StaffSortField }[] = [
  { label: "Name", field: "name" },
  { label: "Prep Time", field: "prep" },
  { label: "Orders", field: "orders" },
  { label: "Items", field: "items" },
  { label: "Late Orders", field: "lates" },
  { label: "Longest Order", field: "longest" },
  { label: "Hours Worked", field: "hours" },
];

export const ProductivityComponent = ({
  productivity,
  prepTarget,
  foodLift,
  lateTarget,
  className,
}: ProductivityComponentProps) => {
  const [sortField, setSortField] = useState<StaffSortField>("name");
  const [sortDirection, setSortDirection] =
    useState<StaffSortDirection>("asc");

  const sortedStaff = useMemo(
    () =>
      sortStaffMembers(
        productivity?.staffMembers ?? [],
        sortField,
        sortDirection
      ),
    [productivity, sortField, sortDirection]
  );

  const handleHeaderClick = (field: StaffSortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortField(field);
    setSortDirection("asc");
  };

  return (
    <div className="fdt__productivity">
      <div className={style.sectionHead}>
        <h3 className={clsx(style.sectionTitle, style.hidePrint)}>
          Productivity
        </h3>
        <div className={clsx(style.sortInline, style.hidePrint)}>
          <label htmlFor="sort-field">Sort</label>
          <select
            id="sort-field"
            value={sortField}
            onChange={(e) => setSortField(e.target.value as StaffSortField)}
          >
            <option value="name">Name</option>
            <option value="prep">Prep time</option>
            <option value="lates">Late %</option>
            <option value="orders">Orders</option>
            <option value="items">Items</option>
            <option value="longest">Longest order</option>
            <option value="hours">Hours worked</option>
          </select>
          <button
            type="button"
            className={style.sortDir}
            onClick={() =>
              setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            aria-label={
              sortDirection === "asc"
                ? "Sorted low to high, click for high to low"
                : "Sorted high to low, click for low to high"
            }
          >
            {sortDirection === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>
      <table className={clsx(className, style.productivity__table)}>
        <thead>
          <tr>
            {COLUMNS.map(({ label, field }) => (
              <th
                key={field}
                onClick={() => handleHeaderClick(field)}
                aria-sort={
                  sortField === field
                    ? sortDirection === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
                className={clsx(
                  style.sortHeader,
                  sortField === field && style["sortHeader--active"]
                )}
              >
                {label}
                {sortField === field ? (
                  <span className={style.sortMark} aria-hidden>
                    {sortDirection === "asc" ? " ▲" : " ▼"}
                  </span>
                ) : null}
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
                <td className={style["productivity__name"]}>{member.name}</td>
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
