import PageTransition from "../../../Hooks/PageTransition";
import { useEffect, useRef, useState } from "react";
import "../Pages.css";
import { usePageTitle } from "../../../Hooks/pageName";
import useSWR from "swr";
import Loader from "../../../Hooks/Loader";
import ErrorGPT from "../../../Hooks/ErrorGPT";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Istighfar = () => {
  const containerRef = useRef(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [expandedTranslation, setExpandedTranslation] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  usePageTitle("Morning And Evening | Dua", " | Dhikr Time");

  // Getting the Language from "Dua" component
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

  const url = `https://dua-and-dhikr.vercel.app/${language}/istighfar`; // vercel
  // const url = `http://localhost:3000/${language}/istighfar`; // to test the app (api)

  const { data, error, isLoading } = useSWR(url, fetcher);

  if (isLoading) return <Loader />;
  if (error) return <ErrorGPT />;
  if (!data?.duas) return <div>No duas found</div>;

  // Pagination calculations
  const totalPages = Math.ceil(data.duas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDuas = data.duas.slice(startIndex, endIndex);

  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
    // Close translation dropdown when main card closes
    if (expandedCard === id) {
      setExpandedTranslation(null);
    }
  };

  const toggleTranslation = (id) => {
    setExpandedTranslation(expandedTranslation === id ? null : id);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    setExpandedCard(null);
    setExpandedTranslation(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPageNumbers = () => {
    const pages = [];
    const delta = 1;

    const addPage = (page) =>
      pages.push(
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`w-9 h-9 rounded-lg font-amiri font-semibold transition-colors cursor-pointer text-sm ${
            currentPage === page
              ? "bg-text text-white"
              : "bg-[#E9F7E6] text-text hover:bg-text hover:text-white"
          }`}
        >
          {page}
        </button>,
      );

    const addEllipsis = (key) =>
      pages.push(
        <span
          key={key}
          className="w-9 h-9 flex items-center justify-center text-text font-bold"
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

  return (
    <PageTransition>
      <div
        ref={containerRef}
        className="min-h-screen flex flex-col items-center px-6 md:px-10 py-20"
      >
        {/* Title Section */}
        <h1
          className={`text-4xl md:text-5xl lg:text-6xl ${language === "en" ? "font-amiri" : "font-balooDa"} font-bold text-text text-center mt-10 md:mt-0 px-4`}
        >
          {data?.name || "Morning And Evening Dua"}
        </h1>

        <div className="h-2 w-[75%] md:w-[40%] bg-gradient-to-r from-transparent via-text to-transparent rounded-2xl mt-4 mb-12"></div>

        {/* Page Info */}
        <p
          className={`text-xl text-text mb-6 ${language === "en" ? "font-amiri" : "font-balooDa"}`}
        >
          {language === "bn"
            ? `পৃষ্ঠা ${currentPage} / ${totalPages}`
            : `Page ${currentPage} of ${totalPages}`}
        </p>

        {/* Duas Container */}
        <div className="w-full max-w-4xl space-y-4 mb-8">
          {currentDuas.map((dua) => (
            <div
              key={dua.id}
              className="bg-transparent border-2 border-text rounded-2xl overflow-hidden transition-all duration-300 form-style"
            >
              {/* Card Header - Always Visible */}
              <button
                onClick={() => toggleCard(dua.id)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-[#E9F7E6] transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`text-2xl ${language === "en" ? "font-amiri" : "font-balooDa"} font-bold text-text bg-[#E9F7E6] w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`}
                  >
                    {dua.id}
                  </span>
                  <h3
                    className={`text-xl md:text-2xl ${language === "en" ? "font-amiri" : "font-balooDa"} font-semibold text-text text-left`}
                  >
                    {dua.name}
                  </h3>
                </div>

                {/* Expand/Collapse Icon */}
                <svg
                  className={`w-6 h-6 text-text transition-transform duration-300 flex-shrink-0 ${
                    expandedCard === dua.id ? "rotate-180" : ""
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

              {/* Card Content - Expandable */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  expandedCard === dua.id
                    ? "max-h-[3000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6 space-y-6 border-t-2 border-text bg-transparent">
                  {/* Arabic Dua */}
                  <div className="pt-6">
                    <h4
                      className={`text-xl ${language === "en" ? "font-amiri" : "font-balooDa"} font-semibold text-text mb-3`}
                    >
                      {language === "bn" ? "দু'আ:" : "Dua:"}
                    </h4>
                    <p className="text-4xl md:text-6xl font-lateef text-text leading-loose text-right">
                      {dua.dua}
                    </p>
                  </div>

                  {/* Note */}
                  {dua.note ? (
                    <div>
                      <h4
                        className={`text-xl ${language === "en" ? "font-amiri" : "font-balooDa"}  font-semibold text-text`}
                      >
                        {language === "bn" ? "নোট:" : "Note:"}
                      </h4>
                      <p
                        dangerouslySetInnerHTML={{ __html: dua.note }}
                        className="text-xl md:text-2xl font-lateef text-text leading-relaxed"
                      />
                    </div>
                  ) : (
                    ""
                  )}

                  {/* Pronunciation - Always visible in expanded card */}
                  <div>
                    <h4
                      className={`text-xl ${language === "en" ? "font-amiri" : "font-balooDa"} font-semibold text-text mb-3`}
                    >
                      {language === "bn" ? "উচ্চারণ:" : "Pronunciation:"}
                    </h4>
                    <p
                      className={`text-2xl ${language === "bn" ? "md:text-3xl" : "md:text-4xl"} ${language === "en" ? "font-amiri" : "font-balooDa"} text-text leading-relaxed`}
                    >
                      {dua.pronunciation}
                    </p>
                  </div>

                  {/* Translation - Nested Dropdown */}
                  <div>
                    <button
                      onClick={() => toggleTranslation(dua.id)}
                      className="w-full py-3 flex items-center justify-start gap-2 hover:opacity-70 cursor-pointer transition-opacity duration-200"
                    >
                      <div className="flex items-center gap-2">
                        {/* Book icon — filled when collapsed, outlined when expanded */}
                        {expandedTranslation === dua.id ? (
                          <svg
                            className="w-5 h-5 text-text flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5 text-text flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                          </svg>
                        )}
                        <h4
                          className={`text-xl ${language === "en" ? "font-amiri" : "font-balooDa"} font-semibold text-text`}
                        >
                          {language === "bn" ? "অনুবাদ" : "Translation"}
                        </h4>
                      </div>
                      <svg
                        className={`w-5 h-5 text-text transition-transform duration-300 flex-shrink-0 ${
                          expandedTranslation === dua.id ? "rotate-180" : ""
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

                    <div
                      className={`overflow-hidden transition-all duration-400 ease-in-out ${
                        expandedTranslation === dua.id
                          ? "max-h-[1000px] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="pb-4">
                        <p
                          className={`text-2xl ${language === "bn" ? "md:text-3xl" : "md:text-4xl"} ${language === "en" ? "font-amiri" : "font-balooDa"} text-text leading-relaxed`}
                        >
                          {dua.translation}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Times and Reference Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t-2 border-text">
                    {/* Times */}
                    {dua.times && (
                      <div className="flex items-start gap-3">
                        <svg
                          className="w-6 h-6 text-text mt-1 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <circle cx="12" cy="4" r="2" />
                          <circle cx="12" cy="12" r="2" />
                          <circle cx="12" cy="20" r="2" />
                          <circle cx="4" cy="8" r="1.5" />
                          <circle cx="20" cy="8" r="1.5" />
                          <circle cx="4" cy="16" r="1.5" />
                          <circle cx="20" cy="16" r="1.5" />
                          <circle cx="8" cy="6" r="1.5" />
                          <circle cx="16" cy="6" r="1.5" />
                          <circle cx="8" cy="18" r="1.5" />
                          <circle cx="16" cy="18" r="1.5" />
                        </svg>
                        <div>
                          <h4
                            className={`text-base ${language === "en" ? "font-amiri" : "font-balooDa"} font-semibold text-text mb-1`}
                          >
                            {language === "bn" ? "তিলাওয়াত:" : "Recite:"}
                          </h4>
                          <p
                            className={`text-xl ${language === "en" ? "font-amiri" : "font-balooDa"} text-text font-bold`}
                          >
                            {dua.times}{" "}
                            {dua.times === "1" || dua.times === 1
                              ? language === "bn"
                                ? "বার"
                                : "time"
                              : language === "bn"
                                ? "বার"
                                : "times"}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Reference */}
                    {dua.reference && (
                      <div className="flex items-start gap-3">
                        <svg
                          className="w-6 h-6 text-text mt-1 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                        <div>
                          <h4
                            className={`text-base ${language === "en" ? "font-amiri" : "font-balooDa"} font-semibold text-text mb-1`}
                          >
                            {language === "bn" ? "রেফারেন্স:" : "Reference:"}
                          </h4>
                          <p
                            className={`text-xl ${language === "en" ? "font-amiri" : "font-balooDa"} text-text italic`}
                          >
                            {dua.reference}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-center gap-1.5 mb-20 w-full max-w-sm px-4">
          {/* Previous Button */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center justify-center w-9 h-9 rounded-lg font-amiri font-semibold transition-colors flex-shrink-0 ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-text text-white hover:bg-[#0d4544]"
            }`}
            aria-label="Previous page"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Page Numbers with Ellipsis */}
          <div className="flex items-center gap-1.5">{renderPageNumbers()}</div>

          {/* Next Button */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center w-9 h-9 rounded-lg font-amiri font-semibold transition-colors flex-shrink-0 ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-text text-white hover:bg-[#0d4544]"
            }`}
            aria-label="Next page"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </PageTransition>
  );
};

export default Istighfar;
