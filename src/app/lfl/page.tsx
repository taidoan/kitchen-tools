"use client";

import { useState } from "react";
import clsx from "clsx";
import { processProductSalesCSV } from "@/lib/utils/csv";
import { compareLFL, type ComparedProduct } from "@/lib/utils/compareLFL";
import {
  Button,
  Card,
  Divider,
  ExportButtons,
  InnerCard,
  OuterCard,
} from "@/components/ui";
import { LFLForm, LFLResult } from "@/components/feat/LFL";
import type { LFLFormValues } from "@/components/feat/LFL/Form";

const emptyFormValues: LFLFormValues = {
  currentReport: "",
  previousReport: "",
  currentFrom: "",
  currentTo: "",
  previousFrom: "",
  previousTo: "",
};

export default function LFLPage() {
  const [activeTab, setActiveTab] = useState<string>("dataEntry");
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<LFLFormValues>(emptyFormValues);
  const [resultRows, setResultRows] = useState<ComparedProduct[] | null>(null);
  const [reportDates, setReportDates] = useState({
    currentFrom: "",
    currentTo: "",
    previousFrom: "",
    previousTo: "",
  });

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const currentReport = (formData.get("current-report") as string) || "";
    const previousReport = (formData.get("previous-report") as string) || "";

    const current = processProductSalesCSV(currentReport);
    const previous = processProductSalesCSV(previousReport);

    setReportDates({
      currentFrom: formValues.currentFrom,
      currentTo: formValues.currentTo,
      previousFrom: formValues.previousFrom,
      previousTo: formValues.previousTo,
    });
    setResultRows(compareLFL(previous.items, current.items));
    setFormSubmitted(true);
    setActiveTab("result");
  };

  const handleFormChange = (field: keyof LFLFormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Card containerClassName="page__intro">
        <div className="page__heading">
          <h2>Like-for-like comparison</h2>
          <Divider height={4} width={240} />
        </div>
        <p>
          Paste or upload two Aztec <strong>Product Sales</strong> reports to
          see how quantity and sales have changed. Use any matching date range
          — a week, month, period or year. You can compare individual
          products, one or more categories, or the full report.
        </p>
      </Card>
      <OuterCard className={clsx("form__wrapper")}>
        <InnerCard padding="medium" className={clsx("page__instructions")}>
          <div className={clsx("button__group")}>
            <Button
              onClick={() => setActiveTab("dataEntry")}
              enabled={activeTab === "dataEntry"}
            >
              Data Entry
            </Button>
            <Button
              onClick={() => setActiveTab("result")}
              enabled={activeTab === "result"}
              disabled={!formSubmitted}
            >
              Results
            </Button>
            <ExportButtons
              disabled={activeTab !== "result"}
              filename="LFL comparison"
            />
          </div>
          <p>
            Paste or upload the <strong>current report</strong> first, then
            the <strong>previous report</strong>. Date ranges are optional and
            show on the results and print. Include the header row from Aztec.
          </p>
        </InnerCard>
        <InnerCard padding="medium" className={clsx("lfl__main")}>
          {activeTab === "dataEntry" && (
            <LFLForm
              onSubmit={handleFormSubmit}
              values={formValues}
              onChange={handleFormChange}
            />
          )}
          {activeTab === "result" && resultRows && (
            <LFLResult rows={resultRows} dates={reportDates} />
          )}
        </InnerCard>
      </OuterCard>
    </>
  );
}
