import type { WastageResultItem } from "@components/feat/Wastage/types";
import { normaliseProductName } from "./normaliseProductName";

export function parseWastageEntries(text: string): WastageResultItem[] {
  if (!text) return [];

  const lines = text
    .split("\n")
    .map((l) => l.replace(/\r/g, ""))
    .filter(Boolean);

  let currentDate = "";
  let currentReason = "";

  const entries: WastageResultItem[] = [];

  for (const line of lines) {
    if (
      line.startsWith("Date\t") ||
      line.startsWith("Wastage Total") ||
      line.includes("Wastage (Food)")
    ) {
      continue;
    }

    if (!line.includes("\t")) continue;

    const cols = line.split("\t").map((c) => c.trim());

    while (cols.length < 7) cols.push("");

    const [dateCol, reasonCol, category, product, unit, qty, cost] = cols;

    if (dateCol) currentDate = dateCol;
    if (reasonCol) currentReason = reasonCol;

    if (!product || !qty || !cost) continue;

    entries.push({
      date: currentDate,
      reason: currentReason,
      dates: [],
      reasons: [],
      entries: parseFloat(entries.length.toString()),
      product: normaliseProductName(product),
      unit,
      quantity: parseFloat(qty),
      cost: parseFloat(cost.replace("£", "")),
    });
  }

  return entries;
}

export function aggregateByProduct(
  entries: WastageResultItem[],
  numberOfItems?: number
) {
  const map = new Map<string, WastageResultItem>();

  for (const e of entries) {
    const key = e.product.toLowerCase();

    if (!map.has(key)) {
      map.set(key, {
        product: e.product,
        unit: e.unit,
        quantity: 0,
        cost: 0,
        entries: 0,
        date: e.date,
        reason: e.reason,
        dates: [],
        reasons: [],
      });
    }

    const item = map.get(key);
    if (!item) continue;

    item.quantity += e.quantity;
    item.cost += e.cost;
    item.entries += 1;
    if (!item.dates.includes(e.date)) item.dates.push(e.date);
    if (!item.reasons.includes(e.reason)) item.reasons.push(e.reason);
  }

  return Array.from(map.values())
    .map((i) => ({
      ...i,
      quantity: Number(i.quantity.toFixed(2)),
      cost: Number(i.cost.toFixed(2)),
    }))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, numberOfItems);
}

export function groupByDate(entries: WastageResultItem[]) {
  const map: Record<string, WastageResultItem[]> = {};

  for (const e of entries) {
    if (!map[e.date]) {
      map[e.date] = [];
    }
    map[e.date].push(e);
  }

  return Object.entries(map).map(([date, items]) => ({
    date,
    totalCost: Number(items.reduce((sum, i) => sum + i.cost, 0).toFixed(2)),
    totalItems: items.length,
    items: items.sort((a, b) => b.cost - a.cost),
  }));
}

export function groupByReason(entries: WastageResultItem[]) {
  const map: Record<string, WastageResultItem[]> = {};

  for (const e of entries) {
    if (!map[e.reason]) {
      map[e.reason] = [];
    }
    map[e.reason].push(e);
  }

  return Object.entries(map)
    .map(([reason, items]) => ({
      reason,
      totalCost: Number(items.reduce((sum, i) => sum + i.cost, 0).toFixed(2)),
      totalItems: items.length,
      items: items.sort((a, b) => b.cost - a.cost),
    }))
    .sort((a, b) => b.totalItems - a.totalItems);
}
