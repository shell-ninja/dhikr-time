import { useEffect, useState } from "react";

const PageTransition = ({ children }) => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Small delay to trigger CSS transition correctly on mount
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        opacity: fadeIn ? 1 : 0,
        transition: "opacity 0.4s ease-in-out",
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;
