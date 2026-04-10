import { useState, useEffect } from "react";

const useLanguage = () => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setLanguage(localStorage.getItem("language") || "en");
    };
    
    // Listen to native storage events from other tabs
    window.addEventListener("storage", handleStorageChange);
    // Listen to custom event for same-tab changes
    window.addEventListener("languageChange", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("languageChange", handleStorageChange);
    };
  }, []);

  return language;
};

export default useLanguage;
