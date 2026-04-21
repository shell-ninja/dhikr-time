import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import "./Footer.css";
import { useEffect, useState } from "react";

const Footer = () => {
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
    // <div className="bg-text-light">
    <div
      className={`${theme == "light" ? "bg-text-light" : "bg-text-dark/10"}`}
    >
      <div className="flex justify-between items-center min-h-44 px-[50px] md:px-[100px] py-10">
        <div
          className={`font-amiri font-normal text-xl md:text-2xl ${theme == "light" ? "text-bg-light" : "text-text-dark"}`}
        >
          <h1>A Sadaqah E Jariyah</h1>
          <p>By,</p>
          <h3 className="font-bold">Shell Ninja</h3>
        </div>

        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 text-2xl md:text-3xl ${theme == "light" ? "text-bg-light" : "text-text-dark"}`}
        >
          <a target="_blank" href="https://github.com/shell-ninja">
            <FaGithub className="link-style" />
          </a>

          <a href="https://www.facebook.com/mahin.bhau">
            <FaFacebook className="link-style" />
          </a>

          <a href="https://www.instagram.com/mahin_bhau/">
            <FaInstagram className="link-style" />
          </a>

          <a href="https://www.linkedin.com/in/shell-ninja/">
            <FaLinkedin className="link-style" />
          </a>
        </div>
      </div>
      <div
        className={`${theme == "light" ? "text-bg-light" : "text-text-dark"} font-amiri text-xl pb-4 px-5 flex flex-col justify-center items-center text-center`}
      >
        <div className="flex flex-col items-center">
          <p className="tracking-wider">Prayer Times and Asma Ul Husna API</p>
          <p>
            <a className="font-bold tracking-wide hover:underline" href="https://islamicapi.com/" target="_blank" rel="noreferrer">
              IslamicAPI
            </a>
          </p>
        </div>

        <div className="flex flex-col items-center mt-4 border-t border-current/20 pt-4 w-full max-w-md">
          <p className="tracking-wider text-lg">Free and Open Source Project</p>
          <a
            className="font-bold tracking-wide flex items-center gap-2 hover:underline mt-1"
            href="https://github.com/shell-ninja/dhikr-time"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub /> GitHub Repository
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
