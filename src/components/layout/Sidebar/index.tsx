"use client";

import { useState } from "react";
import { NavBar } from "@/components/layout/Nav";
import { Divider } from "@/components/ui/Divider";
import { NavButton } from "@/components/ui/NavButton";
import ThemeToggle from "@/components/ui/ColorThemeToggle";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <aside className="sidebar" data-collapsed={!isOpen}>
      <div>
        <div className="sidebar__header" data-collapsed={!isOpen}>
          <NavButton onClick={toggleSidebar} />
          {isOpen && <h2>Kitchen Tools</h2>}
        </div>
        {isOpen && <Divider height={1} />}
        <NavBar collapsed={!isOpen} />
      </div>
      <div>
        <ThemeToggle collapsed={!isOpen} />
      </div>
    </aside>
  );
};
