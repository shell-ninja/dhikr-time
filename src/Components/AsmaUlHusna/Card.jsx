import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../Form/Form.css";
gsap.registerPlugin(ScrollTrigger);

const Card = ({ cardData }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const newLanguage = localStorage.getItem("language") || "en";
      setLanguage(newLanguage);
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("languageChange", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("languageChange", handleStorageChange);
    };
  }, []);

  const cardsRef = useRef([]);

  useGSAP(() => {
    cardsRef.current.forEach((card, index) => {
      if (card) {
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
      }
    });
  }, [cardData]);

  return (
    <div className="grid grid-cols-1 gap-6 justify-items-center font-bold text-text-light">
      {cardData.map(([name, info], index) => (
        <CardItem
          key={name}
          info={info}
          index={index}
          language={language}
          cardRef={(el) => (cardsRef.current[index] = el)}
        />
      ))}
    </div>
  );
};

const CardItem = ({ info, index, language, cardRef }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      ref={cardRef}
      className="asma-card w-full max-w-md bg-transparent border-2 border-text-light rounded-2xl overflow-hidden transition-all duration-300 form-style"
    >
      {/* Card Header — Always Visible */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-6 py-5 flex items-center justify-between hover:bg-[#E9F7E6] transition-colors duration-200"
      >
        <div className="flex items-center gap-4">
          {/* Number Badge */}
          <span
            className={`text-lg ${
              language === "en" ? "font-amiri" : "font-balooDa"
            } font-bold text-text-light bg-[#E9F7E6] w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}
          >
            {index + 1}.
          </span>

          {/* Arabic Name */}
          <h2 className="font-normal text-5xl font-lateef tracking-wider text-text-light text-right ml-5">
            {info.name}
          </h2>
        </div>

        {/* Chevron Icon */}
        <svg
          className={`w-6 h-6 text-text-light transition-transform duration-300 flex-shrink-0 ${
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

      {/* Expandable Content */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 space-y-4 border-t-2 border-text-light">
          {/* Transliteration */}
          <div className="pt-4">
            <h4
              className={`text-base ${
                language === "en" ? "font-amiri" : "font-balooDa"
              } font-semibold text-text-light mb-1`}
            >
              {language === "bn" ? "উচ্চারণ:" : "Transliteration:"}
            </h4>
            <p
              className={`text-2xl md:text-3xl ${
                language === "en" ? "font-amiri" : "font-balooDa"
              } font-bold tracking-wider text-text-light`}
            >
              {info.transliteration}
            </p>
          </div>

          {/* Divider */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-text-light to-transparent rounded-full"></div>

          {/* Translation */}
          <div>
            <h4
              className={`text-base ${
                language === "en" ? "font-amiri" : "font-balooDa"
              } font-semibold text-text-light mb-1`}
            >
              {language === "bn" ? "অনুবাদ:" : "Translation:"}
            </h4>
            <p
              className={`text-xl md:text-2xl ${
                language === "en" ? "font-amiri" : "font-balooDa"
              } font-semibold text-text-light`}
            >
              {info.translation}
            </p>
          </div>

          {/* Divider */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-text-light to-transparent rounded-full"></div>

          {/* Meaning */}
          <div>
            <h4
              className={`text-base ${
                language === "en" ? "font-amiri" : "font-balooDa"
              } font-semibold text-text-light mb-1`}
            >
              {language === "bn" ? "অর্থ:" : "Meaning:"}
            </h4>
            <p
              className={`text-lg ${
                language === "en" ? "font-amiri" : "font-balooDa"
              } font-normal leading-relaxed text-text-light`}
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
