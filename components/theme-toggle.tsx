"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Determine active theme on mount
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-8 h-8 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-all duration-200 cursor-pointer border-none"
      title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
    >
      <i className={`ti ${theme === "light" ? "ti-moon" : "ti-sun"} text-lg`} />
    </button>
  );
}
