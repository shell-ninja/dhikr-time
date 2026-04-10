import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import PageTransition from "../../Hooks/PageTransition";
import useLanguage from "../../Hooks/useLanguage";
import useTheme from "../../Hooks/useTheme";
import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";
import surahsData from "../../Data/surahs.json";

const Quran = () => {

  const language = useLanguage();
  const theme = useTheme();
  
  const isDark = theme === "dark";
  const textMain = isDark ? "text-text-dark" : "text-text-light";
  const borderMain = isDark ? "border-text-dark" : "border-text-light";
  const viaMain = isDark ? "via-text-dark" : "via-text-light";
  const fontClass = language === "en" ? "font-lateef tracking-wide" : "font-balooDa";

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;
  const containerRef = useRef(null);

  // Reset page to 1 when navigating back, remounting, or searching
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // GSAP Animations
  useGSAP(
    () => {
      const cards = containerRef.current.querySelectorAll(".quran-card");

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
      gsap.from(cards, {
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: "back.out(1.5)",
      });
    },
    { scope: containerRef, dependencies: [currentPage] } // Re-animate when page changes
  );

  const surahs = surahsData;
  const filteredSurahs = surahs.filter(
    (s) =>
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.bengaliName.includes(searchQuery)
  );
  
  // Pagination Math
  const totalPages = Math.ceil(filteredSurahs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSurahs = filteredSurahs.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  
  const toBengaliNumber = (num) => {
    const bn = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num.toString().split("").map((d) => bn[parseInt(d)] !== undefined ? bn[parseInt(d)] : d).join("");
  };

  const bgActive = isDark ? "bg-text-dark" : "bg-text-light";
  const textActive = isDark ? "text-bg-dark" : "text-bg-light";

  const renderPageNumbers = () => {
    const pages = [];
    const delta = 1;

    const addPage = (pageNum) =>
      pages.push(
        <button
          key={pageNum}
          onClick={() => setCurrentPage(pageNum)}
          className={`w-10 h-10 rounded-[10px] font-bold transition-colors cursor-pointer text-sm shadow-none !drop-shadow-none ${fontClass} ${
            currentPage === pageNum
              ? `${bgActive} ${textActive}`
              : `bg-transparent border-2 ${borderMain} ${textMain} hover:${bgActive} hover:${textActive}`
          }`}
        >
          {language === 'en' ? pageNum : toBengaliNumber(pageNum)}
        </button>
      );

    const addEllipsis = (key) =>
      pages.push(
        <span
          key={key}
          className={`w-10 h-10 flex items-center justify-center ${textMain} font-bold`}
        >
          …
        </span>
      );

    addPage(1);
    const leftBound = currentPage - delta;
    const rightBound = currentPage + delta;
    if (leftBound > 2) addEllipsis("left");
    for (let i = Math.max(2, leftBound); i <= Math.min(totalPages - 1, rightBound); i++) {
      addPage(i);
    }
    if (rightBound < totalPages - 1) addEllipsis("right");
    if (totalPages > 1) addPage(totalPages);

    return pages;
  };

  const prevNextClass = (disabled) =>
    `flex items-center justify-center w-10 h-10 rounded-[10px] font-bold transition-colors flex-shrink-0 shadow-none !drop-shadow-none ${
      disabled
        ? `bg-gray-400/20 text-gray-500 cursor-not-allowed border-2 border-transparent`
        : `${bgActive} ${textActive} hover:opacity-80 cursor-pointer`
    }`;

  return (
    <PageTransition>
      <div ref={containerRef} className="min-h-screen py-24 px-5 md:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-16 px-4 pt-10 md:pt-0">
        <h1
          className={`dua-title text-3xl md:text-5xl font-bold ${textMain} md:mt-20 ${
            language === "bn" ? "font-balooDa" : "font-amiri"
          }`}
        >
          {language === "bn" ? "আল কুরআন" : "The Noble Quran"}
        </h1>

        <div
          className={`dua-line h-2 w-[75%] md:w-[40%] bg-gradient-to-r from-transparent ${viaMain} to-transparent rounded-2xl mt-4 mb-6`}
        />

        <p className={`dua-title text-xl md:text-2xl opacity-80 ${textMain} ${fontClass}`}>
          {language === "en" ? "Read and reflect upon the words of Allah" : "আল্লাহর বাণী পড়ুন ও অনুধাবন করুন"}
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-md mx-auto mt-8 relative dua-title">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <FiSearch className={`text-xl opacity-50 ${textMain}`} />
          </div>
          <input
            type="text"
            placeholder={language === "en" ? "Search Surah..." : "সূরা অনুসন্ধান করুন..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full py-4 pl-12 pr-4 rounded-[15px] border-2 bg-transparent focus:outline-none transition-all duration-300 font-bold ${textMain} ${fontClass} form-style-${theme} ${isDark ? "focus:bg-bg-dark/50 border-text-dark/20 focus:border-text-dark" : "focus:bg-bg-light/50 border-text-light/20 focus:border-text-light"}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
        {paginatedSurahs.map((surah) => (
          <Link
            key={surah.number}
            to={`/quran/${surah.number}`}
            className={`quran-card flex flex-col justify-center items-center bg-transparent border-2 ${borderMain} rounded-[20px] px-8 py-8 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full form-style-${theme}`}
          >
            <div className="flex flex-col items-center gap-2 mb-4 text-center h-full">
              <h3 className={`text-5xl md:text-6xl font-lateef font-bold ${textMain} leading-snug mb-3`}>
                {surah.name}
              </h3>
              <h2 className={`text-3xl font-bold ${textMain} ${fontClass}`}>
                {language === "en" ? surah.englishName : surah.bengaliName}
              </h2>
              <p className={`text-xl opacity-75 ${textMain} ${fontClass}`}>
                {language === "en" ? surah.englishNameTranslation : surah.bengaliNameTranslation}
              </p>
            </div>
            
            <div className="flex justify-between items-center w-full mt-auto pt-5 border-t border-dashed border-emerald-500/30">
               <span className={`w-10 h-10 flex items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-lg ${fontClass}`}>
                  {language === "en" ? surah.number : toBengaliNumber(surah.number)}
               </span>
               <span className={`text-lg md:text-xl opacity-90 ${textMain} bg-emerald-500/10 px-4 py-1.5 rounded-[12px] font-bold ${fontClass}`}>
                  {language === "en" ? surah.numberOfAyahs : toBengaliNumber(surah.numberOfAyahs)} {language === "en" ? "Ayahs" : "আয়াত"}
               </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-16 mb-8 flex-wrap">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={prevNextClass(currentPage === 1)}
            aria-label="Previous page"
          >
            <FiChevronLeft size={22} />
          </button>
          
          <div className="flex items-center gap-1.5">{renderPageNumbers()}</div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={prevNextClass(currentPage === totalPages)}
            aria-label="Next page"
          >
            <FiChevronRight size={22} />
          </button>
        </div>
      )}

      {/* No Results Fallback */}
      {paginatedSurahs.length === 0 && (
        <div className="flex justify-center items-center h-40">
          <p className={`text-xl font-bold opacity-60 ${textMain} ${fontClass}`}>
            {language === "en" ? "No Surahs found matching your search." : "আপনার অনুসন্ধানের সাথে মেলে এমন কোনো সূরা পাওয়া যায়নি।"}
          </p>
        </div>
      )}
      </div>
    </PageTransition>
  );
};

export default Quran;
