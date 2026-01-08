export interface WastageResultItem {
  product: string;
  unit: string;
  quantity: number;
  cost: number;
  entries: number;
  reason: string;
  date: string;
  dates: string[];
  reasons: string[];
}

export interface WastageGroupedByDate {
  date: string;
  items: WastageResultItem[];
  totalCost: number;
  totalItems: number;
}

export interface WastageGroupedByReason {
  reason: string;
  items: WastageResultItem[];
  totalCost: number;
  totalItems: number;
}
