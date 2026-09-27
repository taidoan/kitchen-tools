import { Button, Input, Textarea, Select, Checkbox } from "@/components/ui";

interface WastageFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  values: { wastageData: string };
  onChange: (field: string, value: string | number) => void;
  displayMode: string;
  setDisplayMode: (mode: string) => void;
  topItems: number | undefined;
  setTopItems: (value: number) => void;
  showAllItems: boolean;
  setShowAllItems: (value: boolean) => void;
}

export const WastageForm: React.FC<WastageFormProps> = ({
  onSubmit,
  values,
  onChange,
  displayMode,
  setDisplayMode,
  topItems,
  setTopItems,
  showAllItems,
  setShowAllItems,
}) => {
  return (
    <form className="form__container" onSubmit={onSubmit}>
      <div className="form__row">
        <Select
          label="Display mode"
          id="display-mode"
          required
          value={displayMode}
          onChange={(e) => setDisplayMode(e.target.value)}
        >
          <option value="aggregated">Aggregated</option>
          <option value="date">Group by date</option>
          <option value="reason">Group by reason</option>
        </Select>

        {displayMode === "aggregated" && !showAllItems && (
          <Input
            id="top-items"
            name="top-items"
            type="number"
            label="Number of products"
            required
            min={5}
            max={100}
            value={topItems ?? 5}
            onChange={(e) => setTopItems(Number(e.target.value))}
            disabled={showAllItems}
          />
        )}
      </div>
      {displayMode === "aggregated" && (
        <Checkbox
          id="show-all-items"
          label="Show all items"
          checked={showAllItems}
          onChange={(e) => setShowAllItems(e.target.checked)}
        />
      )}
      <Textarea
        id="wastage-data"
        name="wastage-data"
        label="Wastage data"
        required
        rows={10}
        placeholder="Paste the wastage report data here..."
        onChange={(e) => onChange("wastageData", e.target.value)}
        value={values.wastageData}
      />
      <Button type="submit" centered>
        Submit
      </Button>
    </form>
  );
};
