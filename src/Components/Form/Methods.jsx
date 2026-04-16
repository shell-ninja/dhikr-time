import { useRef, useEffect } from "react";
import PageTransition from "../../Hooks/PageTransition";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import useTheme from "../../Hooks/useTheme";
import useLanguage from "../../Hooks/useLanguage";

const methodsList = [
  { id: 1, name: "University of Islamic Sciences, Karachi" },
  { id: 2, name: "Islamic Society of North America" },
  { id: 3, name: "Muslim World League" },
  { id: 4, name: "Umm Al-Qura University, Makkah" },
  { id: 5, name: "Egyptian General Authority of Survey" },
  { id: 7, name: "Institute of Geophysics, Tehran" },
  { id: 8, name: "Gulf Region" },
  { id: 9, name: "Kuwait" },
  { id: 10, name: "Qatar" },
  { id: 11, name: "MUIS, Singapore" },
  { id: 12, name: "UOIF, France" },
  { id: 13, name: "Diyanet, Turkey" },
  { id: 14, name: "Russia" },
  { id: 15, name: "Moonsighting Committee Worldwide" },
  { id: 16, name: "Dubai (experimental)" },
  { id: 17, name: "JAKIM, Malaysia" },
  { id: 18, name: "Tunisia" },
  { id: 19, name: "Algeria" },
  { id: 20, name: "KEMENAG, Indonesia" },
  { id: 21, name: "Morocco" },
  { id: 22, name: "Lisbon, Portugal" },
  { id: 23, name: "Jordan" },
];

const Methods = () => {
  const language = useLanguage();
  const theme = useTheme();
  
  const isDark = theme === "dark";
  const textMain = isDark ? "text-text-dark" : "text-text-light";
  const borderMain = isDark ? "border-text-dark" : "border-text-light";
  const viaMain = isDark ? "via-text-dark" : "via-text-light";
  const bgBadge = isDark ? "bg-text-dark text-bg-dark" : "bg-text-light text-bg-light";
  const fontClass = language === "bn" ? "font-balooDa" : "font-amiri";

  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useGSAP(() => {
    // Check if the ref exists before trying to read its children
    if (!headerRef.current) return;

    // Header animations
    gsap.fromTo(headerRef.current.children, 
      { y: -30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      }
    );

    // Staggered card animations
    // Filter out nulls that might happen during unmount/remount
    const validCards = cardsRef.current.filter(Boolean);
    if (validCards.length > 0) {
      gsap.fromTo(validCards, 
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: "power3.out",
          delay: 0.3,
        }
      );
    }
  }, []);

  return (
    <PageTransition>
      <div className={`flex flex-col items-center min-h-screen ${fontClass} px-5 md:px-10 pb-20`}>
        {/* Header Section */}
        <div ref={headerRef} className="flex flex-col items-center w-full mt-24 md:mt-32">
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold ${textMain} text-center`}>
            {language === "en" ? "Calculation Methods" : "গণনা পদ্ধতিসমূহ"}
          </h1>
          
          <div className={`dua-line h-2 w-[75%] md:w-[40%] bg-gradient-to-r from-transparent ${viaMain} to-transparent rounded-2xl mt-6 mb-8`} />
          
          <p className={`text-xl md:text-2xl text-center max-w-3xl opacity-80 ${textMain} px-4`}>
            {language === "en"
              ? "Select the mathematical algorithm suitable for your geographic region to calculate accurate prayer times."
              : "আপনার ভৌগলিক অঞ্চলের জন্য উপযুক্ত গাণিতিক অ্যালগরিদম নির্বাচন করুন সঠিক নামাজের সময় হিসাব করার জন্য।"}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl mt-16 pb-20 px-4 md:px-0">
          {methodsList.map((method, index) => (
            <div
              key={method.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className={`flex flex-col justify-start items-center bg-transparent border-2 ${borderMain} rounded-[20px] p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-default backdrop-blur-sm`}
            >
              <div
                className={`text-2xl md:text-3xl font-bold mb-4 ${bgBadge} w-16 h-16 rounded-full flex justify-center items-center shadow-md group-hover:scale-110 transition-transform duration-300`}
              >
                {method.id}
              </div>
              <p className={`text-xl md:text-2xl text-center font-bold ${textMain} mt-2 leading-relaxed`}>
                {method.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default Methods;
