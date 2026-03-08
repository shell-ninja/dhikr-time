import { useEffect, useState } from "react";
import "./Loader.css";

const Loader = () => {
  // Get the theme from the Local Storage
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );

  // Listen for theme changes in localStorage
  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };
    window.addEventListener("storage", handleThemeChange);
    window.addEventListener("themeChange", handleThemeChange);
    return () => {
      window.removeEventListener("storage", handleThemeChange);
      window.removeEventListener("themeChange", handleThemeChange);
    };
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className={`my-20 loader-${theme}`}></div>
    </div>
  );
};

export default Loader;
