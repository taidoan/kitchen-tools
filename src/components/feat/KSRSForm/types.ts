import type {
  ParsedData,
  ServiceSummary,
  ProductivityData,
} from "@/app/productivity/types";

export type FormData = {
  sales: number | null;
  salesForecast: number | null;
  lateTarget: number;
  prepTarget: number;
  foodLift: boolean;
  kitLates: boolean;
  floorLates: boolean;
  manualHolds: boolean;
  copiedServiceData: string;
  copiedProductivityData: string;
  parsedServiceSummary: ServiceSummary;
  parsedProductivityData: ProductivityData;
};

export type KSRSForm = {
  onSubmit: (data: ParsedData) => void;
  initialValues?: Partial<FormData>;
  submitted: boolean;
  activeTab?: "dataEntry" | "result" | string;
};
