import type { ProductivityResult as ProductivityResultProps } from "../types";
import { DEFAULT_SERVICE_SUMMARY } from "@config";
import clsx from "clsx";
import { SalesComponent } from "./Sales";
import { ServiceSummaryComponent } from "./ServiceSummary";
import { ProductivityComponent } from "./Productivity";
import { KeysComponent } from "./Keys";
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
  const siteName =
    serviceSummary.siteName || DEFAULT_SERVICE_SUMMARY.siteName;
  const period =
    productivity?.range || serviceSummary.dateRange || "";

  return (
    <div className={`page__print ${style.report}`}>
      <header className={style.intro}>
        <p className={style.kicker}>Food delivery times</p>
        <h2 className={style.title}>{siteName}</h2>
        {period ? <p className={style.period}>{period}</p> : null}
        <SalesComponent sales={sales} salesForecast={salesTarget} />
      </header>
      <section className={style.section}>
        <h3 className={clsx(style.sectionTitle, style.hidePrint)}>
          Service summary
        </h3>
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
      </section>
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
