import clsx from "clsx";
import style from "./style.module.scss";

type ControlButtonProps = {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size: "small" | "medium" | "large";
  type?: "close";
};

export const ControlButton = ({
  className,
  children,
  onClick,
  disabled,
  size = "medium",
  type,
}: ControlButtonProps) => {
  const classes = clsx(
    style.button,
    className,
    disabled && style.disabled,
    style[`button--${size}`],
    style[`button--${type}`]
  );
  return (
    <button className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
