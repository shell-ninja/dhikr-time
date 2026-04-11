import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import PageTransition from "../../Hooks/PageTransition";
import useLanguage from "../../Hooks/useLanguage";
import useTheme from "../../Hooks/useTheme";
import { FiChevronLeft, FiChevronRight, FiSearch, FiLoader } from "react-icons/fi";
import surahsData from "../../Data/surahs.json";

const Quran = () => {

  const language = useLanguage();
  const theme = useTheme();

  const isDark = theme === "dark";
  const textMain = isDark ? "text-text-dark" : "text-text-light";
  const borderMain = isDark ? "border-text-dark" : "border-text-light";
  const viaMain = isDark ? "via-text-dark" : "via-text-light";
  const fontClass = language === "en" ? "font-mirza tracking-wide" : "font-balooDa";
  const dropdownBg = isDark ? "bg-bg-dark" : "bg-bg-light";

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  // Section 1: Surah name matches (local)
  const [nameSuggestions, setNameSuggestions] = useState([]);
  // Section 2: Ayah word matches (API)
  const [wordResults, setWordResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);
  const itemsPerPage = 10;
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Reset page on scroll
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Debounced universal search
  useEffect(() => {
    const q = searchQuery.trim();

    if (!q) {
      setNameSuggestions([]);
      setWordResults([]);
      setShowDropdown(false);
      setIsSearching(false);
      return;
    }

    // Always show name matches immediately from local data
    const lower = q.toLowerCase();
    const nameMatched = surahsData.filter(
      (s) =>
        s.englishName.toLowerCase().includes(lower) ||
        s.bengaliName.includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(lower) ||
        (s.bengaliNameTranslation && s.bengaliNameTranslation.includes(q))
    ).slice(0, 4);
    setNameSuggestions(nameMatched);
    setShowDropdown(true);

    // Debounce API word search (only if query >= 3 chars)
    if (q.length >= 3) {
      clearTimeout(debounceRef.current);
      setIsSearching(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const langParam = language === "en" ? "en" : "bn";
          const res = await fetch(`https://api.quran.com/api/v4/search?q=${encodeURIComponent(q)}&size=8&language=${langParam}`);
          const json = await res.json();

          if (json.search?.results) {
            const mappedResults = json.search.results.map(match => {
              const [surahNum, ayahNum] = match.verse_key.split(":");
              return {
                surah: { number: parseInt(surahNum) },
                numberInSurah: parseInt(ayahNum),
                // Quran.com returns translation if queried in translation language
                text: match.translations?.[0]?.text || match.text
              };
            });
            setWordResults(mappedResults);
          } else {
            setWordResults([]);
          }
        } catch {
          setWordResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 500);
    } else {
      setWordResults([]);
      setIsSearching(false);
    }
  }, [searchQuery, language]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSurah = (surahNumber) => {
    setSearchQuery("");
    setShowDropdown(false);
    navigate(`/quran/${surahNumber}`);
  };

  const handleSelectAyah = (surahNumber, ayahNumber) => {
    setSearchQuery("");
    setShowDropdown(false);
    navigate(`/quran/${surahNumber}`, { state: { jumpToAyah: ayahNumber } });
  };

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
    { scope: containerRef, dependencies: [currentPage] }
  );

  const surahs = surahsData;

  // Pagination Math (always shows all 114)
  const totalPages = Math.ceil(surahs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSurahs = surahs.slice(startIndex, startIndex + itemsPerPage);

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
          className={`w-10 h-10 rounded-[10px] font-bold transition-colors cursor-pointer text-sm shadow-none !drop-shadow-none ${fontClass} ${currentPage === pageNum
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
    `flex items-center justify-center w-10 h-10 rounded-[10px] font-bold transition-colors flex-shrink-0 shadow-none !drop-shadow-none ${disabled
      ? `bg-gray-400/20 text-gray-500 cursor-not-allowed border-2 border-transparent`
      : `${bgActive} ${textActive} hover:opacity-80 cursor-pointer`
    }`;

  const hasDropdownContent = nameSuggestions.length > 0 || wordResults.length > 0 || isSearching;

  return (
    <PageTransition>
      <div ref={containerRef} className="min-h-screen py-24 px-5 md:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-16 px-4 pt-10 md:pt-0">
          <h1
            className={`dua-title text-3xl md:text-5xl font-bold ${textMain} md:mt-20 ${language === "bn" ? "font-balooDa" : "font-amiri"
              }`}
          >
            {language === "bn" ? "আল কুরআন" : "The Noble Quran"}
          </h1>

          <div
            className={`dua-line h-2 w-[75%] md:w-[40%] bg-gradient-to-r from-transparent ${viaMain} to-transparent rounded-2xl mt-4 mb-6`}
          />

          <p className={`dua-title text-xl md:text-2xl opacity-80 ${textMain} ${fontClass}`}>
            {language === "en" ? "Read and reflect upon the words of Allah" : "আল্লাহর বাণী পড়ুন ও অনুধাবন করুন"}
          </p>

          {/* Universal Search Bar */}
          <div ref={searchRef} className="w-full max-w-xl mx-auto mt-8 relative z-40 dua-title">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
              {isSearching
                ? <FiLoader className={`text-xl animate-spin text-emerald-500`} />
                : <FiSearch className={`text-xl opacity-50 ${textMain}`} />
              }
            </div>
            <input
              type="text"
              placeholder={language === "en" ? "Search a Surah or any word across the Quran..." : "সূরা বা যেকোনো শব্দ কুরআন জুড়ে খুঁজুন..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => hasDropdownContent && setShowDropdown(true)}
              className={`w-full py-4 pl-12 pr-4 rounded-[20px] border-2 bg-transparent focus:outline-none transition-all duration-300 text-lg font-bold ${textMain} ${fontClass} ${isDark ? "focus:bg-white/5 border-white/20 focus:border-white/50" : "focus:bg-black/5 border-black/20 focus:border-black/50"}`}
            />

            {/* Suggestions Dropdown */}
            {showDropdown && (searchQuery.trim().length > 0) && (
              <div className={`absolute top-full mt-3 w-full rounded-[20px] border-2 ${borderMain} overflow-hidden shadow-2xl z-[9999] ${dropdownBg} max-h-[60vh] overflow-y-auto`}>

                {/* ── Section 1: Surah Name Matches ── */}
                {nameSuggestions.length > 0 && (
                  <div>
                    <div className={`px-5 py-2 text-xs font-bold uppercase tracking-widest text-emerald-500 border-b ${borderMain}`}>
                      {language === "en" ? "Surahs" : "সূরাসমূহ"}
                    </div>
                    {nameSuggestions.map((s) => (
                      <div
                        key={`name-${s.number}`}
                        onClick={() => handleSelectSurah(s.number)}
                        className={`px-5 py-3.5 cursor-pointer transition-all duration-200 border-b ${borderMain} hover:bg-emerald-500/15 group flex items-center gap-4`}
                      >
                        <span className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-base">
                          {language === "en" ? s.number : toBengaliNumber(s.number)}
                        </span>
                        <div className="flex flex-col min-w-0 flex-1 text-left">
                          <span className={`font-bold text-lg group-hover:text-emerald-500 transition-colors ${textMain} truncate ${language === "bn" ? "font-balooDa" : "font-mirza tracking-wide"}`}>
                            {language === "en" ? s.englishName : s.bengaliName}
                          </span>
                          <span className={`text-sm opacity-55 ${textMain} truncate ${language === "bn" ? "font-balooDa" : ""}`}>
                            {language === "en" ? s.englishNameTranslation : s.bengaliNameTranslation}
                          </span>
                        </div>
                        <span className={`font-mirza text-2xl flex-shrink-0 opacity-75 ${textMain}`} dir="rtl">
                          {s.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── Section 2: Ayah Word Matches ── */}
                {isSearching && wordResults.length === 0 && (
                  <div className={`px-5 py-5 flex items-center gap-3 ${textMain} opacity-60`}>
                    <FiLoader className="animate-spin text-emerald-500" />
                    <span className={`text-base ${fontClass}`}>
                      {language === "en" ? "Searching across Quran..." : "কুরআন জুড়ে অনুসন্ধান করা হচ্ছে..."}
                    </span>
                  </div>
                )}

                {!isSearching && wordResults.length > 0 && (
                  <div>
                    <div className={`px-5 py-2 text-xs font-bold uppercase tracking-widest text-emerald-500 border-b ${borderMain}`}>
                      {language === "en" ? `Ayahs containing "${searchQuery}"` : `"${searchQuery}" সম্বলিত আয়াতসমূহ`}
                    </div>
                    {wordResults.map((match, idx) => {
                      const localSurah = surahsData.find(s => s.number === match.surah.number);
                      const displayName = language === "en"
                        ? (localSurah?.englishName || match.surah.englishName)
                        : (localSurah?.bengaliName || match.surah.englishName);
                      return (
                        <div
                          key={`word-${idx}`}
                          onClick={() => handleSelectAyah(match.surah.number, match.numberInSurah)}
                          className={`px-5 py-4 cursor-pointer transition-all duration-200 border-b last:border-b-0 ${borderMain} hover:bg-emerald-500/15 group`}
                        >
                          {/* Surah + Ayah ref */}
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                              {displayName}
                            </span>
                            <span className={`text-xs opacity-50 font-semibold ${textMain}`}>
                              {language === "en" ? `Ayah ${match.numberInSurah}` : `আয়াত ${toBengaliNumber(match.numberInSurah)}`}
                            </span>
                          </div>
                          {/* Snippet */}
                          <p
                            className={`text-base leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity ${textMain} ${fontClass} line-clamp-2`}
                            dangerouslySetInnerHTML={{ __html: match.text }}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* No results at all */}
                {!isSearching && nameSuggestions.length === 0 && wordResults.length === 0 && searchQuery.trim().length > 0 && (
                  <div className={`px-5 py-6 text-center opacity-60 ${textMain} ${fontClass} text-base`}>
                    {language === "en" ? "No results found." : "কোনো ফলাফল পাওয়া যায়নি।"}
                  </div>
                )}
              </div>
            )}
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
                <h3 className={`text-5xl md:text-6xl font-mirza font-bold ${textMain} leading-snug mb-3`}>
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
      </div>
    </PageTransition>
  );
};

export default Quran;
