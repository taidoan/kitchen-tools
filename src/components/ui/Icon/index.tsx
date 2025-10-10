import clsx from "clsx";
import scss from "./style.module.scss";

import { JSX } from "react";
import {
  IconClockHour1Filled,
  IconCoinPoundFilled,
  IconDiscountFilled,
  IconTrashFilled,
  IconHomeFilled,
} from "@tabler/icons-react";

type IconProps = {
  variant: "home" | "fdt" | "special" | "sales" | "wastage";
  size?: "small" | "base" | "medium" | "large";
  color?: "default" | "dark" | "light" | "primary";
  style?: React.CSSProperties;
  className?: string;
};

export const Icon = ({
  variant,
  size = "medium",
  color = "default",
  style,
  className,
}: IconProps) => {
  const classes = clsx(
    scss.icon,
    scss[`icon-size--${size}`],
    scss[`icon-clr--${color}`],
    className
  );

  const ICON_MAP: Record<string, JSX.Element> = {
    home: <IconHomeFilled className={classes} style={style} />,
    fdt: <IconClockHour1Filled className={classes} style={style} />,
    special: <IconDiscountFilled className={classes} style={style} />,
    sales: <IconCoinPoundFilled className={classes} style={style} />,
    wastage: <IconTrashFilled className={classes} style={style} />,
  };

  const icon = ICON_MAP[variant] || null;
  return icon;
};
