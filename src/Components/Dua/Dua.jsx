import { Link } from "react-router-dom";
import "./Dua.css";
import { usePageTitle } from "../../Hooks/pageName";
import PageTransition from "../../Hooks/PageTransition";
import { ScrollTrigger } from "gsap/all";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useState, useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

const Dua = () => {
  // ── Language ──────────────────────────────────────────────
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en",
  );
  useEffect(() => {
    const handle = () => setLanguage(localStorage.getItem("language") || "en");
    window.addEventListener("storage", handle);
    window.addEventListener("languageChange", handle);
    return () => {
      window.removeEventListener("storage", handle);
      window.removeEventListener("languageChange", handle);
    };
  }, []);

  // ── Theme ─────────────────────────────────────────────────
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );
  useEffect(() => {
    const handle = () => setTheme(localStorage.getItem("theme") || "light");
    window.addEventListener("storage", handle);
    window.addEventListener("themeChange", handle);
    return () => {
      window.removeEventListener("storage", handle);
      window.removeEventListener("themeChange", handle);
    };
  }, []);

  const isDark = theme === "dark";
  const textMain = isDark ? "text-text-dark" : "text-text-light";
  const viaMain = isDark ? "via-text-dark" : "via-text-light";
  const borderCard = isDark ? "border-text-dark" : "border-text-light";

  // All card images live in public/images/{theme}/
  const img = (filename) => `/images/${theme}/${filename}`;

  usePageTitle("Dua", " | Dhikr Time");
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const cards = containerRef.current.querySelectorAll(".dua-card");

      gsap.from(".dua-title", {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.from(".dua-line", {
        scaleX: 0,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: "power3.out",
      });

      const directions = [
        { x: -300, y: 0, rotation: -15 },
        { x: 0, y: -300, rotation: 0 },
        { x: 300, y: 0, rotation: 15 },
        { x: -300, y: 0, rotation: -15 },
        { x: 0, y: 300, rotation: 0 },
        { x: 300, y: 0, rotation: 15 },
      ];

      cards.forEach((card, index) => {
        const { x, y, rotation } = directions[index % directions.length];
        gsap.from(card, {
          x,
          y,
          rotation,
          opacity: 0,
          duration: 1,
          delay: 0.6 + index * 0.15,
          ease: "back.out(1.7)",
        });
      });
    },
    { scope: containerRef },
  );

  const labelClass = (isBn) =>
    isBn
      ? `font-normal font-balooDa text-xl text-center tracking-wider ${textMain}`
      : `font-normal text-2xl text-center font-amiri tracking-wider ${textMain}`;

  const cards = [
    {
      to: `/dua/morning-evening?lang=${language}`,
      src: img("morning-evening.png"),
      alt: "Morning and Evening dua",
      labelEn: "Morning and Evening",
      labelBn: "সকাল এবং সন্ধ্যা",
    },
    {
      to: `/dua/after-salah?lang=${language}`,
      src: img("salah.png"),
      alt: "Dua after Salah",
      labelEn: "After Salah",
      labelBn: "সালাতের পরে",
    },
    {
      to: `/dua/quran-sunnah?lang=${language}`,
      src: img("quran.png"),
      alt: "Quranic dua",
      labelEn: "Quran And Sunnah",
      labelBn: "কুরানে এবং সুন্নাহ সম্মত দু'আ",
    },
    {
      to: `/dua/istighfar?lang=${language}`,
      src: img("istigfar.png"),
      alt: "Istigfar dua",
      labelEn: "Istigfar",
      labelBn: "ইসতিগফার",
    },
  ];

  return (
    <PageTransition>
      <div
        ref={containerRef}
        className={`min-h-screen flex flex-col justify-start items-center px-8 md:px-20 relative`}
      >
        <h1
          className={`dua-title text-5xl font-bold ${textMain} mt-30 md:mt-40 ${
            language === "bn" ? "font-balooDa" : "font-amiri"
          }`}
        >
          {language === "bn" ? "দু'আ" : "Dua"}
        </h1>

        <div
          className={`dua-line h-2 w-[75%] md:w-[40%] bg-gradient-to-r from-transparent ${viaMain} to-transparent rounded-2xl mt-4 mb-20`}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center font-bold mb-20 w-full max-w-[1150px]">
          {cards.map(({ to, src, alt, labelEn, labelBn }) => (
            <Link key={to} to={to} className="dua-card w-full max-w-[350px]">
              <div
                className={`w-full h-[300px] flex flex-col border-2 ${borderCard} overflow-hidden form-style-${theme} hover-card rounded-2xl`}
              >
                <div className="flex-1 overflow-hidden card-image-wrapper">
                  <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover card-image"
                  />
                </div>
                <div className="py-3 px-4 bg-transparent">
                  <h2 className={labelClass(language === "bn")}>
                    {language === "bn" ? labelBn : labelEn}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default Dua;
