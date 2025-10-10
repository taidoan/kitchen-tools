import clsx from "clsx";
import style from "./style.module.scss";
import * as config from "@config";
import { OuterCard, InnerCard } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export const KSRSForm = () => {
  const checkboxFields = [
    { id: "kitLates", label: "Kitchen Lates", field: "kitLates" },
    { id: "floorLates", label: "Floor Lates", field: "floorLates" },
    { id: "foodLift", label: "Food Lift", field: "foodLift" },
    { id: "holds", label: "Manual Holds", field: "manualHolds" },
  ] as const;

  return (
    <OuterCard className={clsx(style.form)}>
      <InnerCard padding="medium">
        <div>
          <Button>Submit</Button>
          <Button>Reset</Button>
          <Button>Download Data</Button>
        </div>
        <p>
          Set your sales and performance targets, select any optional
          information to display, and enter the data{" "}
          <strong>copied directly</strong> from KSRS into the fields below.
        </p>
      </InnerCard>

      <div className={style.row}>
        <InnerCard padding="small">
          <Input id="actualSales" label="Actual Sales" placeholder="10,000" />
        </InnerCard>
        <InnerCard padding="small">
          <Input
            id="salesForecast"
            label="Sales Forecast"
            placeholder="15,000"
          />
        </InnerCard>
      </div>

      <div className={style.row}>
        <InnerCard padding="small">
          <Select id="latesTarget" label="Late Order Target" required>
            {config.LATE_TARGET_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </InnerCard>
        <InnerCard padding="small">
          <Select id="prepTarget" label="Preparation Target" required>
            {config.PREP_TARGET_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </InnerCard>
      </div>

      <div className={style.row}>
        {checkboxFields.map(({ id, label, field }) => (
          <InnerCard key={id} className={style.checkboxCard} padding="small">
            <Checkbox id={id} label={label} />
          </InnerCard>
        ))}
      </div>

      <div className={style.row}>
        <InnerCard padding="small">
          <Textarea id="prodData" label="Productivity Data" required rows={6} />
        </InnerCard>
      </div>

      <div className={style.row}>
        <InnerCard padding="small">
          <Textarea id="serviceData" label="Service Data" required rows={6} />
        </InnerCard>
      </div>

      <Button>Submit</Button>
    </OuterCard>
  );
};
