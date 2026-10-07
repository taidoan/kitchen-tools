"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { Button, Combobox, Divider } from "@/components/ui";
import type { ComboboxGroup } from "@/components/ui/Combobox";
import {
  aggregateComparedRows,
  aggregateLFLByCategory,
  type ComparedProduct,
} from "@/lib/utils/compareLFL";
import { formatDateRange } from "@/lib/utils/formatDateRange";
import type { LFLViewMode } from "../types";

type LFLResultProps = {
  rows: ComparedProduct[];
  dates?: {
    currentFrom: string;
    currentTo: string;
    previousFrom: string;
    previousTo: string;
  };
};

const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

const formatQty = (value: number) =>
  Number.isInteger(value) ? String(value) : value.toFixed(1);

const formatPct = (value: number | null) => {
  if (value === null || !Number.isFinite(value)) return null;
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(1)}%`;
};

const ChangeCell = ({
  delta,
  pct,
  kind,
}: {
  delta: number;
  pct: number | null;
  kind: "qty" | "money";
}) => {
  const className =
    delta > 0 ? "text-clr--success" : delta < 0 ? "text-clr--failed" : "text-clr--percentage";
  const formattedDelta =
    kind === "money"
      ? `${delta > 0 ? "+" : delta < 0 ? "−" : ""}${currency.format(Math.abs(delta))}`
      : `${delta > 0 ? "+" : ""}${formatQty(delta)}`;
  const formattedPct = formatPct(pct);

  return (
    <td>
      <span className={className}>
        {formattedDelta}
        {formattedPct ? (
          <span className="text--small"> ({formattedPct})</span>
        ) : null}
      </span>
    </td>
  );
};

type SortKey =
  | "name"
  | "category"
  | "qtyThis"
  | "qtyLast"
  | "qtyChange"
  | "salesThis"
  | "salesLast"
  | "salesChange";

type SortDir = "asc" | "desc";

const numericSortDefaults: SortKey[] = [
  "qtyThis",
  "qtyLast",
  "qtyChange",
  "salesThis",
  "salesLast",
  "salesChange",
];

const sortValue = (row: ComparedProduct, key: SortKey): string | number | null => {
  switch (key) {
    case "name":
      return row.productName.toLowerCase();
    case "category":
      return row.category.toLowerCase();
    case "qtyThis":
      return row.period2?.quantity ?? null;
    case "qtyLast":
      return row.period1?.quantity ?? null;
    case "qtyChange":
      return row.pct.quantity ?? row.delta.quantity;
    case "salesThis":
      return row.period2?.valueOfSales ?? null;
    case "salesLast":
      return row.period1?.valueOfSales ?? null;
    case "salesChange":
      return row.pct.valueOfSales ?? row.delta.valueOfSales;
    default:
      return null;
  }
};

const compareSortValues = (
  a: string | number | null,
  b: string | number | null,
  dir: SortDir,
) => {
  const aMissing = a === null || a === undefined || (typeof a === "number" && !Number.isFinite(a));
  const bMissing = b === null || b === undefined || (typeof b === "number" && !Number.isFinite(b));
  if (aMissing && bMissing) return 0;
  if (aMissing) return 1;
  if (bMissing) return -1;

  const order = dir === "asc" ? 1 : -1;
  if (typeof a === "string" && typeof b === "string") {
    return a.localeCompare(b) * order;
  }
  return ((a as number) - (b as number)) * order;
};

const SortHeader = ({
  label,
  column,
  sortKey,
  sortDir,
  onSort,
}: {
  label: string;
  column: SortKey;
  sortKey: SortKey | null;
  sortDir: SortDir;
  onSort: (column: SortKey) => void;
}) => {
  const active = sortKey === column;
  return (
    <th>
      <button
        type="button"
        className={clsx("lfl__sort", active && "lfl__sort--active")}
        onClick={() => onSort(column)}
      >
        {label}
        {active ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
      </button>
    </th>
  );
};

const ComparisonTable = ({
  rows,
  nameHeader,
  showCategory = false,
  footer,
}: {
  rows: ComparedProduct[];
  nameHeader: string;
  showCategory?: boolean;
  footer?: ComparedProduct;
}) => {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (column: SortKey) => {
    if (sortKey === column) {
      setSortDir((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(column);
    setSortDir(numericSortDefaults.includes(column) ? "desc" : "asc");
  };

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;
    return [...rows].sort((a, b) =>
      compareSortValues(sortValue(a, sortKey), sortValue(b, sortKey), sortDir),
    );
  }, [rows, sortKey, sortDir]);

  if (!rows.length && !footer) return null;

  return (
    <div className="table__wrapper">
      <table className="sales__table lfl__table">
        <thead>
          <tr>
            <SortHeader
              label={nameHeader}
              column="name"
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
            />
            {showCategory && (
              <SortHeader
                label="Category"
                column="category"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
              />
            )}
            <SortHeader label="Current QTY" column="qtyThis" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
            <SortHeader label="Previous QTY" column="qtyLast" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
            <SortHeader label="QTY LFL" column="qtyChange" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
            <SortHeader label="Current sales" column="salesThis" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
            <SortHeader label="Previous sales" column="salesLast" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
            <SortHeader label="Sales LFL" column="salesChange" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row) => (
            <tr key={row.key}>
              <td>
                {row.productName}
                {row.subCategory ? (
                  <span className="text--small text-clr--percentage lfl__sub">
                    {row.subCategory}
                  </span>
                ) : null}
              </td>
              {showCategory && <td>{row.category}</td>}
              <td>{row.period2 ? formatQty(row.period2.quantity) : "—"}</td>
              <td>{row.period1 ? formatQty(row.period1.quantity) : "—"}</td>
              <ChangeCell
                delta={row.delta.quantity}
                pct={row.pct.quantity}
                kind="qty"
              />
              <td>
                {row.period2 ? currency.format(row.period2.valueOfSales) : "—"}
              </td>
              <td>
                {row.period1 ? currency.format(row.period1.valueOfSales) : "—"}
              </td>
              <ChangeCell
                delta={row.delta.valueOfSales}
                pct={row.pct.valueOfSales}
                kind="money"
              />
            </tr>
          ))}
          {footer ? (
            <tr className="lfl__total">
              <td>{footer.productName}</td>
              {showCategory && <td />}
              <td>{footer.period2 ? formatQty(footer.period2.quantity) : "—"}</td>
              <td>{footer.period1 ? formatQty(footer.period1.quantity) : "—"}</td>
              <ChangeCell
                delta={footer.delta.quantity}
                pct={footer.pct.quantity}
                kind="qty"
              />
              <td>
                {footer.period2
                  ? currency.format(footer.period2.valueOfSales)
                  : "—"}
              </td>
              <td>
                {footer.period1
                  ? currency.format(footer.period1.valueOfSales)
                  : "—"}
              </td>
              <ChangeCell
                delta={footer.delta.valueOfSales}
                pct={footer.pct.valueOfSales}
                kind="money"
              />
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
};

export const LFLResult = ({ rows, dates }: LFLResultProps) => {
  const [mode, setMode] = useState<LFLViewMode>("products");
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const productOptions = useMemo<ComboboxGroup[]>(() => {
    const grouped = rows.reduce<Record<string, ComparedProduct[]>>((acc, row) => {
      if (!acc[row.category]) acc[row.category] = [];
      acc[row.category].push(row);
      return acc;
    }, {});

    return Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b))
      .map((category) => ({
        label: category,
        options: grouped[category].map((row) => ({
          value: row.key,
          label:
            row.subCategory && row.subCategory !== category
              ? `${row.productName} (${row.subCategory})`
              : row.productName,
        })),
      }));
  }, [rows]);

  const categoryOptions = useMemo(
    () =>
      [...new Set(rows.map((row) => row.category))]
        .sort((a, b) => a.localeCompare(b))
        .map((category) => ({ value: category, label: category })),
    [rows],
  );

  const selectedProducts = rows.filter((row) => selectedKeys.includes(row.key));
  const categoryRows = rows.filter((row) => row.category === selectedCategory);
  const categoryTotal =
    selectedCategory && categoryRows.length
      ? aggregateComparedRows(categoryRows, {
          key: `category|${selectedCategory.toLowerCase()}`,
          productName: selectedCategory,
          category: selectedCategory,
        })
      : null;
  const categorySummaries = aggregateLFLByCategory(rows);
  const reportTotal = aggregateComparedRows(rows, {
    key: "report-total",
    productName: "Total",
    category: "All",
  });
  const currentRange = formatDateRange(dates?.currentFrom, dates?.currentTo);
  const previousRange = formatDateRange(
    dates?.previousFrom,
    dates?.previousTo,
  );

  return (
    <div className={clsx("page__print", "lfl__result")}>
      {currentRange || previousRange ? (
        <div className="lfl__period">
          {currentRange ? <p>Current report: {currentRange}</p> : null}
          {previousRange ? <p>Previous report: {previousRange}</p> : null}
        </div>
      ) : null}
      <div className="button__group lfl__modes">
        <Button
          enabled={mode === "products"}
          onClick={() => setMode("products")}
        >
          Products
        </Button>
        <Button
          enabled={mode === "categories"}
          onClick={() => setMode("categories")}
        >
          Categories
        </Button>
        <Button
          enabled={mode === "report"}
          onClick={() => setMode("report")}
        >
          Entire report
        </Button>
      </div>

      {mode === "products" && (
        <>
          <Combobox
            id="lfl-products"
            label="Products to compare"
            required={false}
            hideRequiredIndicator
            isMulti
            isSearchable
            placeholder="Search and select products..."
            options={productOptions}
            value={selectedKeys}
            onChange={setSelectedKeys}
          />
          {selectedProducts.length ? (
            <>
              <h3 className="sales__title">Selected products</h3>
              <Divider className="sales__divider" />
              <ComparisonTable
                rows={selectedProducts}
                nameHeader="Product"
                showCategory
                footer={
                  selectedProducts.length > 1
                    ? aggregateComparedRows(selectedProducts, {
                        key: "selected-total",
                        productName: "Selected total",
                        category: "Selected",
                      })
                    : undefined
                }
              />
            </>
          ) : (
            <p>Select one or more products to compare quantity and sales.</p>
          )}
        </>
      )}

      {mode === "categories" && (
        <>
          <Combobox
            id="lfl-category"
            label="Category"
            required={false}
            hideRequiredIndicator
            isSearchable
            placeholder="Select a category..."
            options={categoryOptions}
            value={selectedCategory}
            onChange={setSelectedCategory}
          />
          {selectedCategory && categoryTotal ? (
            <>
              <h3 className="sales__title">{selectedCategory}</h3>
              <Divider className="sales__divider" />
              <ComparisonTable rows={[categoryTotal]} nameHeader="Category" />
              <h3 className="sales__title">Products in {selectedCategory}</h3>
              <Divider className="sales__divider" />
              <ComparisonTable rows={categoryRows} nameHeader="Product" />
            </>
          ) : (
            <p>Select a category to compare it as a whole.</p>
          )}
        </>
      )}

      {mode === "report" && (
        <>
          <h3 className="sales__title">Entire product report</h3>
          <Divider className="sales__divider" />
          <p>
            Current report vs previous report for every product in both pastes.
            Missing products are treated as zero in the totals.
          </p>
          <ComparisonTable
            rows={categorySummaries}
            nameHeader="Category"
            footer={reportTotal}
          />
        </>
      )}
    </div>
  );
};
