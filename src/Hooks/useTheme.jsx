import { useState, useEffect } from "react";

const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const handle = () => setTheme(localStorage.getItem("theme") || "light");
    window.addEventListener("storage", handle);
    window.addEventListener("themeChange", handle);
    return () => {
      window.removeEventListener("storage", handle);
      window.removeEventListener("themeChange", handle);
    };
  }, []);

  return theme;
};

export default useTheme;
