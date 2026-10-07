"use client";
import type { SalesResult } from "@components/feat/Sales/types";
import { useState } from "react";
import clsx from "clsx";
import { Card, OuterCard, InnerCard, Divider, Button } from "@/components/ui";
import { SalesForm, SalesResultComponent } from "@/components/feat/Sales";
import { processCsv } from "@/lib/utils/csv";
import { printArea } from "@/lib/utils/printArea";

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState<string>("dataEntry");
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({
    topItems: 5,
    salesData: "",
    from: "",
    to: "",
  });
  const [resultData, setResultData] = useState<SalesResult | null>(null);
  const [reportDates, setReportDates] = useState({ from: "", to: "" });

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const numberOfItems = Number(formData.get("top-items")) || 5;
    const salesData = (formData.get("sales-data") as string) || "";

    const result = processCsv(salesData, numberOfItems) as SalesResult;

    setReportDates({ from: formValues.from, to: formValues.to });
    setResultData(result);
    setFormSubmitted(true);
    setActiveTab("result");
  };

  const handleFormChange = (field: string, value: string | number) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Card containerClassName="page__intro">
        <div className="page__heading">
          <h2>Sales Overview</h2>
          <Divider height={4} width={240} />
        </div>
        <p>
          Lists the top products by quantity sold and by sales value. Use a
          food or bar <strong>Product Sales</strong> export from Aztec
          Reporting. Paste the data or upload a CSV.
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
            <Button
              onClick={() => {
                if (activeTab === "result") printArea();
              }}
              disabled={activeTab !== "result"}
            >
              Print
            </Button>
          </div>
          <p>
            Choose how many products to show (max 30), then paste or upload
            the Aztec export. Date range is optional and shows on the results
            and print. Print in portrait for the clearest layout.
          </p>
        </InnerCard>
        <InnerCard padding="medium" className={clsx("sales__main")}>
          {activeTab === "dataEntry" && (
            <SalesForm
              onSubmit={handleFormSubmit}
              values={formValues}
              onChange={handleFormChange}
            />
          )}
          {activeTab === "result" && resultData && (
            <SalesResultComponent resultData={resultData} dates={reportDates} />
          )}
        </InnerCard>
      </OuterCard>
    </>
  );
}
