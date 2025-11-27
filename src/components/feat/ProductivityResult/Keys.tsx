import React, { JSX } from "react";
import {
  MAX_PREP_TIME_FOOD_LIFT,
  MAX_PREP_TIME_NO_FOOD_LIFT,
  FOOD_LIFT_WAIT_TIME,
  NO_FOOD_LIFT_WAIT_TIME,
} from "@config";
import { convertToHHMM } from "@/lib/utils/timeConverter";
import clsx from "clsx";
import style from "./style.module.scss";
import { Divider } from "@/components/ui/Divider";

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
  const renderKeys = (label: string, keys: JSX.Element[]) => (
    <div className={style.keys__container}>
      <h3 className={style.keys__title}>{label}</h3>
      <Divider className={style.keys__divider} />
      <ul className={style.keys__list}>{keys}</ul>
    </div>
  );

  const failedTime = foodLift
    ? Math.max(prepTarget, MAX_PREP_TIME_FOOD_LIFT)
    : Math.max(prepTarget, MAX_PREP_TIME_NO_FOOD_LIFT);

  const prepKeys = renderKeys("Prep Time", [
    <li key="prep-target-0">
      <span className={clsx("bg-clr--success", style.key)}></span>{" "}
      {convertToHHMM(prepTarget)} mins or less.
    </li>,

    <li key="prep-failed-2">
      <span className={clsx("bg-clr--failed", style.key)}></span> More than{" "}
      {convertToHHMM(failedTime)} mins.
    </li>,
  ]);

  const waitKeys = renderKeys("Wait Time", [
    <li key="wait-target-0">
      <span className={clsx("bg-clr--success", style.key)}></span>{" "}
      {foodLift ? FOOD_LIFT_WAIT_TIME : NO_FOOD_LIFT_WAIT_TIME} mins or less.
    </li>,
    <li key="wait-failed-1">
      <span className={clsx("bg-clr--failed", style.key)}></span> More than{" "}
      {foodLift ? FOOD_LIFT_WAIT_TIME : NO_FOOD_LIFT_WAIT_TIME} mins.
    </li>,
  ]);

  const lateKeys = renderKeys("Late Orders", [
    <li key="late-target-0">
      <span className={clsx("bg-clr--success", style.key)}></span> {lateTarget}%
      or less.
    </li>,
    <li key="late-failed-1">
      <span className={clsx("bg-clr--warning", style.key)}></span> More than{" "}
      {lateTarget}
      %.
    </li>,
    <li key="late-failed-2">
      <span className={clsx("bg-clr--failed", style.key)}></span> More than{" "}
      {lateTarget + 10}%.
    </li>,
  ]);

  return (
    <div className={style.keys__wrapper}>
      {prepKeys}
      {waitKeys}
      {lateKeys}
    </div>
  );
};
