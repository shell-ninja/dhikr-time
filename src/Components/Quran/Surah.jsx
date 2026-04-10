import { useParams, Link } from "react-router-dom";
import useSWR from "swr";
import { useEffect, useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import PageTransition from "../../Hooks/PageTransition";
import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";
import Loader from "../../Hooks/Loader";
import useLanguage from "../../Hooks/useLanguage";
import useTheme from "../../Hooks/useTheme";
import surahsData from "../../Data/surahs.json";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Surah = () => {
  const { id } = useParams();
  const language = useLanguage();
  const theme = useTheme();

  const isDark = theme === "dark";
  const textMain = isDark ? "text-text-dark" : "text-text-light";
  const borderMain = isDark ? "border-text-dark" : "border-text-light";
  const fontClass = language === "en" ? "font-lateef tracking-wide" : "font-balooDa";

  const translationEdition = language === "bn" ? "bn.bengali" : "en.asad";

  const { data, error, isLoading } = useSWR(
    `https://api.alquran.cloud/v1/surah/${id}/editions/quran-uthmani,${translationEdition}`,
    fetcher
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const containerRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [jumpTarget, setJumpTarget] = useState(null);
  
  // Reset page conditionally: only if we haven't just jumped.
  useEffect(() => {
    if (!jumpTarget) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  // Handle Ayah Jumping Effect
  useEffect(() => {
    if (jumpTarget) {
      setTimeout(() => {
        const el = document.getElementById(`ayah-${jumpTarget}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        setJumpTarget(null); // Clear once executed
      }, 500); // Wait for React to render the new window layout and GSAP hooks to finish
    }
  }, [currentPage, jumpTarget]);
  
  // GSAP Animations
  useGSAP(
    () => {
      if (!containerRef.current) return;
      const ayahs = containerRef.current.querySelectorAll(".ayah-card");
      
      gsap.from(".surah-header-text", {
        y: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      });
      
      gsap.from(".bismillah-text", {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: "power2.out",
      });

      if (ayahs.length > 0) {
        gsap.from(ayahs, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "back.out(1.5)",
        });
      }
    },
    { scope: containerRef, dependencies: [currentPage, isLoading] }
  );

  const toBengaliNumber = (num) => {
    const bn = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num.toString().split("").map((d) => bn[parseInt(d)] !== undefined ? bn[parseInt(d)] : d).join("");
  };

  const bgActive = isDark ? "bg-text-dark" : "bg-text-light";
  const textActive = isDark ? "text-bg-dark" : "text-bg-light";

  const arabicData = data?.data?.[0];
  const translationData = data?.data?.[1];
  const ayahs = arabicData?.ayahs;
  const translationAyahs = translationData?.ayahs;

  // Search Logic Effect
  useEffect(() => {
    if (searchTerm.trim().length > 2 && ayahs && translationAyahs) {
      const term = searchTerm.toLowerCase();
      const matches = translationAyahs
        .map((tAyah, index) => ({
          transInfo: tAyah,
          arabicInfo: ayahs[index],
        }))
        .filter(
          (bundle) =>
            bundle.transInfo.text.toLowerCase().includes(term) ||
            bundle.arabicInfo.text.includes(term)
        )
        .slice(0, 5); // Limit to top 5 hits
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, ayahs, translationAyahs]);

  if (isLoading) {
    return <Loader />;
  }

  if (error || (data && data.code !== 200)) {
    return (
      <div className="flex justify-center flex-col items-center h-[calc(100vh-100px)]">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error loading Surah</h2>
        <Link to="/quran" className="flex items-center gap-2 dark:text-emerald-400 text-emerald-600 hover:underline">
          <FiArrowLeft /> Back to Surahs
        </Link>
      </div>
    );
  }

  if (!arabicData || !translationData) return null;
  
  const metaSurah = surahsData.find((s) => s.number.toString() === id);

  const surahName = language === "en" ? metaSurah?.englishName : metaSurah?.bengaliName;
  const surahArabicName = arabicData.name;
  const revelationType = arabicData.revelationType;

  const totalPages = Math.ceil(ayahs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  
  const paginatedAyahs = ayahs.slice(startIndex, startIndex + itemsPerPage);
  const paginatedTranslationAyahs = translationAyahs.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleJumpToAyah = (ayahNumber) => {
    const page = Math.ceil(ayahNumber / itemsPerPage);
    setSearchTerm("");
    setSuggestions([]);
    setJumpTarget(ayahNumber);
    if (currentPage !== page) {
      setCurrentPage(page);
    }
  };

  // Render Page Numbers internally now that totalPages is known
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
      <div ref={containerRef} className="min-h-screen py-24 px-5 md:px-10 max-w-5xl mx-auto">
        {/* Back button and Header Info */}
      <div className="mb-12 mt-10">
        <Link
          to="/quran"
          className={`inline-flex items-center justify-center p-3 rounded-[15px] border-2 ${borderMain} ${textMain} hover:bg-emerald-500/10 cursor-pointer bg-transparent shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-x-1 mb-6 form-style-${theme}`}
          aria-label="Go Back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>

        {/* Bismillah Header SVG or text... using simple text for now */}
        <div className="text-center rounded-3xl p-10 bg-gradient-to-br from-emerald-500/10 to-transparent border dark:border-emerald-500/20 border-emerald-500/30 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
          
          <h1 className={`surah-header-text text-5xl md:text-6xl font-lateef font-bold mb-3 ${textMain} relative z-10`}>
            {surahArabicName}
          </h1>
          <h2 className={`surah-header-text text-3xl font-bold ${textMain} opacity-90 mb-2 relative z-10 ${fontClass}`}>
            {surahName}
          </h2>
          <p className={`surah-header-text text-lg opacity-75 font-semibold mb-6 relative z-10 ${textMain} ${fontClass}`}>
            {revelationType} • {language === "en" ? ayahs.length : toBengaliNumber(ayahs.length)} {language === "en" ? "Verses" : "আয়াত"}
          </p>

          {/* Render Bismillah if it's not Surah Al-Tawbah (9) or Al-Fatihah (which has it as verse 1) */}
          {id !== "9" && id !== "1" && (
            <div className="pt-6 mt-6 border-t border-dashed border-emerald-500/30">
              <p className={`bismillah-text text-5xl md:text-6xl font-lateef mb-2 ${textMain}`}>
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </p>
            </div>
          )}
        </div>
      </div>

        {/* Search Ayah Bar */}
        <div className="w-full relative mb-12 z-20">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <FiSearch className={`text-xl opacity-50 ${textMain}`} />
          </div>
          <input
            type="text"
            placeholder={language === "en" ? "Search translation or Arabic..." : "অনুবাদ বা আরবি খুঁজুন..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full py-4 pl-12 pr-4 rounded-[15px] border-2 bg-transparent focus:outline-none transition-all duration-300 font-bold ${textMain} ${fontClass} form-style-${theme} ${isDark ? "focus:bg-bg-dark/50 border-text-dark/20 focus:border-text-dark" : "focus:bg-bg-light/50 border-text-light/20 focus:border-text-light"}`}
          />
          
          {/* Dropdown Suggestions */}
          {suggestions.length > 0 && (
            <div className={`absolute top-full mt-3 w-full rounded-[20px] border-2 ${borderMain} overflow-hidden shadow-2xl backdrop-blur-xl z-50 form-style-${theme}`}>
              {suggestions.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => handleJumpToAyah(s.transInfo.numberInSurah)}
                  className={`px-6 md:px-8 py-5 cursor-pointer transition-all duration-300 border-b last:border-b-0 ${borderMain} hover:bg-emerald-500/20 group`}
                >
                  <div className="flex justify-between items-center gap-6">
                    <p className={`truncate w-[80%] text-lg md:text-xl font-medium opacity-90 transition-colors group-hover:text-emerald-500 ${textMain} ${fontClass}`}>
                      {s.transInfo.text}
                    </p>
                    <span className={`px-4 py-2 rounded-[12px] text-base md:text-lg font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-sm whitespace-nowrap`}>
                      Ayah {language === "en" ? s.transInfo.numberInSurah : toBengaliNumber(s.transInfo.numberInSurah)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-8 items-center w-full relative z-10">
          {paginatedAyahs.map((ayah, index) => {
            const translationAyah = paginatedTranslationAyahs[index];
            const translationText = translationAyah?.text || "Translation missing";
            return (
              <div
                key={ayah.numberInSurah}
                id={`ayah-${ayah.numberInSurah}`}
                className={`ayah-card flex flex-col justify-center items-center bg-transparent border-2 ${borderMain} rounded-[20px] px-8 py-10 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full form-style-${theme}`}
              >
              <div className="flex flex-col w-full text-center items-center gap-8">
                
                {/* Header (Verse Number & Decor) */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-14 h-14 flex items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-2xl shadow-inner ${fontClass}`}>
                    {language === "en" ? ayah.numberInSurah : toBengaliNumber(ayah.numberInSurah)}
                  </div>
                </div>

                {/* Arabic Text */}
                <div 
                  className={`text-5xl md:text-6xl mb-2 leading-tight md:leading-snug font-lateef ${textMain}`} 
                  dir="rtl"
                >
                  {ayah.text} 
                </div>

                {/* Translation Text */}
                <div className={`text-xl md:text-2xl leading-relaxed opacity-85 ${textMain} ${fontClass} border-t-2 border-dashed border-emerald-500/30 pt-8 w-[90%] mx-auto mt-2`}>
                  {translationText}
                </div>

              </div>
            </div>
          );
        })}
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
      </div>
    </PageTransition>
  );
};

export default Surah;
