import { NavItem } from "@/components/ui/NavItem";
import clsx from "clsx";

type NavBarProps = {
  collapsed?: boolean;
} & React.ComponentProps<"nav">;

export const NavBar = ({ collapsed, className }: NavBarProps) => {
  return (
    <nav className={clsx("navigation", className)}>
      <ul className="navigation__list">
        <li className="navigation__item">
          <NavItem href="/" type="home" collapsed={collapsed}>
            Home
          </NavItem>
        </li>
        <li className="navigation__item">
          <NavItem href="/productivity" type="fdt" collapsed={collapsed}>
            FDT
          </NavItem>
        </li>
        <li className="navigation__item">
          <NavItem href="/lfl" type="lfl" collapsed={collapsed}>
            LFL
          </NavItem>
        </li>
        <li className="navigation__item">
          <NavItem href="/sales" type="sales" collapsed={collapsed}>
            Sales
          </NavItem>
        </li>
        <li className="navigation__item">
          <NavItem href="/specials" type="special" collapsed={collapsed}>
            Specials
          </NavItem>
        </li>
        <li className="navigation__item">
          <NavItem href="/wastage" type="wastage" collapsed={collapsed}>
            Wastage
          </NavItem>
        </li>
      </ul>
    </nav>
  );
};
