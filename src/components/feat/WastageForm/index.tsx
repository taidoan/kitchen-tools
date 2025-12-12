import { Button } from "@/components/ui/Button";
import { InnerCard } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface WastageFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  values: { topItems: number; wastageData: string };
  onChange: (field: string, value: string | number) => void;
}

export const WastageForm: React.FC<WastageFormProps> = ({
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
          min={15}
          max={100}
          value={values.topItems}
          onChange={(e) => onChange("topItems", Number(e.target.value))}
        />
      </InnerCard>
      <InnerCard padding="small" className="form__row">
        <Textarea
          id="wastage-data"
          name="wastage-data"
          label="Wastage Data"
          required
          rows={10}
          placeholder="Paste the wastage report data here..."
          onChange={(e) => onChange("wastageData", e.target.value)}
          value={values.wastageData}
        />
      </InnerCard>
      <Button type="submit" centered>
        Submit
      </Button>
    </form>
  );
};
