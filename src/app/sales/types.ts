export interface SalesItem {
  Category: string;
  "Product Name": string;
  "Quantity Sold": number | string;
  "Value of Sales": number | string;
  "Gross Sales": number | string;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  [key: string]: any;
}

export interface SalesResult {
  topSales: SalesItem[];
  topQuantity: SalesItem[];
}
