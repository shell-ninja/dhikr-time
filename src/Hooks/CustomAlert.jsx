import { useState } from "react";
import useTheme from "./useTheme";

const CustomAlert = ({ message, type = "error", onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const theme = useTheme();
  const isDark = theme === "dark";

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  const typeStyles = {
    error: isDark
      ? "bg-bg-dark border-text-dark text-text-dark"
      : "bg-bg-light border-text-light text-text-light",

    success: isDark
      ? "bg-bg-dark border-text-dark text-text-dark"
      : "bg-bg-light border-text-light text-text-light",

    warning: isDark
      ? "bg-bg-dark border-text-dark text-text-dark"
      : "bg-bg-light border-text-light text-text-light",

    info: isDark
      ? "bg-bg-dark border-text-dark text-text-dark"
      : "bg-bg-light border-text-light text-text-light",
  };

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[99999] w-[90%] max-w-md animate-slideDown">
      <div
        className={`${typeStyles[type]} border-2 rounded-[15px] px-6 py-4 shadow-lg flex justify-between items-center`}
      >
        <p className="font-amiri font-bold text-xl">{message}</p>
        <button
          onClick={handleClose}
          className="ml-4 text-2xl font-bold hover:opacity-70 transition-opacity"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default CustomAlert;
