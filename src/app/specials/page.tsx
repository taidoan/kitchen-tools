"use client";
import type { Special } from "@components/feat/Specials/Form/types";
import { useState } from "react";
import clsx from "clsx";
import {
  Card,
  OuterCard,
  InnerCard,
  Divider,
  Button,
  PrintToggle,
} from "@/components/ui";
import { SpecialsForm } from "@/components/feat/Specials/Form";
import { SpecialsItem } from "@/components/feat/Specials/Form/Item";
import { SpecialsMenu } from "@/components/feat/Specials/Menu";
import { printArea } from "@/lib/utils/printArea";

export default function SpecialsPage() {
  const [activeTab, setActiveTab] = useState<string>("form");
  const [specials, setSpecials] = useState<Special[]>([]);
  const [printTwoPage, setPrintTwoPage] = useState<boolean>(false);

  const handleSpecialsClear = () => {
    setSpecials([]);
  };

  const updateSpecial = (index: number, updates: Partial<Special>) => {
    setSpecials((prev) =>
      prev.map((special, i) =>
        i === index ? { ...special, ...updates } : special
      )
    );
  };

  return (
    <>
      <Card containerClassName={clsx("specials__intro", "page__intro")}>
        <h2>Food Specials Generator</h2>
        <Divider height={4} width={240} />
        <p>
          This tool is designed to help you quickly generate and print out a
          food specials menu for your location by choosing products and
          selecting a discount price. Try to aim to keep the specials below 9,
          you shouldn&apos;t really need to go above that.
        </p>
      </Card>

      <OuterCard className={clsx("form__wrapper")}>
        <InnerCard padding="medium" className={clsx("page__instructions")}>
          <div className={clsx("button__group")}>
            <Button
              enabled={activeTab === "form"}
              onClick={() => setActiveTab("form")}
            >
              Products
            </Button>
            <Button
              enabled={activeTab === "menu"}
              disabled={!specials.length}
              onClick={() => setActiveTab("menu")}
            >
              Specials Menu
            </Button>
            <Button
              disabled={activeTab !== "menu"}
              onClick={() => {
                if (activeTab === "menu") printArea();
              }}
            >
              Print
            </Button>
          </div>
          <p>
            Choose the products you would like to include in your specials menu
            and select a discount price. You can edit the name, description and
            price if needed.
          </p>
          {activeTab === "menu" && (
            <>
              <PrintToggle
                oneLabel="One Page Per Sheet"
                twoLabel="Two Pages Per Sheet"
                oneOnClick={() => setPrintTwoPage(false)}
                twoOnClick={() => setPrintTwoPage(true)}
                status={printTwoPage}
              />
              {printTwoPage && (
                <p>
                  Please ensure you set the <strong>Pages per sheet</strong>{" "}
                  setting to <strong>2</strong> in your print settings.
                </p>
              )}
            </>
          )}
        </InnerCard>

        <InnerCard padding="medium" className={clsx("specials__main")}>
          {activeTab === "form" && (
            <>
              <SpecialsForm specials={specials} setSpecials={setSpecials} />
              {specials.length > 0 && (
                <>
                  <div className={clsx("specials__list")}>
                    {specials.map((special, idx) => (
                      <SpecialsItem
                        key={idx}
                        product={special.product}
                        discount={special.discount}
                        description={special.description}
                        editable={special.editable}
                        onToggleEdit={() => {
                          updateSpecial(idx, { editable: !special.editable });
                        }}
                        onRemove={() => {
                          setSpecials((prev) =>
                            prev.filter((_, i) => i !== idx)
                          );
                        }}
                        updateSpecial={(updates) => updateSpecial(idx, updates)}
                      />
                    ))}
                  </div>
                  <Button
                    onClick={handleSpecialsClear}
                    className="specials__clear"
                  >
                    Clear All
                  </Button>
                </>
              )}
            </>
          )}
          {activeTab === "menu" && (
            <>
              <SpecialsMenu specials={specials} />
              {printTwoPage && (
                <SpecialsMenu
                  specials={specials}
                  className={"specials__menu--two"}
                />
              )}
            </>
          )}
        </InnerCard>
      </OuterCard>
    </>
  );
}
