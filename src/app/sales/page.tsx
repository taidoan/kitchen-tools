"use client";
import type { SalesResult } from "./types";
import { useState } from "react";
import clsx from "clsx";
import Card, { OuterCard, InnerCard } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { Button } from "@/components/ui/Button";
import { SalesForm } from "@/components/feat/SalesForm";
import { SalesResultComponent } from "@/components/feat/SalesResult";
import { processCsv } from "@/lib/utils/csv";
import { printArea } from "@/lib/utils/printArea";

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState<string>("dataEntry");
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({
    topItems: 5,
    salesData: "",
  });
  const [resultData, setResultData] = useState<SalesResult | null>(null);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const numberOfItems = Number(formData.get("top-items")) || 5;
    const salesData = (formData.get("sales-data") as string) || "";

    const result = processCsv(salesData, numberOfItems) as SalesResult;
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
        <h2>Sales Overview</h2>
        <Divider height={4} width={240} />
        <p>
          This tool just simply lists out the top products by quantity sold and
          by value of sales. It is designed to be used with sales data exported
          from the <strong>Product Sales</strong> report available on Aztec
          Reporting. You will need to drill down into either food or bar sales
          on the report before exporting.
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
            Please enter the number of top products to display (max 30) and
            paste the data from the <strong>CSV</strong> file you&apos;ve
            exported from Aztec Reporting into the text area below. It is best
            to print this report in portrait mode for better readability.
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
            <SalesResultComponent resultData={resultData} />
          )}
        </InnerCard>
      </OuterCard>
    </>
  );
}
