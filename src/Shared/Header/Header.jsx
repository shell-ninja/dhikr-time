import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import "./Header.css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  // Desktop refs
  const navbarRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef([]);

  useGSAP(() => {
    // Run ONLY on md and larger devices
    if (window.innerWidth < 768) return;

    // Intro animation
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

    // Scroll shrink / expand effect
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
      <div className="md:hidden relative">
        {/* Hamburger Icon */}
        <button
          onClick={toggleMenu}
          className="absolute top-5 right-5 z-50 text-3xl text-[#105A59]"
        >
          {isOpen ? <FiX className="text-[#E4F6D9]" /> : <FiMenu />}
        </button>

        {/* Mobile Menu */}
        <div
          className={`absolute top-0 left-0 w-full bg-[#105A59] font-amiri font-bold text-xl text-[#E4F6D9] tracking-wide py-10 transition-transform duration-300 ease-in-out z-10 ${
            isOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="flex justify-center mb-6">
            <Link to="/" onClick={toggleMenu}>
              Dhikr Time
            </Link>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <Link to="/dua" onClick={toggleMenu}>
              Dua
            </Link>
            <Link to="/asma-ul-husna" onClick={toggleMenu}>
              Asma Ul Husna
            </Link>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP NAVBAR ================= */}
      <div
        ref={navbarRef}
        className="bg-[#105A59] py-7 hidden md:flex justify-around items-center font-amiri font-bold text-3xl text-[#E4F6D9] tracking-wide sticky top-0 z-[100]"
      >
        {/* Logo */}
        <div ref={logoRef} className="cursor-pointer">
          <Link to="/">Dhikr Time</Link>
        </div>

        {/* Nav Links */}
        <div className="flex text-2xl">
          <Link
            ref={(el) => (linksRef.current[0] = el)}
            to="/dua"
            className="relative mr-10 nav-link"
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
        </div>
      </div>
    </>
  );
};

export default Header;
