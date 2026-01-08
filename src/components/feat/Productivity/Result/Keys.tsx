import React from "react";
import {
  MAX_PREP_TIME_FOOD_LIFT,
  MAX_PREP_TIME_NO_FOOD_LIFT,
  FOOD_LIFT_WAIT_TIME,
  NO_FOOD_LIFT_WAIT_TIME,
  MAX_DELIVERY_TIME,
  PREP_TIME_TOLERANCE,
  LATE_PERCENTAGE_TOLERANCE,
} from "@config";
import { convertToHHMM } from "@/lib/utils/timeConverter";
import { Divider, InnerCard } from "@/components/ui";
import clsx from "clsx";
import style from "./style.module.scss";

type KeyProps = {
  prepTarget: number;
  lateTarget: number;
  foodLift: boolean;
};

export const KeysComponent = ({
  prepTarget,
  lateTarget,
  foodLift,
}: KeyProps) => {
  const renderKeys = (label: string, keys: React.ReactNode[]) => (
    <InnerCard padding="small" className={style.keys__container}>
      <h3 className={style.keys__title}>{label}</h3>
      <Divider className={style.keys__divider} />
      <ul className={style.keys__list}>{keys}</ul>
    </InnerCard>
  );

  const maxPrepTime = foodLift
    ? MAX_PREP_TIME_FOOD_LIFT
    : MAX_PREP_TIME_NO_FOOD_LIFT;
  const failedTime = Math.min(prepTarget + PREP_TIME_TOLERANCE, maxPrepTime);
  const showWarning =
    (!foodLift && prepTarget + PREP_TIME_TOLERANCE < maxPrepTime) ||
    (foodLift && prepTarget + PREP_TIME_TOLERANCE <= maxPrepTime);

  const generateKeyItem = (
    value: string | number,
    label: string,
    variantClass: string,
    key: string,
    percentage?: boolean
  ) => (
    <li key={key} className={style.keys__item}>
      <span className={clsx(style.keys__label, variantClass)}>
        {value}
        {percentage ? "%" : ""}
      </span>{" "}
      {label}
    </li>
  );
  const prepKeys = renderKeys("Prep Time", [
    generateKeyItem(
      convertToHHMM(prepTarget),
      `mins or less`,
      style[`keys__label--success`],
      "prep-target"
    ),
    showWarning &&
      generateKeyItem(
        convertToHHMM(prepTarget),
        `mins or more`,
        style[`keys__label--warning`],
        "prep-warning"
      ),
    generateKeyItem(
      convertToHHMM(failedTime),
      `mins or more`,
      style[`keys__label--failed`],
      "prep-failed"
    ),
  ]);

  const waitTime = foodLift ? FOOD_LIFT_WAIT_TIME : NO_FOOD_LIFT_WAIT_TIME;
  const waitKeys = renderKeys("Wait Time", [
    generateKeyItem(
      convertToHHMM(waitTime),
      `mins or less.`,
      style[`keys__label--success`],
      "wait-target"
    ),
    generateKeyItem(
      convertToHHMM(waitTime),
      `mins or more.`,
      style[`keys__label--failed`],
      "wait-failed"
    ),
  ]);

  const lateKeys = renderKeys("Late Orders", [
    generateKeyItem(
      lateTarget,
      `or less.`,
      style[`keys__label--success`],
      "late-target",
      true
    ),
    generateKeyItem(
      lateTarget,
      `or more.`,
      style[`keys__label--warning`],
      "late-warning",
      true
    ),
    generateKeyItem(
      lateTarget + LATE_PERCENTAGE_TOLERANCE,
      `or more.`,
      style[`keys__label--failed`],
      "late-failed",
      true
    ),
  ]);

  const deliveryKeys = renderKeys("Delivery Time", [
    generateKeyItem(
      convertToHHMM(MAX_DELIVERY_TIME),
      `mins or less.`,
      style[`keys__label--success`],
      "delivery-target-0"
    ),
    generateKeyItem(
      convertToHHMM(MAX_DELIVERY_TIME),
      `mins or more.`,
      style[`keys__label--failed`],
      "delivery-failed-1"
    ),
  ]);

  return (
    <div className={clsx(style.crib)}>
      <div className={style.keys__intro}>
        <h2 className={style.title}>Understanding The Report</h2>
        <p>
          The floor team needs at least{" "}
          <strong>
            {foodLift
              ? convertToHHMM(FOOD_LIFT_WAIT_TIME)
              : convertToHHMM(NO_FOOD_LIFT_WAIT_TIME)}
          </strong>{" "}
          minutes to deliver food sent from the kitchen on time.
        </p>
      </div>
      <div className={style.keys__wrapper}>
        {prepKeys}
        {lateKeys}
        {waitKeys}
        {deliveryKeys}
      </div>
    </div>
  );
};
