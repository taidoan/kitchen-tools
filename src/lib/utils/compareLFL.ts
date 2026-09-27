import type { ProductItem } from "./groupCategory";

export type LFLMetrics = {
  quantity: number;
  valueOfSales: number;
  grossSales: number;
  discount: number;
  promotion: number;
  tax: number;
};

export type ComparedProduct = {
  key: string;
  productName: string;
  category: string;
  subCategory: string;
  period1: LFLMetrics | null;
  period2: LFLMetrics | null;
  delta: LFLMetrics;
  pct: Record<keyof LFLMetrics, number | null>;
};

type PeriodEntry = { item: ProductItem; metrics: LFLMetrics };
type PeriodMap = Map<string, PeriodEntry>;

const tidyName = (raw: string) =>
  raw.replace(/\u00A0/g, " ").trim().replace(/\s+/g, " ");

/** POS extras tacked on the end: Standard, and truncated "AC" (e.g. ChiAC). */
const POS_SUFFIX = /[\s_-]*(ST|AC)$/;

export const hasPOSSuffix = (raw: string) => POS_SUFFIX.test(tidyName(raw));

/**
 * Compact a POS name for matching:
 * - strip trailing ST / AC
 * - drop spaces and punctuation (UltimateBurger == Ultimate Burger)
 * - normalise & with or without spaces
 * - expand Jkt → jacket
 * - in Jacket Potatoes, ignore jacket/potato filler words
 */
export const compactLFLName = (raw: string, category = "") => {
  let value = tidyName(raw)
    .replace(POS_SUFFIX, "")
    .replace(/\s*&\s*/g, "&")
    .toLowerCase()
    .replace(/jkt/g, "jacket")
    .replace(/[^a-z0-9&]/g, "");

  if (category.toLowerCase().includes("jacket")) {
    value = value
      .replace(/potatoes/g, "")
      .replace(/potato/g, "")
      .replace(/jacket/g, "")
      .replace(/mayo/g, "");
  }

  return value;
};

export const normaliseLFLProductName = (raw: string, category = "") =>
  compactLFLName(raw, category);

export const productKey = (item: {
  Category: string;
  "Sub Category": string;
  "Product Name": string;
}) =>
  [
    item.Category.trim().toLowerCase(),
    item["Sub Category"].trim().toLowerCase(),
    compactLFLName(item["Product Name"], item.Category),
  ].join("|");

const groupKey = (item: ProductItem) =>
  `${item.Category.trim().toLowerCase()}|${item["Sub Category"].trim().toLowerCase()}`;

export const isLFLNameMatch = (
  nameA: string,
  nameB: string,
  category = "",
) => {
  const a = compactLFLName(nameA, category);
  const b = compactLFLName(nameB, category);

  if (!a || !b) return false;
  if (a === b) return true;

  const [shorter, longer] = a.length <= b.length ? [a, b] : [b, a];
  if (shorter.length < 6) return false;

  return longer.startsWith(shorter) && longer.length - shorter.length <= 4;
};

const findExistingMatchKey = (map: PeriodMap, item: ProductItem) => {
  const exact = productKey(item);
  if (map.has(exact)) return exact;

  for (const [key, entry] of map) {
    if (groupKey(entry.item) !== groupKey(item)) continue;
    if (
      isLFLNameMatch(
        entry.item["Product Name"],
        item["Product Name"],
        item.Category,
      )
    ) {
      return key;
    }
  }

  return exact;
};

const preferDisplayItem = (current: ProductItem, incoming: ProductItem) =>
  hasPOSSuffix(incoming["Product Name"]) && !hasPOSSuffix(current["Product Name"])
    ? incoming
    : current;

const alignRenames = (first: PeriodMap, second: PeriodMap) => {
  const unmatchedFirst = [...first.entries()].filter(([key]) => !second.has(key));
  const unmatchedSecond = [...second.entries()].filter(([key]) => !first.has(key));
  const usedSecond = new Set<string>();

  unmatchedFirst.forEach(([firstKey, firstEntry]) => {
    const matches = unmatchedSecond.filter(([secondKey, secondEntry]) => {
      if (usedSecond.has(secondKey)) return false;
      if (groupKey(firstEntry.item) !== groupKey(secondEntry.item)) return false;
      return isLFLNameMatch(
        firstEntry.item["Product Name"],
        secondEntry.item["Product Name"],
        firstEntry.item.Category,
      );
    });

    if (matches.length !== 1) return;

    const [secondKey] = matches[0];
    usedSecond.add(secondKey);
    first.delete(firstKey);
    first.set(secondKey, firstEntry);
  });
};

const emptyMetrics = (): LFLMetrics => ({
  quantity: 0,
  valueOfSales: 0,
  grossSales: 0,
  discount: 0,
  promotion: 0,
  tax: 0,
});

export const metricsFromItem = (item: ProductItem): LFLMetrics => ({
  quantity: item["Quantity Sold"],
  valueOfSales: item["Value of Sales"],
  grossSales: item["Gross Sales"],
  discount: item.Discount,
  promotion: item.Promotion,
  tax: item.Tax,
});

const addMetrics = (a: LFLMetrics, b: LFLMetrics): LFLMetrics => ({
  quantity: a.quantity + b.quantity,
  valueOfSales: a.valueOfSales + b.valueOfSales,
  grossSales: a.grossSales + b.grossSales,
  discount: a.discount + b.discount,
  promotion: a.promotion + b.promotion,
  tax: a.tax + b.tax,
});

const pctChange = (period1: number, period2: number): number | null => {
  if (period1 === 0) return null;
  return ((period2 - period1) / period1) * 100;
};

export const buildComparison = (
  period1: LFLMetrics | null,
  period2: LFLMetrics | null,
): Pick<ComparedProduct, "period1" | "period2" | "delta" | "pct"> => {
  const p1 = period1 ?? emptyMetrics();
  const p2 = period2 ?? emptyMetrics();
  const delta: LFLMetrics = {
    quantity: p2.quantity - p1.quantity,
    valueOfSales: p2.valueOfSales - p1.valueOfSales,
    grossSales: p2.grossSales - p1.grossSales,
    discount: p2.discount - p1.discount,
    promotion: p2.promotion - p1.promotion,
    tax: p2.tax - p1.tax,
  };

  return {
    period1,
    period2,
    delta,
    pct: {
      quantity: pctChange(p1.quantity, p2.quantity),
      valueOfSales: pctChange(p1.valueOfSales, p2.valueOfSales),
      grossSales: pctChange(p1.grossSales, p2.grossSales),
      discount: pctChange(p1.discount, p2.discount),
      promotion: pctChange(p1.promotion, p2.promotion),
      tax: pctChange(p1.tax, p2.tax),
    },
  };
};

const indexPeriod = (items: ProductItem[]) => {
  const map: PeriodMap = new Map();

  items.forEach((item) => {
    const key = findExistingMatchKey(map, item);
    const existing = map.get(key);
    const metrics = metricsFromItem(item);

    if (!existing) {
      map.set(key, { item, metrics });
      return;
    }

    map.set(key, {
      item: preferDisplayItem(existing.item, item),
      metrics: addMetrics(existing.metrics, metrics),
    });
  });

  return map;
};

export const compareLFL = (
  period1: ProductItem[],
  period2: ProductItem[],
): ComparedProduct[] => {
  const first = indexPeriod(period1);
  const second = indexPeriod(period2);
  alignRenames(first, second);
  const keys = new Set([...first.keys(), ...second.keys()]);

  return [...keys]
    .map((key) => {
      const left = first.get(key);
      const right = second.get(key);
      const source = right?.item ?? left?.item;

      if (!source) return null;

      return {
        key,
        productName: source["Product Name"],
        category: source.Category,
        subCategory: source["Sub Category"],
        ...buildComparison(left?.metrics ?? null, right?.metrics ?? null),
      };
    })
    .filter((row): row is ComparedProduct => row !== null)
    .sort((a, b) => {
      const category = a.category.localeCompare(b.category);
      if (category !== 0) return category;
      return a.productName.localeCompare(b.productName);
    });
};

export const aggregateComparedRows = (
  rows: ComparedProduct[],
  label: { key: string; productName: string; category: string; subCategory?: string },
): ComparedProduct => {
  const totals = rows.reduce(
    (acc, row) => ({
      period1: addMetrics(acc.period1, row.period1 ?? emptyMetrics()),
      period2: addMetrics(acc.period2, row.period2 ?? emptyMetrics()),
    }),
    { period1: emptyMetrics(), period2: emptyMetrics() },
  );

  const hasPeriod1 = rows.some((row) => row.period1 !== null);
  const hasPeriod2 = rows.some((row) => row.period2 !== null);

  return {
    key: label.key,
    productName: label.productName,
    category: label.category,
    subCategory: label.subCategory ?? "",
    ...buildComparison(
      hasPeriod1 ? totals.period1 : null,
      hasPeriod2 ? totals.period2 : null,
    ),
  };
};

export const aggregateLFLByCategory = (
  rows: ComparedProduct[],
): ComparedProduct[] => {
  const grouped = rows.reduce<Record<string, ComparedProduct[]>>((acc, row) => {
    if (!acc[row.category]) acc[row.category] = [];
    acc[row.category].push(row);
    return acc;
  }, {});

  return Object.keys(grouped)
    .sort((a, b) => a.localeCompare(b))
    .map((category) =>
      aggregateComparedRows(grouped[category], {
        key: `category|${category.toLowerCase()}`,
        productName: category,
        category,
      }),
    );
};
