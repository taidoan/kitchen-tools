"use client";

import { Button, CsvUpload, InnerCard, Input, Textarea } from "@/components/ui";

export type LFLFormValues = {
  currentReport: string;
  previousReport: string;
  currentFrom: string;
  currentTo: string;
  previousFrom: string;
  previousTo: string;
};

interface LFLFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  values: LFLFormValues;
  onChange: (field: keyof LFLFormValues, value: string) => void;
}

export const LFLForm: React.FC<LFLFormProps> = ({
  onSubmit,
  values,
  onChange,
}) => {
  return (
    <form className="form__container" onSubmit={onSubmit}>
      <div className="lfl__paste">
        <InnerCard padding="medium" className="lfl__report">
          <div className="lfl__dates">
            <Input
              id="current-from"
              name="current-from"
              type="date"
              label="From"
              value={values.currentFrom}
              onChange={(e) => onChange("currentFrom", e.target.value)}
            />
            <Input
              id="current-to"
              name="current-to"
              type="date"
              label="To"
              value={values.currentTo}
              onChange={(e) => onChange("currentTo", e.target.value)}
            />
          </div>
          <Textarea
            id="current-report"
            name="current-report"
            label="Current report"
            required
            rows={10}
            placeholder="Paste the latest product report here..."
            onChange={(e) => onChange("currentReport", e.target.value)}
            value={values.currentReport}
            action={
              <CsvUpload
                id="current-report-file"
                label="Upload current report CSV"
                onFile={(text) => onChange("currentReport", text)}
              />
            }
          />
        </InnerCard>
        <InnerCard padding="medium" className="lfl__report">
          <div className="lfl__dates">
            <Input
              id="previous-from"
              name="previous-from"
              type="date"
              label="From"
              value={values.previousFrom}
              onChange={(e) => onChange("previousFrom", e.target.value)}
            />
            <Input
              id="previous-to"
              name="previous-to"
              type="date"
              label="To"
              value={values.previousTo}
              onChange={(e) => onChange("previousTo", e.target.value)}
            />
          </div>
          <Textarea
            id="previous-report"
            name="previous-report"
            label="Previous report"
            required
            rows={10}
            placeholder="Paste the report you are comparing against..."
            onChange={(e) => onChange("previousReport", e.target.value)}
            value={values.previousReport}
            action={
              <CsvUpload
                id="previous-report-file"
                label="Upload previous report CSV"
                onFile={(text) => onChange("previousReport", text)}
              />
            }
          />
        </InnerCard>
      </div>
      <Button type="submit" centered>
        Compare
      </Button>
    </form>
  );
};
