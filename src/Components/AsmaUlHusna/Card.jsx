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

  // Listen for language changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const newLanguage = localStorage.getItem("language") || "en";
      setLanguage(newLanguage);
    };

    // Listen for storage events (works across tabs)
    window.addEventListener("storage", handleStorageChange);

    // Custom event for same-tab changes
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
        // Determine animation direction based on position
        const direction = index % 3 === 0 ? -100 : index % 3 === 1 ? 0 : 100;

        gsap.from(card, {
          x: direction,
          y: direction === 0 ? 100 : 0,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      }
    });
  }, [cardData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center font-bold text-[#105A59]">
      {cardData.map(([name, info], index) => (
        <div
          key={name}
          ref={(el) => (cardsRef.current[index] = el)}
          className="asma-card w-full max-w-md flex flex-col justify-center items-center border-2 px-10 py-10 rounded-2xl text-center md:text-start form-style"
        >
          <h2 className="font-normal text-6xl mb-3 font-lateef tracking-wider">
            {info.name}
          </h2>
          <h2
            className={`font-bold text-3xl md:text-4xl mb-3 tracking-wider ${
              language === "en" ? "font-amiri" : "font-balooDa"
            }`}
          >
            {info.transliteration}
          </h2>
          <p
            className={`font-normal text-3xl my-2 ${
              language === "en" ? "font-amiri" : "font-balooDa"
            }`}
          >
            {info.translation}
          </p>
          <p
            className={`font-normal text-xl mt-10 ${
              language === "en" ? "font-amiri" : "font-balooDa"
            }`}
          >
            {info.meaning}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Card;