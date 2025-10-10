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
};

export const NavItem = ({
  children,
  href,
  type,
  active,
  collapsed,
}: NavItemProps) => {
  const pathname = usePathname();

  return (
    <Link
      className={clsx(style["nav-item"], {
        [style["nav-item--active"]]: pathname === href,
      })}
      href={href}
      data-collapsed={collapsed}
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
