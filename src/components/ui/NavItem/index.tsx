"use client";

import Link from "next/link";
import style from "./style.module.scss";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { Icon } from "../Icon";

type NavItemProps = {
  children: React.ReactNode;
  href: string;
  type?: "home" | "fdt" | "special" | "sales" | "wastage";
  active?: boolean;
  collapsed?: boolean;
  disabled?: boolean;
};

export const NavItem = ({
  children,
  href,
  type,
  active,
  collapsed,
  disabled,
}: NavItemProps) => {
  const pathname = usePathname();

  return (
    <Link
      className={clsx(style["nav-item"], {
        [style["nav-item--active"]]: pathname === href,
        [style["nav-item--disabled"]]: disabled,
      })}
      href={href}
      data-collapsed={collapsed}
      aria-disabled={disabled}
    >
      {type && (
        <Icon
          variant={type}
          size={collapsed ? "base" : "small"}
          color={active ? "light" : "default"}
        />
      )}
      <span className={style["nav-item__text"]}>{children}</span>
    </Link>
  );
};
