"use client";

import { useState } from "react";
import { setCookie } from "@/lib/utils/cookies";
import { NavBar } from "@/components/layout/Nav";
import { Divider } from "@/components/ui/Divider";
import { NavButton } from "@/components/ui/NavButton";
import ThemeToggle from "@/components/ui/ColorThemeToggle";

export const Sidebar = ({
  initialCollapsed,
}: {
  initialCollapsed: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(!initialCollapsed);

  const toggleSidebar = async () => {
    const next = !isOpen;
    setIsOpen(!isOpen);

    await setCookie({
      name: "sidebar-collapsed",
      value: String(!next),
      path: "/",
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    });
  };

  return (
    <aside className="sidebar" data-collapsed={!isOpen}>
      <div>
        <div className="sidebar__header" data-collapsed={!isOpen}>
          <NavButton onClick={toggleSidebar} />
          <h2 className="sidebar__title">Kitchen Tools</h2>
        </div>
        <Divider height={1} className="sidebar__divider" />
        <NavBar collapsed={!isOpen} className="sidebar__nav" />
      </div>
      <div className="sidebar__tools">
        <ThemeToggle collapsed={!isOpen} />
      </div>
    </aside>
  );
};
