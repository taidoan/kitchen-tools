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
  ExportButtons,
} from "@/components/ui";
import { SpecialsForm } from "@/components/feat/Specials/Form";
import { SpecialsItem } from "@/components/feat/Specials/Form/Item";
import { SpecialsMenu } from "@/components/feat/Specials/Menu";
import {
  SpecialsPalette,
  type SpecialsPaletteId,
} from "@/components/feat/Specials/Palette";
export default function SpecialsPage() {
  const [activeTab, setActiveTab] = useState<string>("form");
  const [specials, setSpecials] = useState<Special[]>([]);
  const [printTwoPage, setPrintTwoPage] = useState<boolean>(false);
  const [palette, setPalette] = useState<SpecialsPaletteId>("navy");

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
        <div className="page__heading">
          <h2>Food Specials Generator</h2>
          <Divider height={4} width={240} />
        </div>
        <p>
          Build a printable specials menu. Pick a listed product or type a
          custom item, then set a discount. Keep it to about 9 items if you
          can.
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
            <ExportButtons
              disabled={activeTab !== "menu"}
              filename="Specials menu"
            />
          </div>
          <p>
            Choose a product from the list or type a custom name. You can still
            edit the name, description and price afterwards.
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
              <SpecialsPalette value={palette} onChange={setPalette} />
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
              <SpecialsMenu specials={specials} palette={palette} />
              {printTwoPage && (
                <SpecialsMenu
                  specials={specials}
                  palette={palette}
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
