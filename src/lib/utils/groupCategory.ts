export type ProductItem = {
  Category: string;
  "Sub Category": string;
  "Product Name": string;
  "Quantity Sold": number;
  "Value of Sales": number;
  "Gross Sales": number;
  Discount: number;
  Promotion: number;
  Tax: number;
};

export const groupItemsByCategory = (
  items: ProductItem[],
): Record<string, ProductItem[]> => {
  return items.reduce(
    (acc, item) => {
      const category = item.Category?.trim();

      if (!category) return acc;

      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push(item);
      return acc;
    },
    {} as Record<string, ProductItem[]>,
  );
};
