import { Button, InnerCard, Textarea } from "@/components/ui";

interface LFLFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  values: { currentReport: string; previousReport: string };
  onChange: (field: string, value: string | number) => void;
}

export const LFLForm: React.FC<LFLFormProps> = ({
  onSubmit,
  values,
  onChange,
}) => {
  return (
    <form className="form__container" onSubmit={onSubmit}>
      <div className="lfl__paste">
        <InnerCard padding="medium">
          <Textarea
            id="current-report"
            name="current-report"
            label="Current report"
            required
            rows={10}
            placeholder="Paste the latest product report here..."
            onChange={(e) => onChange("currentReport", e.target.value)}
            value={values.currentReport}
          />
        </InnerCard>
        <InnerCard padding="medium">
          <Textarea
            id="previous-report"
            name="previous-report"
            label="Previous report"
            required
            rows={10}
            placeholder="Paste the report you are comparing against..."
            onChange={(e) => onChange("previousReport", e.target.value)}
            value={values.previousReport}
          />
        </InnerCard>
      </div>
      <Button type="submit" centered>
        Compare
      </Button>
    </form>
  );
};
