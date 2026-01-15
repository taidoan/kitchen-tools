import type { Special } from "@components/feat/Specials/Form/types";
import { Divider } from "@/components/ui";
import clsx from "clsx";
import style from "./style.module.scss";

type SpecialsMenuProps = {
  specials: Special[];
  className?: string;
};

export const SpecialsMenu = ({ specials, className }: SpecialsMenuProps) => {
  const date = new Date();
  const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(
    date.getMonth() + 1
  ).padStart(2, "0")}/${date.getFullYear()}`;

  return (
    <div className={clsx(style.menu, className)}>
      <div>
        <span className={style.menu__date}>{formattedDate}</span>
        <h2 className={clsx(style.title)}>Food Specials</h2>
        <Divider height={4} className={style.menu__divider} />
      </div>
      <div className={clsx(style.menu__list)}>
        {specials.map((special) => (
          <div key={special.product} className={clsx(style.menu__item)}>
            <h3 className={clsx(style["menu__item-title"])}>
              {special.product}
            </h3>
            <p className={clsx(style["menu__item-description"])}>
              {special.description}{" "}
              <strong>£{special.discount} Discount</strong>
            </p>
          </div>
        ))}
      </div>
      <p>
        A drink{" "}
        <strong>
          <u>may</u>
        </strong>{" "}
        be included with this discount. Ask at the bar for details.
        <br />
        <span className={style.menu__highlight}>
          Available while stock lasts.
        </span>
      </p>
    </div>
  );
};
