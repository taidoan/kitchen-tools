import clsx from "clsx";
import { Card, OuterCard, InnerCard, Divider, Button } from "@/components/ui";
import { SpecialsForm } from "@/components/feat/Specials/Form";

export default function SpecialsPage() {
  return (
    <>
      <Card containerClassName={clsx("specials__intro", "page__intro")}>
        <h2>Specials</h2>
        <Divider height={4} width={240} />
        <p>
          This tool is designed to help you quickly generate and print out a
          food specials menu for your location by choosing products and
          selecting a discount price.
        </p>
      </Card>

      <OuterCard className={clsx("form__wrapper")}>
        <InnerCard padding="medium" className={clsx("page__instructions")}>
          <div className={clsx("button__group")}>
            <Button>Products</Button>
            <Button disabled>Specials</Button>
            <Button disabled>Print</Button>
          </div>
          <p>
            Choose the products you would like to include in your specials menu
            and select a discount price. You can edit the description if needed.
          </p>
        </InnerCard>

        <InnerCard padding="medium" className={clsx("wastage__main")}>
          <SpecialsForm />
        </InnerCard>
      </OuterCard>
    </>
  );
}
