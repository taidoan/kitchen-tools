import {
  Button,
  InnerCard,
  Input,
  Textarea,
  Select,
  Checkbox,
} from "@/components/ui";

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
          <>
            <Checkbox
              id="show-all-items"
              label="Show all items"
              checked={showAllItems}
              onChange={(e) => setShowAllItems(e.target.checked)}
            />

            {!showAllItems && (
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
          </>
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
