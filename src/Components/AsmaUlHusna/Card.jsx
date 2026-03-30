import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../Form/Form.css";
import useTheme from "../../Hooks/useTheme";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────
   useThemeAndLanguage — shared hook for both components
───────────────────────────────────────────────────────────── */
const useThemeAndLanguage = () => {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en",
  );

  useEffect(() => {
    const handleLang = () =>
      setLanguage(localStorage.getItem("language") || "en");

    window.addEventListener("storage", handleLang);
    window.addEventListener("languageChange", handleLang);

    return () => {
      window.removeEventListener("storage", handleLang);
      window.removeEventListener("languageChange", handleLang);
    };
  }, []);

  const theme = useTheme();
  const isDark = theme === "dark";
  const textMain = isDark ? "text-text-dark" : "text-text-light";
  const borderMain = isDark ? "border-text-dark" : "border-text-light";
  const viaMain = isDark ? "via-text-dark" : "via-text-light";
  const bgBadge = isDark ? "bg-bg-dark" : "bg-[#E9F7E6]";
  const hoverBg = isDark ? "hover:bg-bg-dark" : "hover:bg-[#E9F7E6]";
  const fontClass = language === "en" ? "font-amiri" : "font-balooDa";

  return {
    language,
    theme, // ← exposed so components can use font-style-${theme} etc.
    isDark,
    textMain,
    borderMain,
    viaMain,
    bgBadge,
    hoverBg,
    fontClass,
  };
};

/* ─────────────────────────────────────────────────────────────
   Card — grid wrapper
───────────────────────────────────────────────────────────── */
const Card = ({ cardData }) => {
  const { textMain } = useThemeAndLanguage();
  const cardsRef = useRef([]);

  useGSAP(() => {
    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      const direction = index % 3 === 0 ? -100 : index % 3 === 1 ? 0 : 100;
      gsap.from(card, {
        x: direction,
        y: direction === 0 ? 100 : 0,
        opacity: 0,
        duration: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });
    });
  }, [cardData]);

  return (
    <div
      className={`grid grid-cols-1 gap-6 justify-items-center font-bold ${textMain}`}
    >
      {cardData.map(([name, info], index) => (
        <CardItem
          key={name}
          info={info}
          index={index}
          cardRef={(el) => (cardsRef.current[index] = el)}
        />
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   CardItem — single expandable card
───────────────────────────────────────────────────────────── */
const CardItem = ({ info, cardRef }) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    language,
    theme,
    textMain,
    borderMain,
    viaMain,
    bgBadge,
    hoverBg,
    fontClass,
  } = useThemeAndLanguage();

  // console.log(info);

  return (
    <div
      ref={cardRef}
      className={`asma-card w-full max-w-md bg-transparent border-2 ${borderMain} rounded-2xl overflow-hidden transition-all duration-300 form-style-${theme}`}
    >
      {/* Header — always visible */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full px-6 py-5 flex items-center justify-between ${hoverBg} transition-colors duration-200`}
      >
        <div className="flex items-center gap-4">
          {/* Number badge */}
          <span
            className={`text-lg ${fontClass} font-bold ${textMain} ${bgBadge} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}
          >
            {info.number}.
          </span>

          {/* Arabic name */}
          <h2
            className={`font-normal text-5xl font-lateef tracking-wider ${textMain} text-right ml-5 font-style-${theme}`}
          >
            {info.name}
          </h2>
        </div>

        {/* Chevron */}
        <svg
          className={`w-6 h-6 ${textMain} transition-transform duration-300 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Expandable content */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className={`px-6 pb-6 space-y-4 border-t-2 ${borderMain}`}>
          {/* Transliteration */}
          <div className="pt-4">
            <h4
              className={`text-base ${fontClass} font-semibold ${textMain} mb-1`}
            >
              {language === "bn" ? "উচ্চারণ:" : "Transliteration:"}
            </h4>
            <p
              className={`text-2xl md:text-3xl ${fontClass} font-bold tracking-wider ${textMain}`}
            >
              {info.transliteration}
            </p>
          </div>

          <div
            className={`h-[1px] w-full bg-gradient-to-r from-transparent ${viaMain} to-transparent rounded-full`}
          />

          {/* Translation */}
          <div>
            <h4
              className={`text-base ${fontClass} font-semibold ${textMain} mb-1`}
            >
              {language === "bn" ? "অনুবাদ:" : "Translation:"}
            </h4>
            <p
              className={`text-xl md:text-2xl ${fontClass} font-semibold ${textMain}`}
            >
              {info.translation}
            </p>
          </div>

          <div
            className={`h-[1px] w-full bg-gradient-to-r from-transparent ${viaMain} to-transparent rounded-full`}
          />

          {/* Meaning */}
          <div>
            <h4
              className={`text-base ${fontClass} font-semibold ${textMain} mb-1`}
            >
              {language === "bn" ? "অর্থ:" : "Meaning:"}
            </h4>
            <p
              className={`text-lg ${fontClass} font-normal leading-relaxed ${textMain}`}
            >
              {info.meaning}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
