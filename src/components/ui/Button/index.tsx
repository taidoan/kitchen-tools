"use client";
import Link from "next/link";
import clsx from "clsx";
import style from "./style.module.scss";

export type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  enabled?: boolean;
};

export const Button = ({
  href,
  onClick,
  disabled,
  children,
  className,
  enabled,
}: ButtonProps) => {
  const classes = clsx(
    style.button,
    className,
    disabled && style.disabled,
    enabled && style["button--enabled"]
  );
  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        onClick={disabled ? (e) => e.preventDefault() : undefined}
      >
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
