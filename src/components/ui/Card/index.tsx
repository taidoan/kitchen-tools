import clsx from "clsx";
import style from "./style.module.scss";

const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={clsx(style.card__outer)}>
      <div className={clsx(style.card__inner)}>{children}</div>
    </div>
  );
};

export default Card;
