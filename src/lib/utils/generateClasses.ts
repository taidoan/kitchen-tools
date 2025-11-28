import { convertTimeToMinutes } from "./timeConverter";
import {
  FLOOR_LATE_MAX_PERCENTAGE,
  MAX_DELIVERY_TIME,
  NO_FOOD_LIFT_WAIT_TIME,
  FOOD_LIFT_WAIT_TIME,
  MAX_PREP_TIME_FOOD_LIFT,
  MAX_PREP_TIME_NO_FOOD_LIFT,
  PREP_TIME_TOLERANCE,
  LATE_PERCENTAGE_TOLERANCE,
} from "@config";

export const generatePrepTimeClasses = (
  prepTime: string | undefined,
  prepTarget: number,
  foodLift?: boolean
) => {
  const prepTimeValue = convertTimeToMinutes(prepTime || "0:00");

  const maxPrepTime = foodLift
    ? MAX_PREP_TIME_FOOD_LIFT
    : MAX_PREP_TIME_NO_FOOD_LIFT;

  if (prepTimeValue <= prepTarget) return "bg-clr--success";

  if (
    prepTarget + PREP_TIME_TOLERANCE <= maxPrepTime &&
    prepTimeValue <= prepTarget + PREP_TIME_TOLERANCE
  )
    return "bg-clr--warning";

  return "bg-clr--failed";
};

export const generateWaitTimeClasses = (
  waitTime: string | undefined,
  foodLift: boolean
) => {
  const waitTimeMinutes = convertTimeToMinutes(waitTime || "0");
  return waitTimeMinutes <=
    (foodLift ? FOOD_LIFT_WAIT_TIME : NO_FOOD_LIFT_WAIT_TIME)
    ? "bg-clr--success"
    : "bg-clr--failed";
};

export const generateDeliveryTimeClasses = (
  deliveryTime: string | undefined
) => {
  const deliveryTimeMinutes = convertTimeToMinutes(deliveryTime || "0");
  return deliveryTimeMinutes <= MAX_DELIVERY_TIME
    ? "bg-clr--success"
    : "bg-clr--failed";
};

export const generateLatesClasses = (
  latePercentage: number,
  lateTarget: number
) => {
  if (latePercentage <= lateTarget) return "bg-clr--success";
  if (latePercentage <= lateTarget + LATE_PERCENTAGE_TOLERANCE)
    return "bg-clr--warning";
  return "bg-clr--failed";
};

export const generateFloorLatesClasses = (latePercentage: number) => {
  if (latePercentage <= FLOOR_LATE_MAX_PERCENTAGE) return "bg-clr--success";
  return "bg-clr--failed";
};
