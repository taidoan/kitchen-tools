import clsx from "clsx";
import style from "./style.module.scss";

type ControlButtonProps = {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size: "small" | "medium" | "large";
  type?: "close";
  "aria-label"?: string;
};

export const ControlButton = ({
  className,
  children,
  onClick,
  disabled,
  size = "medium",
  type,
  "aria-label": ariaLabel,
}: ControlButtonProps) => {
  const classes = clsx(
    style.button,
    className,
    disabled && style.disabled,
    style[`button--${size}`],
    style[`button--${type}`]
  );
  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
