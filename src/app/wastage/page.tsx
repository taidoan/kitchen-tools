"use client";

import { useState } from "react";
import clsx from "clsx";
import Card, { OuterCard, InnerCard } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { Button } from "@/components/ui/Button";
import { printArea } from "@/lib/utils/printArea";

export default function WastagePage() {
  const [activeTab, setActiveTab] = useState<string>("dataEntry");
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  return (
    <>
      <Card containerClassName="wastage__intro">
        <h2>Wastage Analysis</h2>
        <Divider height={4} width={240} />
        <p>
          This tool is designed to help you analyze and track food wastage in
          your kitchen. By inputting your wastage data from the wastage report
          available on <strong>COGNOS</strong>. This might be usefuly for
          setting up your stock tracker or identifying areas where wastage can
          be reduced.
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
            Please enter the number of top wasted items you would like to see in
            the results, along with the wastage data copied from the{" "}
            <strong>COGNOS</strong> wastage report. The default and minimum
            number of items is 15 (the number of products to show on the stock
            tracker).
          </p>
        </InnerCard>
        <InnerCard padding="medium" className={clsx("wastage__main")}>
          form here
        </InnerCard>
      </OuterCard>
    </>
  );
}
