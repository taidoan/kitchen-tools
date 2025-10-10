import clsx from "clsx";
import scss from "./style.module.scss";

type CardProps = {
  children: React.ReactNode;
  textAlign?: "left" | "center" | "right";
  style?: React.CSSProperties;
  grow?: boolean;
  className?: string;
  padding?: "small" | "medium" | "large";
};

const Card = ({
  children,
  textAlign = "left",
  style,
  grow,
  padding,
  className,
}: CardProps) => {
  return (
    <div
      className={clsx(scss.card__outer, { [scss.card__grow]: grow })}
      style={style}
    >
      <div
        className={clsx(
          scss.card__inner,
          [`text-align--${textAlign}`],
          className,
          padding && scss[`card__inner--padding-${padding}`]
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Card;

export const OuterCard = ({ children, style, className, grow }: CardProps) => {
  return (
    <div
      className={clsx(scss.card__outer, className, { [scss.card__grow]: grow })}
      style={style}
    >
      {children}
    </div>
  );
};

export const InnerCard = ({
  children,
  style,
  className,
  textAlign,
  padding,
}: CardProps) => {
  return (
    <div
      className={clsx(
        scss.card__inner,
        [`text-align--${textAlign}`],
        className,
        padding && scss[`card__inner--padding-${padding}`]
      )}
      style={style}
    >
      {children}
    </div>
  );
};
