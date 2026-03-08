import { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import Card from "./Card";
import Loader from "../../Hooks/Loader";
import PageTransition from "../../Hooks/PageTransition";
import ErrorGPT from "../../Hooks/ErrorGPT";
import { usePageTitle } from "../../Hooks/pageName";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const fetcher = (url) => fetch(url).then((res) => res.json());
const ITEMS_PER_PAGE = 9;

const AsmaUlHusna = () => {
  usePageTitle("Asma Ul Husna", " | Dhikr Time");

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
  const bgActive = isDark ? "bg-text-dark" : "bg-text-light";
  const textActive = isDark ? "text-bg-dark" : "text-bg-light";
  const bgInactive = isDark ? "bg-bg-dark" : "bg-text-light";
  const fontClass = language === "en" ? "font-amiri" : "font-balooDa";

  const [page, setPage] = useState(1);
  const containerRef = useRef(null);

  const API_KEY = import.meta.env.VITE_SECRET_API_KEY;
  const url = `https://islamicapi.com/api/v1/asma-ul-husna/?language=${language}&api_key=${API_KEY}`;
  const { data, error, isLoading } = useSWR(url, fetcher);

  useGSAP(
    () => {
      gsap.from(".asma-title", {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.from(".asma-line", {
        scaleX: 0,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: "power3.out",
      });
      gsap.from(".page-info", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.5,
        ease: "power3.out",
      });
    },
    { scope: containerRef, dependencies: [language] },
  );

  if (isLoading) return <Loader />;
  if (error) return <ErrorGPT />;

  const entries = Object.entries(data?.data?.names || []);
  const totalPages = Math.ceil(entries.length / ITEMS_PER_PAGE);
  const paginatedData = entries.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const goToPage = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPageNumbers = () => {
    const pages = [];
    const delta = 1;

    const addPage = (pageNum) =>
      pages.push(
        <button
          key={pageNum}
          onClick={() => goToPage(pageNum)}
          className={`w-9 h-9 rounded-lg font-amiri font-semibold transition-colors cursor-pointer text-sm ${
            page === pageNum
              ? `${bgActive} ${textActive}`
              : `${bgInactive} ${textMain} hover:${bgActive} hover:${textActive}`
          }`}
        >
          {pageNum}
        </button>,
      );

    const addEllipsis = (key) =>
      pages.push(
        <span
          key={key}
          className={`w-9 h-9 flex items-center justify-center ${textMain} font-bold`}
        >
          …
        </span>,
      );

    addPage(1);
    const leftBound = page - delta;
    const rightBound = page + delta;
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
    `flex items-center justify-center w-9 h-9 rounded-lg font-amiri font-semibold transition-colors flex-shrink-0 ${
      disabled
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : `${bgActive} text-white hover:opacity-80`
    }`;

  return (
    <PageTransition>
      <div
        ref={containerRef}
        className="min-h-screen flex flex-col items-center px-6 md:px-10 py-20"
      >
        {/* Title */}
        <h1
          className={`asma-title text-4xl md:text-5xl lg:text-6xl ${fontClass} font-bold ${textMain} text-center mt-10 md:mt-20 md:mt-0 px-4`}
        >
          {language === "en" ? "Asma Ul Husna" : "আসমা উল হুসনা"}
        </h1>

        <div
          className={`asma-line h-2 w-[75%] md:w-[40%] bg-gradient-to-r from-transparent ${viaMain} to-transparent rounded-2xl mt-4 mb-12`}
        />

        {/* Page info */}
        <p className={`page-info text-xl ${textMain} mb-6 ${fontClass}`}>
          {language === "bn"
            ? `পৃষ্ঠা ${page} / ${totalPages}`
            : `Page ${page} of ${totalPages}`}
        </p>

        {/* Cards */}
        <div className="w-full max-w-6xl mb-8">
          <Card cardData={paginatedData} />
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-1.5 mb-20 w-full max-w-sm px-4">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className={prevNextClass(page === 1)}
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

          <div className="flex items-center gap-1.5">{renderPageNumbers()}</div>

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className={prevNextClass(page === totalPages)}
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

export default AsmaUlHusna;
