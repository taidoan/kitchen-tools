import clsx from "clsx";
import scss from "./style.module.scss";

type CardProps = {
  children: React.ReactNode;
  textAlign?: "left" | "center" | "right";
  style?: React.CSSProperties;
  grow?: boolean;
  className?: string;
};

const Card = ({
  children,
  textAlign = "left",
  style,
  grow,
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
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Card;
