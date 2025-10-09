"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import style from "./style.module.scss";
import { IconSunFilled, IconMoonFilled } from "@tabler/icons-react";

type ThemeToggleProps = {
  collapsed?: boolean;
};

const ThemeToggle = ({ collapsed }: ThemeToggleProps) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | null;
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className={clsx(style.container)} data-collapsed={collapsed}>
      <div className={clsx(style.label)}>
        {theme === "light" ? (
          <IconSunFilled className={clsx(style.icon, style["icon--sun"])} />
        ) : (
          <IconMoonFilled className={clsx(style.icon)} />
        )}
        {theme === "light" ? (
          <span className={style["label__text"]}>Light Mode</span>
        ) : (
          <span className={style["label__text"]}>Dark Mode</span>
        )}
      </div>
      <div
        className={clsx(style.switch, {
          [style["switch--active"]]: theme === "dark",
        })}
        onClick={toggleTheme}
      >
        <span className={clsx(style["switch__thumb"])} />
      </div>
    </div>
  );
};

export default ThemeToggle;
