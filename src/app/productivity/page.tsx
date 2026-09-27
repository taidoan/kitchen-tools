"use client";
import type {
  FormData as FormDataProps,
  ServiceSummary,
  ProductivityData,
} from "@components/feat/Productivity/types";

import { useState } from "react";
import { KSRSForm, ProductivityResult } from "@/components/feat/Productivity";
import { Card, OuterCard, InnerCard, Divider, Button } from "@/components/ui";
import clsx from "clsx";
import { printArea } from "@/lib/utils/printArea";
export default function Productivity() {
  const [formData, setFormData] = useState<FormDataProps | null>(null);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("dataEntry");

  const handleFormSubmit = (data: FormDataProps) => {
    setFormData(data);
    setActiveTab("result");
    setFormSubmitted(true);
  };

  return (
    <>
      <Card containerClassName="page__intro">
        <div className="page__heading">
          <h2>Food Delivery Times</h2>
          <Divider height={4} width={240} />
        </div>
        <p>
          Build a kitchen productivity report from KSRS data. For print, turn
          on <strong>Headers and footers</strong> and{" "}
          <strong>Background graphics</strong> so the colours print.
        </p>
      </Card>
      <OuterCard className="form__wrapper">
        <InnerCard padding="medium" className={clsx("page__instructions")}>
          <div className={clsx("button__group")}>
            <Button
              onClick={() => setActiveTab("dataEntry")}
              enabled={activeTab === "dataEntry"}
            >
              Data Entry
            </Button>
            <Button
              onClick={() => {
                if (formSubmitted) {
                  setActiveTab("result");
                }
              }}
              disabled={!formSubmitted}
              enabled={activeTab === "result"}
            >
              Results
            </Button>
            <Button
              disabled={activeTab !== "result"}
              onClick={() => {
                if (activeTab === "result") printArea();
              }}
            >
              Print
            </Button>
          </div>
          <p>
            Set sales and performance targets, choose optional extras, then
            paste the data <strong>copied directly</strong> from KSRS.
          </p>
        </InnerCard>
        <InnerCard padding="medium" className={clsx("fdt__main")}>
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
                      lateTarget: formData.lateTarget,
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
              lateTarget={formData?.lateTarget || 25}
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
        </InnerCard>
      </OuterCard>
    </>
  );
}
