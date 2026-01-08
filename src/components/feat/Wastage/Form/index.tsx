import { Button, InnerCard, Input, Textarea, Select } from "@/components/ui";

interface WastageFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  values: { topItems: number; wastageData: string };
  onChange: (field: string, value: string | number) => void;
  displayMode: string;
  setDisplayMode: (mode: string) => void;
  topItems: number;
  setTopItems: (value: number) => void;
}

export const WastageForm: React.FC<WastageFormProps> = ({
  onSubmit,
  values,
  onChange,
  displayMode,
  setDisplayMode,
  topItems,
  setTopItems,
}) => {
  return (
    <form className="form__container" onSubmit={onSubmit}>
      <InnerCard padding="medium" className="form__row">
        <Select
          label="Display Mode"
          id="display-mode"
          required
          value={displayMode}
          onChange={(e) => setDisplayMode(e.target.value)}
        >
          <option value="aggregated">Aggregated</option>
          <option value="date">Group by Date</option>
          <option value="reason">Group by Reason</option>
        </Select>

        {displayMode === "aggregated" && (
          <Input
            id="top-items"
            name="top-items"
            type="number"
            label="Number of products"
            required
            min={15}
            max={100}
            value={topItems}
            onChange={(e) => setTopItems(Number(e.target.value))}
          />
        )}
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
