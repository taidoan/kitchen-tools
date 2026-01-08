import type {
  WastageResultItem,
  WastageGroupedByDate,
  WastageGroupedByReason,
} from "@/app/wastage/types";
import {
  aggregateByProduct,
  groupByDate,
  groupByReason,
} from "@/lib/utils/parseWastage";

import React from "react";

interface WastageResultProps {
  result: Array<WastageResultItem>;
  displayMode: string;
  topItems?: number;
}

export const WastageResult = ({
  result,
  displayMode,
  topItems,
}: WastageResultProps) => {
  let displayData:
    | WastageResultItem[]
    | WastageGroupedByDate[]
    | WastageGroupedByReason[] = result;

  if (displayMode === "aggregated") {
    displayData = aggregateByProduct(result, topItems);
  } else if (displayMode === "date") {
    displayData = groupByDate(result);
  } else if (displayMode === "reason") {
    displayData = groupByReason(result);
  }

  return (
    <div className="wastage__results">
      {displayMode === "aggregated" && (
        <table className="wastage__table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Unit</th>
              <th>Quantity</th>
              <th>Cost</th>
              <th>Entries</th>
            </tr>
          </thead>
          <tbody>
            {(displayData as WastageResultItem[]).map((item, idx) => (
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

      {(displayData as WastageGroupedByDate[]).map((group, idx) => (
        <table key={idx} className="wastage__table wastage__table--date">
          <thead>
            <tr>
              <th colSpan={4}>Date: {group.date}</th>
            </tr>
            <tr>
              <th>Product</th>
              <th>Unit</th>
              <th>Quantity</th>
              <th>Cost</th>
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
              <td colSpan={2}>Total Items: {group.totalItems}</td>
              <td colSpan={3}>Total Cost: £{group.totalCost}</td>
            </tr>
          </tfoot>
        </table>
      ))}
    </div>
  );
};
