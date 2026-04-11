import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { useEffect, useState, useRef, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import PageTransition from "../../Hooks/PageTransition";
import { FiChevronLeft, FiChevronRight, FiSearch, FiArrowLeft, FiArrowUp } from "react-icons/fi";
import Loader from "../../Hooks/Loader";
import useLanguage from "../../Hooks/useLanguage";
import useTheme from "../../Hooks/useTheme";
import surahsData from "../../Data/surahs.json";

const fetcher = (urls) => Promise.all(urls.map((url) => fetch(url).then((res) => res.json())));

const Surah = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const language = useLanguage();
  const theme = useTheme();

  const isDark = theme === "dark";
  const textMain = isDark ? "text-text-dark" : "text-text-light";
  const borderMain = isDark ? "border-text-dark" : "border-text-light";
  const fontClass =
    language === "en" ? "font-mirza tracking-wide" : "font-balooDa";

  const translationEdition = language === "bn" ? 161 : 20;

  const { data, error, isLoading } = useSWR(
    [
      `https://api.quran.com/api/v4/quran/verses/indopak?chapter_number=${id}`,
      `https://api.quran.com/api/v4/quran/translations/${translationEdition}?chapter_number=${id}`
    ],
    fetcher
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const containerRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [jumpTarget, setJumpTarget] = useState(null);
  const [showTopBtn, setShowTopBtn] = useState(false);

  // Scroll to top logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Pick up jumpToAyah from router state (e.g. from universal search)
  useEffect(() => {
    if (location.state?.jumpToAyah) {
      const ayahNum = location.state.jumpToAyah;
      const targetPage = Math.ceil(ayahNum / itemsPerPage);
      setCurrentPage(targetPage);
      setJumpTarget(ayahNum);
    }
  }, []);

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
    { scope: containerRef, dependencies: [currentPage, isLoading] },
  );

  const toBengaliNumber = (num) => {
    const bn = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
      .toString()
      .split("")
      .map((d) => (bn[parseInt(d)] !== undefined ? bn[parseInt(d)] : d))
      .join("");
  };

  const bgActive = isDark ? "bg-text-dark" : "bg-text-light";
  const textActive = isDark ? "text-bg-dark" : "text-bg-light";

  const arabicData = data?.[0];
  const translationData = data?.[1];

  // Quran.com API returns { verses: [...] } and { translations: [...] }
  const ayahs = useMemo(() => {
    return arabicData?.verses?.map(v => ({
      ...v,
      numberInSurah: parseInt(v.verse_key.split(":")[1]),
      // Strip Private Use Area (PUA) characters because Lateef doesn't support them
      // Add a non-breaking space before Waqf marks (U+06D6 - U+06DC) so they don't cluster on top of each other
      text: v.text_indopak.replace(/[\uE000-\uF8FF]/g, '').replace(/([\u06D6-\u06DC])/g, '\u00A0$1').replace(/([\u06D6-\u06DC])/g, '\u00A0$1')
    }));
  }, [arabicData]);

  const translationAyahs = useMemo(() => {
    return translationData?.translations?.map((t, idx) => ({
      ...t,
      numberInSurah: idx + 1
    }));
  }, [translationData]);

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
            // Handle possibility of empty or undefined text
            (bundle.transInfo.text && bundle.transInfo.text.toLowerCase().includes(term)) ||
            (bundle.arabicInfo.text && bundle.arabicInfo.text.includes(term)),
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

  if (error) {
    return (
      <div className="flex justify-center flex-col items-center h-[calc(100vh-100px)]">
        <h2 className="text-2xl font-bold text-red-500 mb-4">
          Error loading Surah
        </h2>
        <Link
          to="/quran"
          className="flex items-center gap-2 dark:text-emerald-400 text-emerald-600 hover:underline"
        >
          <FiArrowLeft /> Back to Surahs
        </Link>
      </div>
    );
  }

  if (!arabicData || !translationData) return null;

  const metaSurah = surahsData.find((s) => s.number.toString() === id);

  const surahName =
    language === "en" ? metaSurah?.englishName : metaSurah?.bengaliName;
  const surahArabicName = metaSurah?.name || "";
  const revelationType = metaSurah?.revelationType || "";

  const totalPages = Math.ceil(ayahs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedAyahs = ayahs.slice(startIndex, startIndex + itemsPerPage);
  const paginatedTranslationAyahs = translationAyahs.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

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
          className={`w-10 h-10 rounded-[10px] font-bold transition-colors cursor-pointer text-sm shadow-none !drop-shadow-none ${fontClass} ${currentPage === pageNum
              ? `${bgActive} ${textActive}`
              : `bg-transparent border-2 ${borderMain} ${textMain} hover:${bgActive} hover:${textActive}`
            }`}
        >
          {language === "en" ? pageNum : toBengaliNumber(pageNum)}
        </button>,
      );

    const addEllipsis = (key) =>
      pages.push(
        <span
          key={key}
          className={`w-10 h-10 flex items-center justify-center ${textMain} font-bold`}
        >
          …
        </span>,
      );

    addPage(1);
    const leftBound = currentPage - delta;
    const rightBound = currentPage + delta;
    if (leftBound > 2) addEllipsis("left");
    for (
      let i = Math.max(2, leftBound);
      i <= Math.min(totalPages - 1, rightBound);
      i++
    ) {
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

  return (
    <PageTransition>
      <div
        ref={containerRef}
        className="min-h-screen py-24 px-5 md:px-10 max-w-5xl mx-auto"
      >
        {/* Header Info */}
        <div className="mb-12 mt-10">
          <Link
            to="/quran"
            className={`inline-block mb-6 ${textMain} hover:text-emerald-500 hover:-translate-x-1 transition-all duration-300`}
            aria-label="Go Back"
          >
            <FiArrowLeft size={28} />
          </Link>

          {/* Bismillah Header SVG or text... using simple text for now */}
          <div className="text-center rounded-3xl p-10 bg-gradient-to-br from-emerald-500/10 to-transparent border dark:border-emerald-500/20 border-emerald-500/30 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>

            <h1
              className={`surah-header-text text-5xl md:text-6xl font-mirza font-bold mb-3 ${textMain} relative z-10`}
            >
              {surahArabicName}
            </h1>
            <h2
              className={`surah-header-text text-3xl font-bold ${textMain} opacity-90 mb-2 relative z-10 ${fontClass}`}
            >
              {surahName}
            </h2>
            <p
              className={`surah-header-text text-lg opacity-75 font-semibold mb-6 relative z-10 ${textMain} ${fontClass}`}
            >
              {revelationType} •{" "}
              {language === "en" ? ayahs.length : toBengaliNumber(ayahs.length)}{" "}
              {language === "en" ? "Verses" : "আয়াত"}
            </p>

            {/* Render Bismillah if it's not Surah Al-Tawbah (9) or Al-Fatihah (which has it as verse 1) */}
            {id !== "9" && id !== "1" && (
              <div className="pt-6 mt-6 border-t border-dashed border-emerald-500/30">
                <p
                  className={`bismillah-text text-5xl md:text-6xl font-amiri mb-2 ${textMain}`}
                >
                  ﷽
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
            placeholder={
              language === "en"
                ? "Search translation or Arabic..."
                : "অনুবাদ বা আরবি খুঁজুন..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full py-4 pl-12 pr-4 rounded-[15px] border-2 bg-transparent focus:outline-none transition-all duration-300 font-bold ${textMain} ${fontClass} form-style-${theme} ${isDark ? "focus:bg-bg-dark/50 border-text-dark/20 focus:border-text-dark" : "focus:bg-bg-light/50 border-text-light/20 focus:border-text-light"}`}
          />

          {/* Dropdown Suggestions */}
          {suggestions.length > 0 && (
            <div
              className={`absolute top-full mt-3 w-full rounded-[20px] border-2 ${borderMain} overflow-hidden shadow-2xl backdrop-blur-xl z-50 form-style-${theme}`}
            >
              {suggestions.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => handleJumpToAyah(s.transInfo.numberInSurah)}
                  className={`px-6 md:px-8 py-5 cursor-pointer transition-all duration-300 border-b last:border-b-0 ${borderMain} hover:bg-emerald-500/20 group`}
                >
                  <div className="flex justify-between items-center gap-6">
                    <p
                      className={`truncate w-[80%] text-lg md:text-xl font-medium opacity-90 transition-colors group-hover:text-emerald-500 ${textMain} ${fontClass}`}
                    >
                      {s.transInfo.text}
                    </p>
                    <span
                      className={`px-4 py-2 rounded-[12px] text-base md:text-lg font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-sm whitespace-nowrap`}
                    >
                      Ayah{" "}
                      {language === "en"
                        ? s.transInfo.numberInSurah
                        : toBengaliNumber(s.transInfo.numberInSurah)}
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
            const translationText =
              translationAyah?.text || "Translation missing";
            return (
              <div
                key={ayah.numberInSurah}
                id={`ayah-${ayah.numberInSurah}`}
                className={`ayah-card flex flex-col justify-center items-center bg-transparent border-2 ${borderMain} rounded-[20px] px-8 py-10 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full form-style-${theme}`}
              >
                <div className="flex flex-col w-full text-center items-center gap-8">
                  {/* Header (Verse Number & Decor) */}
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-14 h-14 flex items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-2xl shadow-inner ${fontClass}`}
                    >
                      {language === "en"
                        ? ayah.numberInSurah
                        : toBengaliNumber(ayah.numberInSurah)}
                    </div>
                  </div>

                  {/* Arabic Text */}
                  <div
                    className={`text-5xl md:text-6xl mb-2 leading-tight md:leading-snug font-mirza ${textMain}`}
                    dir="rtl"
                  >
                    {ayah.text}
                  </div>

                  {/* Translation Text */}
                  <div
                    className={`text-xl md:text-2xl leading-relaxed opacity-85 ${textMain} ${fontClass} border-t-2 border-dashed border-emerald-500/30 pt-8 w-[90%] mx-auto mt-2`}
                    dangerouslySetInnerHTML={{ __html: translationText }}
                  />
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

            <div className="flex items-center gap-1.5">
              {renderPageNumbers()}
            </div>

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

        {/* Go to Top Button */}
        <button
          onClick={goToTop}
          className={`fixed bottom-5 right-5 md:bottom-8 md:right-8 z-50 p-2.5 md:p-3.5 rounded-full bg-emerald-500 text-bg-light shadow-xl hover:bg-emerald-600 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center border-2 border-emerald-400 dark:border-emerald-600 ${showTopBtn
              ? "opacity-100 translate-y-0 visible"
              : "opacity-0 translate-y-10 invisible"
            }`}
          aria-label="Go to top"
        >
          <FiArrowUp className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
    </PageTransition>
  );
};

export default Surah;
