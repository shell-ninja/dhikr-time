import PageTransition from "../../../Hooks/PageTransition";
import { useRef, useState } from "react";
import "../Pages.css";
import { usePageTitle } from "../../../Hooks/pageName";
import useSWR from "swr";
import Loader from "../../../Hooks/Loader";
import ErrorGPT from "../../../Hooks/ErrorGPT";

const fetcher = (url) => fetch(url).then((res) => res.json());

const MorningEvening = () => {
  const containerRef = useRef(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  usePageTitle("Morning and Evening | Dua", " | Dhikr Time");

  // Getting the Language from "Dua" component
  const Language = localStorage.getItem("language") || "en";

  // const url = `https://dua-and-dhikr.onrender.com/${Language}/morning-evening`; // renrer
  const url = `https://dua-and-dhikr.vercel.app/${Language}/morning-evening`; // vercel
  // const url = `http://localhost:3000/${Language}/morning-evening`; // to test the app (api)
  
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
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    setExpandedCard(null);
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
              ? "bg-[#105A59] text-white"
              : "bg-[#E9F7E6] text-[#105A59] hover:bg-[#105A59] hover:text-white"
          }`}
        >
          {page}
        </button>,
      );

    const addEllipsis = (key) =>
      pages.push(
        <span
          key={key}
          className="w-9 h-9 flex items-center justify-center text-[#105A59] font-bold"
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
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-amiri font-bold text-[#105A59] text-center mt-10 md:mt-0 px-4">
          {data?.name || "Morning and Evening Duas"}
        </h1>

        <div className="h-2 w-[75%] md:w-[40%] bg-gradient-to-r from-transparent via-[#105A59] to-transparent rounded-2xl mt-4 mb-12"></div>

        {/* Page Info */}
        <p className="text-sm text-[#105A59] mb-6 font-amiri">
          {Language === "bn"
            ? `পৃষ্ঠা ${currentPage} / ${totalPages}`
            : `Page ${currentPage} of ${totalPages}`}
        </p>

        {/* Duas Container */}
        <div className="w-full max-w-4xl space-y-4 mb-8">
          {currentDuas.map((dua) => (
            <div
              key={dua.id}
              className="bg-transparent border-2 border-[#105A59] rounded-2xl overflow-hidden transition-all duration-300 form-style"
            >
              {/* Card Header - Always Visible */}
              <button
                onClick={() => toggleCard(dua.id)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-[#E9F7E6] transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-amiri font-bold text-[#105A59] bg-[#E9F7E6] w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    {dua.id}
                  </span>
                  <h3 className="text-xl md:text-2xl font-amiri font-semibold text-[#105A59] text-left">
                    {dua.name}
                  </h3>
                </div>

                {/* Expand/Collapse Icon */}
                <svg
                  className={`w-6 h-6 text-[#105A59] transition-transform duration-300 flex-shrink-0 ${
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
                <div className="px-6 pb-6 space-y-6 border-t-2 border-[#105A59] bg-transparent">
                  {/* Arabic Dua */}
                  <div className="pt-6">
                    <h4 className="text-xl font-amiri font-semibold text-[#105A59] mb-3">
                      {Language === "bn" ? "দু'আ:" : "Dua:"}
                    </h4>
                    <p className="text-3xl md:text-5xl font-lateef text-[#105A59] leading-loose text-right">
                      {dua.dua}
                    </p>
                  </div>

                  {/* Note */}
                  {dua.note ? (
                    <div>
                      <h4 className="text-xl font-amiri font-semibold text-[#105A59]">
                        {Language === "bn" ? "নোট:" : "Note:"}
                      </h4>
                      <p className="text-xl md:text-2xl font-lateef text-[#105A59] leading-relaxed">
                        {dua.note}
                      </p>
                    </div>
                  ) : (
                    ""
                  )}

                  {/* Translation */}
                  <div>
                    <h4 className="text-xl font-amiri font-semibold text-[#105A59] mb-3">
                      {Language === "bn" ? "অনুবাদ:" : "Translation:"}
                    </h4>
                    <p
                      className={`text-2xl {${Language === "bn" ? "md:text-3xl" : "md:text-4xl"}}  font-lateef text-[#105A59] leading-relaxed`}
                    >
                      {dua.translation}
                    </p>
                  </div>

                  {/* Times and Reference Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t-2 border-[#105A59]">
                    {/* Times */}
                    {dua.times && (
                      <div className="flex items-start gap-3">
                        <svg
                          className="w-6 h-6 text-[#105A59] mt-1 flex-shrink-0"
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
                          <h4 className="text-base font-amiri font-semibold text-[#105A59] mb-1">
                            {Language === "bn" ? "তিলাওয়াত:" : "Recite:"}
                          </h4>
                          <p className="text-xl font-amiri text-[#105A59] font-bold">
                            {dua.times}{" "}
                            {dua.times === "1" || dua.times === 1
                              ? Language === "bn"
                                ? "বার"
                                : "time"
                              : Language === "bn"
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
                          className="w-6 h-6 text-[#105A59] mt-1 flex-shrink-0"
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
                          <h4 className="text-base font-amiri font-semibold text-[#105A59] mb-1">
                            {Language === "bn" ? "রেফারেন্স:" : "Reference:"}
                          </h4>
                          <p className="text-xl font-amiri text-[#105A59] italic">
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
                : "bg-[#105A59] text-white hover:bg-[#0d4544]"
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
                : "bg-[#105A59] text-white hover:bg-[#0d4544]"
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

export default MorningEvening;
