import Link from "next/link";
import style from "./style.module.scss";
import {
  IconClockHour1Filled,
  IconCoinPoundFilled,
  IconDiscountFilled,
  IconTrashFilled,
  IconHomeFilled,
} from "@tabler/icons-react";
import { JSX } from "react";
import { clsx } from "clsx";

type NavItemProps = {
  children: React.ReactNode;
  href: string;
  type?: "home" | "fdt" | "special" | "sales" | "wastage";
  active?: boolean;
  collapsed?: boolean;
};

const ICON_MAP: Record<string, JSX.Element> = {
  home: <IconHomeFilled className={style.icon} />,
  fdt: <IconClockHour1Filled className={style.icon} />,
  special: <IconDiscountFilled className={style.icon} />,
  sales: <IconCoinPoundFilled className={style.icon} />,
  wastage: <IconTrashFilled className={style.icon} />,
};

export const NavItem = ({
  children,
  href,
  type,
  active,
  collapsed,
}: NavItemProps) => {
  const icon = type ? ICON_MAP[type] : null;
  return (
    <Link
      className={clsx(style["nav-item"], {
        [style["nav-item--active"]]: active,
      })}
      href={href}
      data-collapsed={collapsed}
    >
      {icon ?? icon}
      {children}
    </Link>
  );
};
