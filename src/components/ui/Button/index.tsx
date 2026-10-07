"use client";
import Link from "next/link";
import clsx from "clsx";
import style from "./style.module.scss";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  enabled?: boolean;
  centered?: boolean;
  variant?: "primary" | "secondary";
  size?: "default" | "small" | "icon";
}

export const Button = ({
  href,
  onClick,
  disabled,
  children,
  className,
  enabled,
  centered,
  type = "button",
  variant = "primary",
  size = "default",
  "aria-label": ariaLabel,
}: ButtonProps) => {
  const classes = clsx(
    style.button,
    className,
    disabled && style.disabled,
    enabled && style["button--enabled"],
    centered && style["button--centered"],
    variant === "secondary" && style["button--secondary"],
    size === "small" && style["button--small"],
    size === "icon" && style["button--icon"]
  );
  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        aria-label={ariaLabel}
        onClick={disabled ? (e) => e.preventDefault() : undefined}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
