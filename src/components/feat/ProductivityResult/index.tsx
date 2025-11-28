import type { ProductivityResult as ProductivityResultProps } from "@/app/productivity/types";
import { SalesComponent } from "./Sales";
import { ServiceSummaryComponent } from "./ServiceSummary";
import { ProductivityComponent } from "./Productivity";
import { KeysComponent } from "./Keys";
import { DEFAULT_SERVICE_SUMMARY } from "@config";
import style from "./style.module.scss";

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
    <div className="fdt__print">
      <div className={style.intro}>
        <h2 className={style.title}>
          {serviceSummary.siteName
            ? serviceSummary.siteName
            : DEFAULT_SERVICE_SUMMARY.siteName}{" "}
          Food Delivery Times
        </h2>
        {productivity && productivity.range && <p>{productivity.range}</p>}
        <SalesComponent sales={sales} salesForecast={salesTarget} />
      </div>
      <ServiceSummaryComponent
        serviceSummary={serviceSummary}
        floorLates={floorLates}
        kitLates={kitLates}
        prepTarget={prepTarget}
        foodLift={foodLift}
        lateTarget={lateTarget}
        manualHolds={manualHolds}
        className="service-summary__table"
      />
      <ProductivityComponent
        productivity={productivity}
        prepTarget={prepTarget}
        lateTarget={lateTarget}
        foodLift={foodLift}
        className="fdt__table"
      />
      <KeysComponent
        prepTarget={prepTarget}
        lateTarget={lateTarget}
        foodLift={foodLift}
      />
    </div>
  );
};
