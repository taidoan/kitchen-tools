import type { ParsedData } from "@/app/productivity/types";

export type FormData = {
  sales: number | null;
  salesForecast: number | null;
  latesTarget: number;
  prepTarget: number;
  foodLift: boolean;
  kitLates: boolean;
  floorLates: boolean;
  manualHolds: boolean;
  copiedServiceData: string;
  copiedProductivityData: string;
};

export type KSRSForm = {
  onSubmit: (data: ParsedData) => void;
  initialValues?: Partial<FormData>;
  submitted: boolean;
  activeTab?: "dataEntry" | "result" | string;
};
