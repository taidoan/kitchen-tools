export type WastageItem = {
  product: string;
  unit: string;
  quantity: number;
  cost: number;
  entries: number;
};

function cleanName(raw: string) {
  const parts = raw
    .split("\t")
    .map((p) => p.trim())
    .filter(Boolean);

  // Remove unwanted prefixes like "Recipe Products"
  const filtered = parts.filter((p) => p.toLowerCase() !== "recipe products");

  if (filtered.length >= 2) {
    return {
      product: filtered[filtered.length - 2],
      unit: filtered[filtered.length - 1],
    };
  }

  return {
    product: raw.trim(),
    unit: "",
  };
}

export function parseWastage(text: string, topItems: number): WastageItem[] {
  if (!text) return [];

  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const itemsMap: Record<
    string,
    {
      product: string;
      unit: string;
      qty: number;
      cost: number;
      occurrences: number;
    }
  > = {};

  for (const line of lines) {
    const match = line.match(/^(.+?)\s+([\d.]+)\s+\£?([\d.]+)$/);
    if (!match) continue;

    const [, rawName, qtyStr, costStr] = match;

    const { product, unit } = cleanName(rawName); // now an object
    const key = product.toLowerCase().trim(); // merge duplicates by product only

    const qty = parseFloat(qtyStr);
    const cost = parseFloat(costStr);

    if (!itemsMap[key]) {
      itemsMap[key] = {
        product,
        unit,
        qty: 0,
        cost: 0,
        occurrences: 0,
      };
    }

    itemsMap[key].qty += qty;
    itemsMap[key].cost += cost;
    itemsMap[key].occurrences += 1;
  }

  return Object.values(itemsMap)
    .map((item) => ({
      product: item.product,
      unit: item.unit,
      quantity: Number(item.qty.toFixed(2)),
      cost: Number(item.cost.toFixed(2)),
      entries: item.occurrences,
    }))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, topItems);
}
