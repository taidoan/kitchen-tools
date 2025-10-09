import { NavItem } from "@/components/ui/NavItem";

type NavBarProps = {
  collapsed?: boolean;
};

export const NavBar = ({ collapsed }: NavBarProps) => {
  return (
    <nav className="navigation">
      <ul className="navigation__list">
        <li className="navigation__item">
          <NavItem href="/" type="home" collapsed={collapsed}>
            Home
          </NavItem>
        </li>
        <li className="navigation__item">
          <NavItem href="/productivity" type="fdt" active collapsed={collapsed}>
            FDTs
          </NavItem>
        </li>
        <li className="navigation__item">
          <NavItem href="/sales" type="sales" collapsed={collapsed}>
            Sales Report
          </NavItem>
        </li>
        <li className="navigation__item">
          <NavItem href="/" type="special" collapsed={collapsed}>
            Food Specials
          </NavItem>
        </li>
        <li className="navigation__item">
          <NavItem href="/" type="wastage" collapsed={collapsed}>
            Wastage Tracker
          </NavItem>
        </li>
      </ul>
    </nav>
  );
};
