import type { ServiceSummary } from "@components/feat/Productivity/types";
import { convertToMinutesSeconds } from "./timeConverter";

type createKeysProps = {
  serviceSummary: ServiceSummary;
  lines: string[];
};

type TimeGroup = ServiceSummary["averageDeliveryTime"];
type LateGroup = ServiceSummary["numberOfLateOrders"];
type ChefGroup = ServiceSummary["chef1"];

const num = (value: string) => parseInt(value, 10);
const float = (value: string) => parseFloat(value);

const fillTimeGroup = (target: TimeGroup, values: string[]) => {
  target.starters = convertToMinutesSeconds(float(values[0]));
  target.mains = convertToMinutesSeconds(float(values[1]));
  target.desserts = convertToMinutesSeconds(float(values[2]));
  target.total = convertToMinutesSeconds(float(values[3]));
};

const fillLateGroup = (
  target: LateGroup,
  values: string[],
  totalCount: number
) => {
  target.starters.count = num(values[0]);
  target.starters.percentage = Math.round(
    (target.starters.count / totalCount) * 100
  );

  target.mains.count = num(values[1]);
  target.mains.percentage = Math.round((target.mains.count / totalCount) * 100);

  target.desserts.count = num(values[2]);
  target.desserts.percentage = Math.round(
    (target.desserts.count / totalCount) * 100
  );

  target.total.count = num(values[3]);
  target.total.percentage = Math.round((target.total.count / totalCount) * 100);
};

const fillChefGroup = (chef: ChefGroup, values: string[]) => {
  chef.averagePrepTime = convertToMinutesSeconds(float(values[0]));

  chef.numberOfOrders = num(values[1]);
  chef.ordersLate.count = num(values[2]);
  chef.ordersLate.percentage = Math.round(
    (chef.ordersLate.count / chef.numberOfOrders) * 100
  );

  chef.numberOfItems = num(values[3]);
  chef.itemsLate.count = num(values[4]);
  chef.itemsLate.percentage = Math.round(
    (chef.itemsLate.count / chef.numberOfItems) * 100
  );

  chef.ordersBumped = num(values[5]);
  chef.manualHolds = num(values[6]);
};

/**
 * Parses an array of tab-separated lines and populates fields on a provided service summary object.
 *
 * Each input line is expected to be a tab-separated string where the first cell is a label/key
 * (e.g. "Average Delivery Time", "No. of Orders", "Table/Meal Checks On-Time", "CHEF1", "DISPENSE", etc.)
 * and the remaining cells are the associated values. The function splits each line on '\t', trims
 * each token, and updates the supplied serviceSummary by delegating to helper functions or by
 * direct numeric assignment.
 *
 * Behavior details:
 * - "Average Delivery Time", "Average Wait Time", "Average Preparation Time":
 *   Delegates to fillTimeGroup to populate the corresponding time group on serviceSummary.
 * - "No. of Orders", "No. of Items":
 *   Parses the total count from values[3] (using a numeric helper) and assigns it to the summary.
 * - "No. of Late Orders", "No. of Late Items":
 *   Delegates to fillLateGroup, providing the late-group target, parsed values, and the associated total
 *   (numberOfOrders or numberOfItems) as reference.
 * - "Table/Meal Checks On-Time":
 *   Assigns checksOnTime.onTime, .early, and .late from values[0], values[1], and values[2], respectively.
 * - "CHEF1", "DISPENSE":
 *   Delegates to fillChefGroup to populate chef-specific metrics.
 *
 * The function trims tokens, uses a numeric parsing helper (num) for numeric fields, ignores unrecognized keys,
 * and mutates the provided serviceSummary in place.
 *
 * @param props - The input object containing the summary to populate and the source lines.
 * @param props.serviceSummary - Mutable target object to be updated with parsed values.
 * @param props.lines - Array of tab-separated strings to parse.
 * @returns void
 *
 * @remarks
 * - Side effects: serviceSummary is modified in place.
 * - External helpers used: fillTimeGroup, fillLateGroup, fillChefGroup, and num.
 * - The function is tolerant of whitespace (tokens are trimmed) but expects a specific column layout for certain keys.
 */
export const createKey = ({ serviceSummary, lines }: createKeysProps) => {
  for (const line of lines) {
    const [key, ...values] = line.split("\t").map((v) => v.trim());

    switch (key) {
      case "Average Delivery Time":
        fillTimeGroup(serviceSummary.averageDeliveryTime, values);
        break;

      case "Average Wait Time":
        fillTimeGroup(serviceSummary.averageWaitTime, values);
        break;

      case "Average Preparation Time":
        fillTimeGroup(serviceSummary.averagePreparationTime, values);
        break;

      case "No. of Orders":
        serviceSummary.numberOfOrders = num(values[3]);
        break;

      case "No. of Late Orders":
        fillLateGroup(
          serviceSummary.numberOfLateOrders,
          values,
          serviceSummary.numberOfOrders
        );
        break;

      case "No. of Items":
        serviceSummary.numberOfItems = num(values[3]);
        break;

      case "No. of Late Items":
        fillLateGroup(
          serviceSummary.numberOfLateItems,
          values,
          serviceSummary.numberOfItems
        );
        break;

      case "Table/Meal Checks On-Time":
        serviceSummary.checksOnTime.onTime = num(values[0]);
        serviceSummary.checksOnTime.early = num(values[1]);
        serviceSummary.checksOnTime.late = num(values[2]);
        break;

      case "CHEF1":
        fillChefGroup(serviceSummary.chef1, values);
        break;

      case "DISPENSE":
        fillChefGroup(serviceSummary.dispense, values);
        break;
    }
  }
};
