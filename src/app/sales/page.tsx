"use client";

import clsx from "clsx";
import { Container, MainContentContainer } from "@/components/layout/Container";
import { Sidebar } from "@/components/layout/Sidebar";
import Card, { OuterCard, InnerCard } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { SalesForm } from "@/components/feat/SalesForm";

export default function SalesPage() {
  return (
    <Container>
      <Sidebar />
      <MainContentContainer>
        <Card containerClassName="sales__intro">
          <h2>Sales Overview</h2>
          <Divider height={4} width={240} />
          <p>
            This tool just simply lists out the top products by quantity sold
            and by value of sales. It is designed to be used with sales data
            exported from the &apos;Product Sales&apos; report available on
            Aztec Reporting. Simply copy and paste the data from Excel into the
            text area below. (Max 15 products)
          </p>
        </Card>
        <OuterCard className={clsx("sales__form")}>
          <InnerCard padding="medium" className={clsx("sales__main")}>
            <SalesForm />
          </InnerCard>
        </OuterCard>
      </MainContentContainer>
    </Container>
  );
}
