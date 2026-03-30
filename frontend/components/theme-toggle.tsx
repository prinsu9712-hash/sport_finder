"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "playmate-theme";

export function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const nextValue = saved === "light";
    setIsLight(nextValue);
    document.body.classList.toggle("light-theme", nextValue);
  }, []);

  function toggleTheme() {
    const nextValue = !isLight;
    setIsLight(nextValue);
    document.body.classList.toggle("light-theme", nextValue);
    localStorage.setItem(STORAGE_KEY, nextValue ? "light" : "dark");
  }

  return (
    <button className="button button-secondary" onClick={toggleTheme}>
      {isLight ? "Dark mode" : "Light mode"}
    </button>
  );
}
