import type { ComparedProduct } from "@/lib/utils/compareLFL";

export type LFLViewMode = "products" | "categories" | "report";

export type LFLResultData = {
  rows: ComparedProduct[];
};
