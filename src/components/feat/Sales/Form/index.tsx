"use client";

import { Button, CsvUpload, Input, Textarea } from "@/components/ui";

interface SalesFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  values: { topItems: number; salesData: string; from: string; to: string };
  onChange: (field: string, value: string | number) => void;
}

export const SalesForm: React.FC<SalesFormProps> = ({
  onSubmit,
  values,
  onChange,
}) => {
  return (
    <form className="form__container" onSubmit={onSubmit}>
      <Input
        id="top-items"
        name="top-items"
        type="number"
        label="Number of products"
        required
        min={1}
        max={30}
        containerClassName="form__field--short"
        value={values.topItems}
        onChange={(e) => onChange("topItems", Number(e.target.value))}
      />
      <div className="sales__dates">
        <Input
          id="sales-from"
          name="sales-from"
          type="date"
          label="From"
          value={values.from}
          onChange={(e) => onChange("from", e.target.value)}
        />
        <Input
          id="sales-to"
          name="sales-to"
          type="date"
          label="To"
          value={values.to}
          onChange={(e) => onChange("to", e.target.value)}
        />
      </div>
      <Textarea
        id="sales-data"
        name="sales-data"
        label="Sales data"
        required
        rows={10}
        placeholder="Paste the product sales data here..."
        onChange={(e) => onChange("salesData", e.target.value)}
        value={values.salesData}
        action={
          <CsvUpload
            id="sales-data-file"
            label="Upload sales data CSV"
            onFile={(text) => onChange("salesData", text)}
          />
        }
      />
      <Button type="submit" centered>
        Submit
      </Button>
    </form>
  );
};
