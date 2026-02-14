import { Link } from "react-router-dom";
import { useRef, useState, useEffect, useCallback } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import "./Header.css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logo from "../../assets/logo-dhikr-time.png";

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
    void btn.offsetWidth; // force reflow to restart animation
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
      {/* Ripple ring */}
      <div className="lang-toggle-ripple" />

      {/* Sliding knob with crossfading labels */}
      <div className="lang-toggle-knob">
        <span className="lang-toggle-label lang-toggle-label-en">en</span>
        <span className="lang-toggle-label lang-toggle-label-bn">বাং</span>
      </div>

      {/* Ghost hint — shows the inactive language on the opposite side */}
      <span className="lang-toggle-hint lang-toggle-hint-bn">বাং</span>
      <span className="lang-toggle-hint lang-toggle-hint-en">en</span>
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

  // const handleToggle = useCallback(() => {
  //   setToggled((prev) => {
  //     const next = !prev;
  //     localStorage.setItem("language", next ? "bn" : "en");
  //     return next;
  //   });
  // }, []);
  const handleToggle = useCallback(() => {
    setToggled((prev) => {
      const next = !prev;
      localStorage.setItem("language", next ? "bn" : "en");

      // Dispatch custom event for same-tab updates
      window.dispatchEvent(new Event("languageChange"));

      return next;
    });
  }, []);

  // Desktop refs
  const navbarRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef([]);

  // Hamburger icon ref for GSAP animation
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

    tl.from(navbarRef.current, {
      y: -80,
      opacity: 0,
      duration: 0.8,
    })
      .from(
        logoRef.current,
        {
          y: 20,
          rotate: -3,
          opacity: 0,
          duration: 0.6,
        },
        "-=0.4",
      )
      .from(
        linksRef.current,
        {
          y: 20,
          opacity: 0,
          stagger: 0.15,
          duration: 0.5,
        },
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

  return (
    <>
      {/* ================= MOBILE NAVBAR ================= */}
      <div className="md:hidden sticky top-0 z-50">
        {/* Top bar — logo LEFT, hamburger RIGHT */}
        <div className="bg-[#105A59] flex justify-between items-center px-5 py-4">
          {/* Dhikr Time Logo */}
          <div ref={logoRef} className="cursor-pointer">
            <Link
              className="flex justify-center items-center gap-2 font-amiri font-bold text-xl text-[#E4F6D9]"
              to="/"
            >
              <img className="h-[45px] mt-[-5px]" src={logo} alt="" />
              Dhikr Time
            </Link>
          </div>

          {/* Hamburger / Close — GSAP animated */}
          <button
            onClick={handleToggleMenu}
            className="text-3xl text-[#E4F6D9] w-9 h-9 flex items-center justify-center"
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

        {/* Dropdown — nav links + toggle */}
        <div
          className={`absolute top-full left-0 w-full bg-[#105A59] font-amiri font-bold text-xl text-[#E4F6D9] tracking-wide transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen
              ? "max-h-60 opacity-100"
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

            {/* Language Toggle */}
            <div ref={(el) => (linksRef.current[2] = el)}>
              <ToggleBtn toggled={toggled} onToggle={handleToggle} />
            </div>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP NAVBAR ================= */}
      <div
        ref={navbarRef}
        className="bg-[#105A59] py-7 hidden md:flex justify-around items-center font-amiri font-bold text-3xl text-[#E4F6D9] tracking-wide sticky top-0 z-[100]"
      >
        {/* Logo — desktop only */}
        <div ref={logoRef} className="cursor-pointer">
          <Link className="flex justify-center items-center gap-2" to="/">
            <img className="h-[45px] mt-[-5px]" src={logo} alt="" />
            Dhikr Time
          </Link>
        </div>

        {/* Nav Links + Toggle */}
        <div className="flex items-center gap-10 text-2xl">
          <Link
            ref={(el) => (linksRef.current[0] = el)}
            to="/dua"
            className="relative nav-link"
          >
            Dua
            <span className="nav-underline" />
          </Link>

          <Link
            ref={(el) => (linksRef.current[1] = el)}
            to="/asma-ul-husna"
            className="relative nav-link"
          >
            Asma Ul Husna
            <span className="nav-underline" />
          </Link>

          {/* Language Toggle — inline with nav links */}
          <div ref={(el) => (linksRef.current[2] = el)}>
            <ToggleBtn toggled={toggled} onToggle={handleToggle} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
