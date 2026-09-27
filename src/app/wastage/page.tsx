"use client";

import type { WastageResultItem } from "@components/feat/Wastage/types";

import { useState } from "react";
import clsx from "clsx";
import { Card, OuterCard, InnerCard, Divider, Button } from "@/components/ui";
import { WastageForm, WastageResult } from "@/components/feat/Wastage";

import { printArea } from "@/lib/utils/printArea";
import { parseWastageEntries } from "@/lib/utils/parseWastage";

export default function WastagePage() {
  const [activeTab, setActiveTab] = useState<string>("dataEntry");
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [parsedResults, setParsedResults] = useState<WastageResultItem[]>([]);
  const [displayMode, setDisplayMode] = useState<string>("aggregated");
  const [topItems, setTopItems] = useState<number>(15);
  const [showAllItems, setShowAllItems] = useState<boolean>(false);

  const [formValues, setFormValues] = useState({
    wastageData: "",
  });

  const handleFormChange = (field: string, value: string | number) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    setActiveTab("result");

    const parsed = parseWastageEntries(formValues.wastageData);
    setParsedResults(parsed);
  };

  return (
    <>
      <Card containerClassName={clsx("wastage__intro", "page__intro")}>
        <div className="page__heading">
          <h2>Wastage Analysis</h2>
          <Divider height={4} width={240} />
        </div>
        <p>
          Review kitchen wastage from the <strong>COGNOS</strong> wastage
          report. Useful for stock tracking and spotting where waste is high.
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
            Choose how to group the results, then paste the wastage data copied
            from <strong>COGNOS</strong>.
          </p>
        </InnerCard>

        <InnerCard padding="medium" className={clsx("wastage__main")}>
          {activeTab === "dataEntry" && (
            <WastageForm
              onSubmit={handleFormSubmit}
              values={formValues}
              onChange={handleFormChange}
              displayMode={displayMode}
              setDisplayMode={setDisplayMode}
              topItems={topItems}
              setTopItems={setTopItems}
              showAllItems={showAllItems}
              setShowAllItems={setShowAllItems}
            />
          )}

          {activeTab === "result" && parsedResults.length > 0 && (
            <WastageResult
              result={parsedResults}
              displayMode={displayMode}
              topItems={topItems}
              showAllItems={showAllItems}
            />
          )}

          {activeTab === "result" && parsedResults.length === 0 && (
            <p>No wastage data available.</p>
          )}
        </InnerCard>
      </OuterCard>
    </>
  );
}
