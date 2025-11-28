import { InnerCard } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { clsx } from "clsx";

export const SalesForm = () => {
  return (
    <div>
      <InnerCard padding="medium">
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
      <InnerCard padding="small">
        <Textarea id="sales-data" label="Sales Data" required rows={10} />
      </InnerCard>
    </div>
  );
};
