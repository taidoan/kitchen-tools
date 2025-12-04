"use client";

import { useState } from "react";
import clsx from "clsx";
import Card, { OuterCard, InnerCard } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { Button } from "@/components/ui/Button";
import { SalesForm } from "@/components/feat/SalesForm";

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState<string>("dataEntry");
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  return (
    <>
      <Card containerClassName="sales__intro">
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
        <InnerCard padding="medium" className={clsx("sales__instructions")}>
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
              onClick={() => setActiveTab("print")}
              disabled={activeTab !== "result"}
            >
              Print
            </Button>
          </div>
          <p>
            Please enter the number of top products to display (max 15) and
            paste the data from the <strong>CSV</strong> file you&apos;ve
            exported from Aztec Reporting into the text area below.
          </p>
        </InnerCard>
        <InnerCard padding="medium" className={clsx("sales__main")}>
          <SalesForm />
        </InnerCard>
      </OuterCard>
    </>
  );
}
