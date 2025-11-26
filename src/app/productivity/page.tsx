"use client";
import type { ServiceSummary, ProductivityData } from "./types";
import type { FormData as FormDataProps } from "@/components/feat/KSRSForm/types";

import { useState } from "react";
import { Container, MainContentContainer } from "@/components/layout/Container";
import { Sidebar } from "@/components/layout/Sidebar";
import Card, { OuterCard, InnerCard } from "@/components/ui/Card";
import { KSRSForm } from "@/components/feat/KSRSForm";
import { ProductivityResult } from "@/components/feat/ProductivityResult";
import { Divider } from "@/components/ui/Divider";
import { Button } from "@/components/ui/Button";
import style from "./../../components/feat/KSRSForm/style.module.scss";
import clsx from "clsx";
export default function Productivity() {
  const [formData, setFormData] = useState<FormDataProps | null>(null);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("dataEntry");

  const handleFormSubmit = (data: FormDataProps) => {
    console.log(data);
    setFormData(data);
    setActiveTab("result");
    setFormSubmitted(true);
  };

  return (
    <Container>
      <Sidebar />
      <MainContentContainer>
        <Card>
          <h2>Food Delivery Times</h2>
          <Divider height={4} width={240} />
          <p>
            This tool generates productivity reports for your kitchens using
            KSRS data. To ensure that colors are retained when printing, please
            enable both &quot;Headers and Footers&quot; and &quot;Background
            Graphics&quot; in your print settings.
          </p>
        </Card>
        <OuterCard className={clsx(style.form)}>
          <InnerCard padding="medium" className={clsx(style["intro"])}>
            <div className={clsx(style["button__group"])}>
              <Button onClick={() => setActiveTab("dataEntry")}>
                Data Entry
              </Button>
              <Button
                onClick={() => {
                  if (formSubmitted) {
                    setActiveTab("result");
                  }
                }}
                disabled={!formSubmitted}
              >
                Result
              </Button>
              <Button disabled={activeTab !== "result"}>Print</Button>
            </div>
            <p>
              Set your sales and performance targets, select any optional
              information to display, and enter the data{" "}
              <strong>copied directly</strong> from KSRS into the fields below.
            </p>
          </InnerCard>
          {activeTab === "dataEntry" ? (
            <KSRSForm
              onSubmit={handleFormSubmit}
              submitted={formSubmitted}
              activeTab={activeTab}
              initialValues={
                formData
                  ? {
                      sales: formData.sales,
                      salesForecast: formData.salesForecast,
                      latesTarget: formData.latesTarget,
                      prepTarget: formData.prepTarget,
                      foodLift: formData.foodLift,
                      kitLates: formData.kitLates,
                      floorLates: formData.floorLates,
                      manualHolds: formData.manualHolds,
                      copiedServiceData: formData.copiedServiceData,
                      copiedProductivityData: formData.copiedProductivityData,
                    }
                  : {}
              }
            />
          ) : (
            <ProductivityResult
              sales={formData?.sales || null}
              salesTarget={formData?.salesForecast || null}
              lateTarget={formData?.latesTarget || 25}
              prepTarget={formData?.prepTarget || 8}
              foodLift={formData?.foodLift || false}
              kitLates={formData?.kitLates || false}
              manualHolds={formData?.manualHolds || true}
              floorLates={formData?.floorLates || false}
              serviceSummary={
                formData?.parsedServiceSummary || ({} as ServiceSummary)
              }
              productivity={
                formData?.parsedProductivityData || ({} as ProductivityData)
              }
            />
          )}
        </OuterCard>
      </MainContentContainer>
    </Container>
  );
}
