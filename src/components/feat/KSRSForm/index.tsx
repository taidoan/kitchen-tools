"use client";
import type { KSRSForm as KSRSFormProps, FormData } from "./types";

import clsx from "clsx";
import style from "./style.module.scss";
import * as config from "@config";
import { useState } from "react";
import { OuterCard, InnerCard } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { parseServiceSummary } from "@/lib/utils/parseServiceSummary";
import { parseProductivityData } from "@/lib/utils/parseProductivity";

export const KSRSForm = ({
  onSubmit,
  submitted,
  initialValues = {},
}: KSRSFormProps) => {
  const [activeTab, setActiveTab] = useState<string>("dataEntry");

  const [formData, setFormData] = useState<FormData>(
    () =>
      ({
        ...config.DEFAULT_FORM_OPTIONS,
        ...initialValues,
      } as FormData)
  );

  const [error, setError] = useState<string>("");

  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const inputFields = [
    { id: "sales", label: "Actual Sales", type: "number" },
    { id: "salesForecast", label: "Sales Forecast", type: "number" },
  ];

  const selectFields = [
    {
      id: "lateTarget",
      label: "Late Order Target",
      options: config.LATE_TARGET_OPTIONS,
    },
    {
      id: "prepTarget",
      label: "Preparation Target",
      options: config.PREP_TARGET_OPTIONS(formData.foodLift),
    },
  ];

  const checkboxFields = [
    { id: "kitLates", label: "Kitchen Lates", field: "kitLates" },
    { id: "floorLates", label: "Floor Lates", field: "floorLates" },
    { id: "foodLift", label: "Food Lift", field: "foodLift" },
    { id: "holds", label: "Manual Holds", field: "manualHolds" },
  ] as const;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!formData.copiedServiceData.trim()) {
      setError("Please enter Service Summary Data");
      return;
    }

    if (!formData.copiedProductivityData.trim()) {
      setError("Please enter Productivity Data");
      return;
    }

    try {
      const parsedServiceSummary = parseServiceSummary(
        formData.copiedServiceData
      );
      const parsedProductivityData = parseProductivityData(
        formData.copiedProductivityData
      );

      onSubmit({
        ...formData,
        parsedServiceSummary,
        parsedProductivityData,
      });

      setActiveTab("result");
    } catch (err) {
      setError((err as Error).message);
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit} className={style.form}>
      <div className={style.row}>
        {inputFields.map((f) => {
          const fieldValue = formData[f.id as keyof FormData];
          const inputValue =
            typeof fieldValue === "number" || typeof fieldValue === "string"
              ? fieldValue
              : "";

          return (
            <InnerCard key={f.id} padding="small">
              <Input
                id={f.id}
                label={f.label}
                type={f.type}
                placeholder={f.id === "sales" ? "10,000" : "15,000"}
                value={inputValue as string | number}
                onChange={(e) => {
                  if (f.type === "number") {
                    updateField(f.id as keyof FormData, Number(e.target.value));
                  } else {
                    updateField(f.id as keyof FormData, e.target.value);
                  }
                }}
              />
            </InnerCard>
          );
        })}
      </div>

      <div className={style.row}>
        {selectFields.map((f) => (
          <InnerCard key={f.id} padding="small">
            <Select
              id={f.id}
              label={f.label}
              required
              value={formData[f.id as keyof FormData] as number}
              onChange={(e) =>
                updateField(f.id as keyof FormData, Number(e.target.value))
              }
            >
              {f.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </InnerCard>
        ))}
      </div>

      <div className={style.row}>
        {checkboxFields.map(({ id, label, field }) => (
          <InnerCard key={id} className={style.checkboxCard} padding="small">
            <Checkbox
              id={id}
              label={label}
              checked={formData[field]}
              onChange={(e) => updateField(field, e.target.checked)}
            />
          </InnerCard>
        ))}
      </div>

      <div className={style.row}>
        <InnerCard padding="small">
          <Textarea
            id="prodData"
            label="Productivity Data"
            required
            rows={6}
            placeholder="Enter productivity data here..."
            value={formData.copiedProductivityData}
            onChange={(e) =>
              updateField("copiedProductivityData", e.target.value)
            }
          />
        </InnerCard>
      </div>

      <div className={style.row}>
        <InnerCard padding="small">
          <Textarea
            id="serviceData"
            label="Service Data"
            required
            rows={6}
            placeholder="Enter service summary data here..."
            value={formData.copiedServiceData}
            onChange={(e) => updateField("copiedServiceData", e.target.value)}
          />
        </InnerCard>
      </div>

      {error && <p className={style.error}>{error}</p>}

      <Button type="submit" centered>
        Submit
      </Button>
    </form>
  );
};
