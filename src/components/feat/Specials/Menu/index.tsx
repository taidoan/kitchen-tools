import type { Special } from "@components/feat/Specials/Form/types";
import clsx from "clsx";
import style from "./style.module.scss";

type SpecialsMenuProps = {
  specials: Special[];
  className?: string;
};

export const SpecialsMenu = ({ specials, className }: SpecialsMenuProps) => {
  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className={clsx(style.menu, className)}>
      <div className={style.menu__frame}>
        <header className={style.menu__header}>
          <p className={style.menu__date}>{formattedDate}</p>
          <h2 className={style.title}>Food Specials</h2>
          <span className={style.menu__rule} aria-hidden="true" />
        </header>
        <div className={style.menu__list}>
          {specials.map((special) => (
            <article key={special.product} className={style.menu__item}>
              <h3 className={style["menu__item-title"]}>{special.product}</h3>
              <p className={style["menu__item-description"]}>
                {special.description}
              </p>
              <p className={style["menu__item-price"]}>
                £{special.discount} off
              </p>
            </article>
          ))}
        </div>
        <footer className={style.menu__footer}>
          <p>
            A drink may be included with this discount. Ask at the bar for
            details.
          </p>
          <p className={style.menu__availability}>
            Available while stocks last
          </p>
        </footer>
      </div>
    </div>
  );
};
