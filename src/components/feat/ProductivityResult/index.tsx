import type { ProductivityResult as ProductivityResultProps } from "@/app/productivity/types";
import { SalesComponent } from "./Sales";
import { ServiceSummaryComponent } from "./ServiceSummary";
import { ProductivityComponent } from "./Productivity";

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
      <ServiceSummaryComponent
        serviceSummary={serviceSummary}
        floorLates={floorLates}
        kitLates={kitLates}
        prepTarget={prepTarget}
        foodLift={foodLift}
        lateTarget={lateTarget}
        manualHolds={manualHolds}
      />
      <ProductivityComponent
        productivity={productivity}
        prepTarget={prepTarget}
        lateTarget={lateTarget}
      />
    </div>
  );
};
