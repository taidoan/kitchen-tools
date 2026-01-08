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

export type ServiceSummary = {
  siteName: string;
  dateRange: string;
  averageDeliveryTime: {
    starters: string;
    mains: string;
    desserts: string;
    total: string;
  };
  averageWaitTime: {
    starters: string;
    mains: string;
    desserts: string;
    total: string;
  };
  averagePreparationTime: {
    starters: string;
    mains: string;
    desserts: string;
    total: string;
  };
  numberOfOrders: number;
  numberOfLateOrders: {
    starters: { count: number; percentage: number };
    mains: { count: number; percentage: number };
    desserts: { count: number; percentage: number };
    total: {
      count: number | null;
      percentage: number;
    };
  };
  numberOfItems: number;
  numberOfLateItems: {
    starters: { count: number; percentage: number };
    mains: { count: number; percentage: number };
    desserts: { count: number; percentage: number };
    total: {
      count: number | null;
      percentage: number;
    };
  };
  checksOnTime: {
    onTime: number;
    early: number;
    late: number;
  };

  chef1: {
    averagePrepTime: string;
    numberOfOrders: number;
    ordersLate: { count: number; percentage: number };
    numberOfItems: number;
    itemsLate: { count: number; percentage: number };
    ordersBumped: number;
    manualHolds: number;
  };

  dispense: {
    averagePrepTime: string;
    numberOfOrders: number;
    ordersLate: { count: number; percentage: number };
    numberOfItems: number;
    itemsLate: { count: number; percentage: number };
    ordersBumped: number;
    manualHolds: number;
  };
};

export type StaffMember = {
  name: string;
  prepTime: string;
  orders: number;
  items: number;
  lateOrders: number;
  lateOrdersPercentage: number;
  longestOrder: string;
  hoursWorked: string;
};

export type ProductivityData = {
  range?: string;
  staffMembers: StaffMember[];
};

export type ProductivityResult = {
  sales: number | null;
  salesTarget: number | null;
  lateTarget: number;
  prepTarget: number;
  foodLift: boolean;
  kitLates: boolean;
  floorLates: boolean;
  manualHolds: boolean;
  serviceSummary: ServiceSummary;
  productivity: ProductivityData | null;
};

export interface ParsedData extends FormData {
  parsedServiceSummary: ServiceSummary;
  parsedProductivityData: ProductivityData;
}
