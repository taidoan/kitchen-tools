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
import {
  getDateRangeParts,
  type DateRangeParts,
} from "@/lib/utils/formatDateRange";
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
  const pctClassName =
    delta > 0 ? "text-clr--success" : delta < 0 ? "text-clr--failed" : "text-clr--percentage";
  const formattedDelta =
    kind === "money"
      ? `${delta > 0 ? "+" : delta < 0 ? "−" : ""}${currency.format(Math.abs(delta))}`
      : `${delta > 0 ? "+" : ""}${formatQty(delta)}`;
  const formattedPct = formatPct(pct);

  return (
    <td>
      {formattedDelta}
      {formattedPct ? (
        <span className={clsx("text--small", pctClassName)}> ({formattedPct})</span>
      ) : null}
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
      <span className="lfl__th-print" aria-hidden="true">
        {label}
      </span>
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

const DatePill = ({ children }: { children: string }) => (
  <span className="lfl__date-pill">{children}</span>
);

const RangePhrase = ({ range }: { range: DateRangeParts }) => {
  if (range.isSingleDay) return <DatePill>{range.from}</DatePill>;

  return (
    <>
      <DatePill>{range.from}</DatePill>
      {" - "}
      <DatePill>{range.to}</DatePill>
    </>
  );
};

const LFLPeriodLine = ({
  current,
  previous,
}: {
  current: DateRangeParts | null;
  previous: DateRangeParts | null;
}) => {
  const bothSingleDays =
    (!current || current.isSingleDay) && (!previous || previous.isSingleDay);

  return (
    <p className="lfl__period">
      {bothSingleDays ? "LFL report between " : "LFL report from "}
      {current ? <RangePhrase range={current} /> : null}
      {current && previous ? " to " : null}
      {previous ? <RangePhrase range={previous} /> : null}
    </p>
  );
};

export const LFLResult = ({ rows, dates }: LFLResultProps) => {
  const [mode, setMode] = useState<LFLViewMode>("categories");
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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
  const selectedCategoryRows = rows.filter((row) =>
    selectedCategories.includes(row.category),
  );
  const selectedCategoryTotals = aggregateLFLByCategory(selectedCategoryRows);
  const selectedCategoriesTotal =
    selectedCategoryTotals.length > 1
      ? aggregateComparedRows(selectedCategoryRows, {
          key: "selected-categories-total",
          productName: "Selected total",
          category: "Selected",
        })
      : undefined;
  const categorySummaries = aggregateLFLByCategory(rows);
  const reportTotal = aggregateComparedRows(rows, {
    key: "report-total",
    productName: "Total",
    category: "All",
  });
  const currentRange = getDateRangeParts(dates?.currentFrom, dates?.currentTo);
  const previousRange = getDateRangeParts(
    dates?.previousFrom,
    dates?.previousTo,
  );

  return (
    <div className={clsx("page__print", "lfl__result")}>
      {currentRange || previousRange ? (
        <LFLPeriodLine current={currentRange} previous={previousRange} />
      ) : null}
      <div className="button__group lfl__modes">
      <Button
          enabled={mode === "categories"}
          onClick={() => setMode("categories")}
        >
          Categories
        </Button>
        <Button
          enabled={mode === "products"}
          onClick={() => setMode("products")}
        >
          Products
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
             <div>
             <h3 className="sales__title"><span className="sales__title-print">Comparing </span>Selected products <span className="sales__title-print">LFLs</span></h3>
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
             </div>
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
            label="Categories to compare"
            required={false}
            hideRequiredIndicator
            isMulti
            isSearchable
            closeMenuOnSelect
            placeholder="Search and select categories..."
            options={categoryOptions}
            value={selectedCategories}
            onChange={setSelectedCategories}
          />
          {selectedCategoryTotals.length ? (
            <>
              <div>
                <h3 className="sales__title">
                  <span className="sales__title-print">Comparing </span>
                  {selectedCategories.length === 1
                    ? selectedCategories[0]
                    : "Selected categories"}
                  <span className="sales__title-print"> LFLs</span>
                </h3>
                <ComparisonTable
                  rows={selectedCategoryTotals}
                  nameHeader="Category"
                  footer={selectedCategoriesTotal}
                />
              </div>
              {selectedCategoryTotals.map((summary) => {
                const products = rows.filter(
                  (row) => row.category === summary.category,
                );
                if (!products.length) return null;
                return (
                  <div key={summary.category}>
                    <h3 className="sales__title">
                      Products in {summary.category}
                    </h3>
                    <ComparisonTable rows={products} nameHeader="Product" />
                  </div>
                );
              })}
            </>
          ) : (
            <p>Select one or more categories to compare quantity and sales.</p>
          )}
        </>
      )}

      {mode === "report" && (
        <>
          <div>
          <h3 className="sales__title"><span className="sales__title-print">Comparing </span>Entire product range <span className="sales__title-print">LFLs</span></h3>
          <ComparisonTable
            rows={categorySummaries}
            nameHeader="Category"
            footer={reportTotal}
          />
          </div>
          
        </>
      )}
    </div>
  );
};
