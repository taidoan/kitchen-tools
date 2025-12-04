import { Button } from "@/components/ui/Button";
import { InnerCard } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export const SalesForm = () => {
  return (
    <div className="form__container">
      <InnerCard padding="medium" className="form__row">
        <Input
          id="top-items"
          type="number"
          label="Number of products"
          required
          defaultValue={5}
          min={1}
          max={15}
        />
      </InnerCard>
      <InnerCard padding="small" className="form__row">
        <Textarea
          id="sales-data"
          label="Sales Data"
          required
          rows={10}
          placeholder="Paste the product sales data here..."
        />
      </InnerCard>
      <Button type="submit" centered>
        Submit
      </Button>
    </div>
  );
};
