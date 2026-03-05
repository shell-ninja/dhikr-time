import { Link } from "react-router-dom";
import { useRef, useState, useEffect, useCallback } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import "./Header.css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logoDark from "../../assets/logo-dhikr-time-dark.png";
import logoLight from "../../assets/logo-dhikr-time-light.png";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────
   ToggleBtn — spring knob + ripple ring + crossfading labels
───────────────────────────────────────────────────────────── */
const ToggleBtn = ({ toggled, onToggle }) => {
  const btnRef = useRef(null);

  const handleClick = () => {
    const btn = btnRef.current;
    if (!btn) return;
    btn.classList.remove("firing");
    void btn.offsetWidth;
    btn.classList.add("firing");
    onToggle();
  };

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const cleanup = () => btn.classList.remove("firing");
    btn.addEventListener("animationend", cleanup);
    return () => btn.removeEventListener("animationend", cleanup);
  }, []);

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      className={`lang-toggle ${toggled ? "on" : ""}`}
      aria-label={`Switch to ${toggled ? "English" : "Bengali"}`}
    >
      <div className="lang-toggle-ripple" />
      <div className="lang-toggle-knob">
        <span className="lang-toggle-label lang-toggle-label-en">en</span>
        <span className="lang-toggle-label lang-toggle-label-bn">বাং</span>
      </div>
      <span className="lang-toggle-hint lang-toggle-hint-bn">বাং</span>
      <span className="lang-toggle-hint lang-toggle-hint-en">en</span>
    </button>
  );
};

/* ─────────────────────────────────────────────────────────────
   DarkModeToggle — animated sun / moon pill toggle
───────────────────────────────────────────────────────────── */
const DarkModeToggle = ({ isDark, onToggle }) => {
  const btnRef = useRef(null);

  const handleClick = () => {
    const btn = btnRef.current;
    if (!btn) return;
    btn.classList.remove("firing");
    void btn.offsetWidth;
    btn.classList.add("firing");
    onToggle();
  };

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const cleanup = () => btn.classList.remove("firing");
    btn.addEventListener("animationend", cleanup);
    return () => btn.removeEventListener("animationend", cleanup);
  }, []);

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      className={`dark-mode-toggle ${isDark ? "on" : ""}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="dark-toggle-ripple" />
      <div className="dark-toggle-knob">
        <svg
          className="dark-toggle-icon dark-toggle-sun"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        <svg
          className="dark-toggle-icon dark-toggle-moon"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </div>
      <span className="dark-toggle-hint dark-toggle-hint-moon">🌙</span>
      <span className="dark-toggle-hint dark-toggle-hint-sun">☀️</span>
    </button>
  );
};

/* ─────────────────────────────────────────────────────────────
   Header
───────────────────────────────────────────────────────────── */
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [toggled, setToggled] = useState(() => {
    const saved = localStorage.getItem("language");
    return saved === "bn";
  });

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Apply / remove `dark` class on <html> whenever isDark changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
    window.dispatchEvent(new Event("themeChange"));
  }, [isDark]);

  const handleThemeToggle = useCallback(() => setIsDark((prev) => !prev), []);

  const handleToggle = useCallback(() => {
    setToggled((prev) => {
      const next = !prev;
      localStorage.setItem("language", next ? "bn" : "en");
      window.dispatchEvent(new Event("languageChange"));
      return next;
    });
  }, []);

  // ── Theme-aware class shorthands ──
  const navBg = isDark ? "bg-bg-dark ifDark" : "bg-text-light";
  const navText = isDark ? "text-text-dark" : "text-bg-light";

  // Desktop refs
  const navbarRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef([]);
  const hamburgerIconRef = useRef(null);

  // Animate hamburger icon on every open/close toggle
  useEffect(() => {
    if (hamburgerIconRef.current) {
      gsap.fromTo(
        hamburgerIconRef.current,
        { rotate: isOpen ? -90 : 90, opacity: 0, scale: 0.5 },
        {
          rotate: 0,
          opacity: 1,
          scale: 1,
          duration: 0.28,
          ease: "back.out(2)",
        },
      );
    }
  }, [isOpen]);

  const handleToggleMenu = () => setIsOpen((prev) => !prev);
  const handleLinkClick = () => setIsOpen(false);

  useGSAP(() => {
    if (window.innerWidth < 768) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(navbarRef.current, { y: -80, opacity: 0, duration: 0.8 })
      .from(
        logoRef.current,
        { y: 20, rotate: -3, opacity: 0, duration: 0.6 },
        "-=0.4",
      )
      .from(
        linksRef.current,
        { y: 20, opacity: 0, stagger: 0.15, duration: 0.5 },
        "-=0.4",
      );

    ScrollTrigger.create({
      start: "top -80",
      onEnter: () => {
        gsap.to(navbarRef.current, {
          paddingTop: "0.75rem",
          paddingBottom: "0.75rem",
          backdropFilter: "blur(6px)",
          boxShadow: "0 10px 35px rgba(0,0,0,0.2)",
          duration: 0.3,
        });
      },
      onLeaveBack: () => {
        gsap.to(navbarRef.current, {
          paddingTop: "1.75rem",
          paddingBottom: "1.75rem",
          backdropFilter: "blur(0px)",
          boxShadow: "none",
          duration: 0.3,
        });
      },
    });
  }, []);

  const theme = isDark ? "dark" : "light";
  const logo = isDark ? logoDark : logoLight; // used in both navbars
  console.log(theme);

  return (
    <>
      {/* ================= MOBILE NAVBAR ================= */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50">
        {/* Top bar */}
        <div className={`${navBg} flex justify-between items-center px-5 py-4`}>
          <div ref={logoRef} className="cursor-pointer">
            <Link
              className={`flex justify-center items-center gap-2 font-amiri font-bold text-xl ${navText}`}
              to="/"
            >
              <img className="h-[45px] mt-[-5px]" src={logo} alt="" />
              Dhikr Time
            </Link>
          </div>

          <button
            onClick={handleToggleMenu}
            className={`text-3xl ${navText} w-9 h-9 flex items-center justify-center`}
            aria-label="Toggle menu"
          >
            <span
              ref={hamburgerIconRef}
              className="flex items-center justify-center"
            >
              {isOpen ? <FiX /> : <FiMenu />}
            </span>
          </button>
        </div>

        {/* Dropdown */}
        <div
          className={`absolute top-full left-0 w-full ${navBg} font-amiri font-bold text-xl ${navText} tracking-wide transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen
              ? "max-h-72 opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col items-center space-y-5 py-7">
            <Link to="/dua" onClick={handleLinkClick}>
              Dua
            </Link>
            <Link to="/asma-ul-husna" onClick={handleLinkClick}>
              Asma Ul Husna
            </Link>

            <div className="flex flex-col justify-center items-center gap-4">
              <div ref={(el) => (linksRef.current[2] = el)}>
                <ToggleBtn toggled={toggled} onToggle={handleToggle} />
              </div>
              <div ref={(el) => (linksRef.current[3] = el)}>
                <DarkModeToggle isDark={isDark} onToggle={handleThemeToggle} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP NAVBAR ================= */}
      <div
        ref={navbarRef}
        className={`${navBg} py-7 hidden md:flex justify-around items-center font-amiri font-bold text-3xl ${navText} tracking-wide fixed top-0 left-0 right-0 z-[100]`}
      >
        <div ref={logoRef} className="cursor-pointer">
          <Link className="flex justify-center items-center gap-2" to="/">
            <img className="h-[45px] mt-[-5px]" src={logo} alt="" />
            Dhikr Time
          </Link>
        </div>

        <div className="flex items-center gap-10 text-2xl">
          <Link
            ref={(el) => (linksRef.current[0] = el)}
            to="/dua"
            className="relative nav-link"
          >
            Dua
            <span className={`nav-underline-${theme}`} />
          </Link>
          <Link
            ref={(el) => (linksRef.current[1] = el)}
            to="/asma-ul-husna"
            className="relative nav-link"
          >
            Asma Ul Husna
            <span className={`nav-underline-${theme}`} />
          </Link>
          <div ref={(el) => (linksRef.current[2] = el)}>
            <ToggleBtn toggled={toggled} onToggle={handleToggle} />
          </div>
          <div ref={(el) => (linksRef.current[3] = el)}>
            <DarkModeToggle isDark={isDark} onToggle={handleThemeToggle} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;

