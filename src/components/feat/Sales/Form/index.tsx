import { Button, InnerCard, Input, Textarea } from "@/components/ui";

interface SalesFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  values: { topItems: number; salesData: string };
  onChange: (field: string, value: string | number) => void;
}

export const SalesForm: React.FC<SalesFormProps> = ({
  onSubmit,
  values,
  onChange,
}) => {
  return (
    <form className="form__container" onSubmit={onSubmit}>
      <InnerCard padding="medium" className="form__row">
        <Input
          id="top-items"
          name="top-items"
          type="number"
          label="Number of products"
          required
          min={1}
          max={30}
          value={values.topItems}
          onChange={(e) => onChange("topItems", Number(e.target.value))}
        />
      </InnerCard>
      <InnerCard padding="small" className="form__row">
        <Textarea
          id="sales-data"
          name="sales-data"
          label="Sales Data"
          required
          rows={10}
          placeholder="Paste the product sales data here..."
          onChange={(e) => onChange("salesData", e.target.value)}
          value={values.salesData}
        />
      </InnerCard>
      <Button type="submit" centered>
        Submit
      </Button>
    </form>
  );
};
