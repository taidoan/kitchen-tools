import clsx from "clsx";
import scss from "./style.module.scss";

type CardProps = {
  children: React.ReactNode;
  textAlign?: "left" | "center" | "right";
  style?: React.CSSProperties;
  grow?: boolean;
};

const Card = ({ children, textAlign = "left", style, grow }: CardProps) => {
  return (
    <div
      className={clsx(scss.card__outer, { [scss.card__grow]: grow })}
      style={style}
    >
      <div className={clsx(scss.card__inner, [`text-align--${textAlign}`])}>
        {children}
      </div>
    </div>
  );
};

export default Card;
