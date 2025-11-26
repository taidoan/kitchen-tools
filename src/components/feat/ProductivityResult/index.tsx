import type { ProductivityResult as ProductivityResultProps } from "@/app/productivity/types";
import { SalesComponent } from "./Sales";

export const ProductivityResult = ({
  sales,
  salesTarget,
  lateTarget,
  prepTarget,
  foodLift,
  kitLates,
  floorLates,
  manualHolds,
  serviceSummary,
  productivity,
}: ProductivityResultProps) => {
  return (
    <div>
      Hello, <SalesComponent sales={sales} salesForecast={salesTarget} />
    </div>
  );
};
