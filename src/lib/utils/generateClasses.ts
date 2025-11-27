import { convertTimeToMinutes } from "./timeConverter";

export const generatePrepTimeClasses = (
  prepTime: string | undefined,
  prepTarget: number
) => {
  const prepTimeValue = convertTimeToMinutes(prepTime || "0:00");

  if (prepTarget === 9) {
    if (prepTimeValue <= prepTarget) return "bg-clr--success";
    return "bg-clr--failed";
  }

  if (prepTimeValue <= prepTarget) return "bg-clr--success";
  if (prepTimeValue < prepTarget + 1) return "bg-clr--warning";
  return "bg-clr--failed";
};

export const generateWaitTimeClasses = (
  waitTime: string | undefined,
  foodLift: boolean
) => {
  const waitTimeMinutes = convertTimeToMinutes(waitTime || "0");
  return waitTimeMinutes <= (foodLift ? 1.5 : 1)
    ? "bg-clr--success"
    : "bg-clr--failed";
};

export const generateDeliveryTimeClasses = (
  deliveryTime: string | undefined
) => {
  const deliveryTimeMinutes = convertTimeToMinutes(deliveryTime || "0");
  return deliveryTimeMinutes <= 10 ? "bg-clr--success" : "bg-clr--failed";
};

export const generateLatesClasses = (
  latePercentage: number,
  lateTarget: number
) => {
  if (latePercentage <= lateTarget) return "bg-clr--success";
  if (latePercentage <= lateTarget + 10) return "bg-clr--warning";
  return "bg-clr--failed";
};
