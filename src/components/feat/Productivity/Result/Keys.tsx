import React from "react";
import {
  FOOD_LIFT_WAIT_TIME,
  NO_FOOD_LIFT_WAIT_TIME,
  MAX_DELIVERY_TIME,
  LATE_PERCENTAGE_TOLERANCE,
} from "@config";
import { formatKitchenTime } from "@/lib/utils/timeConverter";
import { getPrepThresholds } from "@/lib/utils/generateClasses";
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

  const { warnUntil, hasWarning } = getPrepThresholds(prepTarget, foodLift);
  const waitTime = foodLift ? FOOD_LIFT_WAIT_TIME : NO_FOOD_LIFT_WAIT_TIME;

  const generateKeyItem = (
    value: string,
    label: string,
    variantClass: string,
    key: string
  ) => (
    <li key={key} className={style.keys__item}>
      <span className={clsx(style.keys__label, variantClass)}>{value}</span>{" "}
      {label}
    </li>
  );

  const prepKeys = renderKeys("Prep Time", [
    generateKeyItem(
      formatKitchenTime(prepTarget),
      "or under",
      style["keys__label--success"],
      "prep-target"
    ),
    hasWarning &&
      generateKeyItem(
        `${formatKitchenTime(prepTarget)}–${formatKitchenTime(warnUntil)}`,
        "over target",
        style["keys__label--warning"],
        "prep-warning"
      ),
    generateKeyItem(
      formatKitchenTime(hasWarning ? warnUntil : prepTarget),
      "over",
      style["keys__label--failed"],
      "prep-failed"
    ),
  ]);

  const waitKeys = renderKeys("Wait Time", [
    generateKeyItem(
      formatKitchenTime(waitTime),
      "or under",
      style["keys__label--success"],
      "wait-target"
    ),
    generateKeyItem(
      formatKitchenTime(waitTime),
      "over",
      style["keys__label--failed"],
      "wait-failed"
    ),
  ]);

  const lateKeys = renderKeys("Late Orders", [
    generateKeyItem(
      `${lateTarget}%`,
      "or under",
      style["keys__label--success"],
      "late-target"
    ),
    generateKeyItem(
      `${lateTarget}–${lateTarget + LATE_PERCENTAGE_TOLERANCE}%`,
      "over target",
      style["keys__label--warning"],
      "late-warning"
    ),
    generateKeyItem(
      `${lateTarget + LATE_PERCENTAGE_TOLERANCE}%`,
      "over",
      style["keys__label--failed"],
      "late-failed"
    ),
  ]);

  const deliveryKeys = renderKeys("Delivery Time", [
    generateKeyItem(
      formatKitchenTime(MAX_DELIVERY_TIME),
      "or under",
      style["keys__label--success"],
      "delivery-target"
    ),
    generateKeyItem(
      formatKitchenTime(MAX_DELIVERY_TIME),
      "over",
      style["keys__label--failed"],
      "delivery-failed"
    ),
  ]);

  return (
    <div className={clsx(style.crib)}>
      <div className={style.keys__intro}>
        <h3 className={style.sectionTitle}>Colour key</h3>
        <p>
          The floor team needs at least{" "}
          <strong>{formatKitchenTime(waitTime)}</strong> to run food on time
          {foodLift ? " with the lift" : ""}.
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
