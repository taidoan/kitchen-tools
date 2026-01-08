"use client";

import type {
  WastageResultItem,
  WastageGroupedByDate,
  WastageGroupedByReason,
} from "@/app/wastage/types";
import { Select } from "@/components/ui";

import {
  aggregateByProduct,
  groupByDate,
  groupByReason,
} from "@/lib/utils/parseWastage";

import React, { useState, useMemo } from "react";

interface WastageResultProps {
  result: Array<WastageResultItem>;
  displayMode: string;
  topItems?: number;
  showAllItems: boolean;
}

export const WastageResult = ({
  result,
  displayMode,
  topItems,
  showAllItems,
}: WastageResultProps) => {
  const [sortOption, setSortOption] = useState<
    | "cost-asc"
    | "cost-desc"
    | "quantity-asc"
    | "quantity-desc"
    | "entries-asc"
    | "entries-desc"
    | string
  >("cost-desc");

  const displayData = useMemo(() => {
    if (displayMode === "aggregated") {
      return aggregateByProduct(result, showAllItems ? undefined : topItems);
    } else if (displayMode === "date") {
      return groupByDate(result);
    } else if (displayMode === "reason") {
      return groupByReason(result);
    }
    return result;
  }, [result, displayMode, topItems, showAllItems]);

  const sortedData = useMemo(() => {
    const compare = (a: WastageResultItem, b: WastageResultItem) => {
      switch (sortOption) {
        case "cost-asc":
          return a.cost - b.cost;
        case "cost-desc":
          return b.cost - a.cost;
        case "quantity-asc":
          return a.quantity - b.quantity;
        case "quantity-desc":
          return b.quantity - a.quantity;
        case "entries-asc":
          return a.entries - b.entries;
        case "entries-desc":
          return b.entries - a.entries;
        default:
          return 0;
      }
    };

    if (displayMode === "aggregated") {
      return [...(displayData as WastageResultItem[])].sort(compare);
    } else if (displayMode === "date") {
      return (displayData as WastageGroupedByDate[]).map((group) => ({
        ...group,
        items: [...group.items].sort(compare),
      }));
    } else if (displayMode === "reason") {
      return (displayData as WastageGroupedByReason[]).map((group) => ({
        ...group,
        items: [...group.items].sort(compare),
      }));
    }

    return displayData;
  }, [displayData, sortOption, displayMode]);

  const headerSortMap: Record<string, { asc: string; desc: string }> = {
    Cost: { asc: "cost-asc", desc: "cost-desc" },
    Quantity: { asc: "quantity-asc", desc: "quantity-desc" },
    Entries: { asc: "entries-asc", desc: "entries-desc" },
  };

  const handleHeaderClick = (header: string) => {
    const keys = headerSortMap[header];
    if (!keys) return;
    setSortOption((prev) => (prev === keys.asc ? keys.desc : keys.asc));
  };

  return (
    <div className="wastage__results">
      <div className="results__sort">
        <form className="results__sort__form">
          <Select
            id="sort-select"
            label="Sort by"
            className="input--small"
            defaultValue="cost-desc"
            containerClassName="form__input--row"
            hideRequiredIndicator={true}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="cost-desc">Cost (High to Low)</option>
            <option value="cost-asc">Cost (Low to High)</option>
            <option value="quantity-desc">Quantity (High to Low)</option>
            <option value="quantity-asc">Quantity (Low to High)</option>
            {displayMode === "aggregated" && (
              <>
                <option value="entries-desc">Entries (High to Low)</option>
                <option value="entries-asc">Entries (Low to High)</option>
              </>
            )}
          </Select>
        </form>
      </div>
      {displayMode === "aggregated" && (
        <table className="wastage__table">
          <thead>
            <tr>
              {["Product", "Unit", "Quantity", "Cost", "Entries"].map(
                (header, idx) => (
                  <th
                    key={idx}
                    className="wastage__table__sortable-header"
                    onClick={() => handleHeaderClick(header)}
                  >
                    {header}
                    {sortOption.includes(header.toLowerCase()) && (
                      <span>{sortOption.endsWith("asc") ? " ▲" : " ▼"}</span>
                    )}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {(sortedData as WastageResultItem[]).map((item, idx) => (
              <tr key={idx}>
                <td>{item.product}</td>
                <td>{item.unit}</td>
                <td>{item.quantity}</td>
                <td>£{item.cost}</td>
                <td>{item.entries}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {displayMode === "date" &&
        (sortedData as WastageGroupedByDate[]).map((group, idx) => (
          <table key={idx} className="wastage__table wastage__table-other">
            <thead>
              <tr>
                <th colSpan={4} className="wastage__table-other__header">
                  Date: {group.date}
                </th>
              </tr>
              <tr>
                {["Product", "Unit", "Quantity", "Cost"].map((header, idx) => (
                  <th
                    key={idx}
                    className="wastage__table-other__header-cell"
                    onClick={() => handleHeaderClick(header)}
                  >
                    {header}
                    {sortOption.includes(header.toLowerCase()) && (
                      <span>{sortOption.endsWith("asc") ? " ▲" : " ▼"}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {group.items.map((item, itemIdx) => (
                <tr key={itemIdx}>
                  <td>{item.product}</td>
                  <td>{item.unit}</td>
                  <td>{item.quantity}</td>
                  <td>£{item.cost}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="wastage__table-total-bg">
                  <strong>Total Items:</strong> {group.totalItems}
                </td>
                <td colSpan={3} className="wastage__table-total-bg">
                  <strong>Total Cost:</strong> £{group.totalCost}
                </td>
              </tr>
            </tfoot>
          </table>
        ))}

      {displayMode === "reason" &&
        (sortedData as WastageGroupedByReason[]).map((group, idx) => (
          <table key={idx} className="wastage__table wastage__table-other">
            <thead>
              <tr>
                <th colSpan={4} className="wastage__table-other__header">
                  Reason: {group.reason}
                </th>
              </tr>
              <tr>
                {["Product", "Unit", "Quantity", "Cost"].map((header, idx) => (
                  <th
                    key={idx}
                    className="wastage__table-other__header-cell"
                    onClick={() => handleHeaderClick(header)}
                  >
                    {header}
                    {sortOption.includes(header.toLowerCase()) && (
                      <span>{sortOption.endsWith("asc") ? " ▲" : " ▼"}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {group.items.map((item, itemIdx) => (
                <tr key={itemIdx}>
                  <td>{item.product}</td>
                  <td>{item.unit}</td>
                  <td>{item.quantity}</td>
                  <td>£{item.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
    </div>
  );
};
