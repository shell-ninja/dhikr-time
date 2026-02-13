import { useState } from "react";
import useSWR from "swr";
import Card from "./Card";
import Loader from "../../Hooks/Loader";
import PageTransition from "../../Hooks/PageTransition";
import "./AsmaUlHusna.css";
import ErrorGPT from "../../Hooks/ErrorGPT";
import { usePageTitle } from "../../Hooks/pageName";

const fetcher = (url) => fetch(url).then((res) => res.json());
const ITEMS_PER_PAGE = 9;

const AsmaUlHusna = () => {
  usePageTitle("Asma Ul Husna", " | Dhikr Time");
  const [toggled, setToggled] = useState(
    () => localStorage.getItem("language") === "bn",
  );
  const [page, setPage] = useState(1);

  const API_KEY = import.meta.env.VITE_SECRET_API_KEY;
  const LANGUAGE = toggled ? "bn" : "en";

  const setLan = () => {
    const newToggled = !toggled;
    setToggled(newToggled);
    localStorage.setItem("language", newToggled ? "bn" : "en");
  };

  const url = `https://islamicapi.com/api/v1/asma-ul-husna/?language=${LANGUAGE}&api_key=${API_KEY}`;

  const { data, error, isLoading } = useSWR(url, fetcher);

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

  return (
    <>
      <PageTransition>
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-5xl text-[#105A59] font-amiri font-bold mt-20">
            {LANGUAGE == "en" ? "Asma Ul Husna" : "আসমা উল হুসনা"}
          </h1>
          <div className="dua-line h-2 w-[75%] md:w-[40%] bg-gradient-to-r from-transparent via-[#105A59] to-transparent rounded-2xl mt-4 mb-12"></div>
        </div>

        <div className="relative left-10 bottom-5">
          <button
            onClick={() => setLan()}
            className={`toggle-btn ${toggled ? "toggled" : ""}`}
          >
            <div className="circle">
              <p className={`en font-amiri ${toggled ? "en-hide" : ""}`}>en</p>
              <p className={`bn font-amiri ${toggled ? "bn-hide" : ""}`}>bn</p>
            </div>
          </button>
        </div>

        {/* Page Info */}
        <p className="text-sm text-[#105A59] mb-6 font-amiri text-center">
          {toggled
            ? `পৃষ্ঠা ${page} / ${totalPages}`
            : `Page ${page} of ${totalPages}`}
        </p>

        <div className="px-10">
          <Card cardData={paginatedData} />

          {/* Pagination Controls */}
          <div className="flex items-center justify-center gap-2 my-8">
            {/* Previous Button */}
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg font-amiri font-semibold transition-colors ${
                page === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#105A59] text-white hover:bg-[#0d4544]"
              }`}
            >
              {toggled ? "পূর্ববর্তী" : "Previous"}
            </button>

            {/* Page Numbers */}
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-amiri font-semibold transition-colors ${
                      page === pageNum
                        ? "bg-[#105A59] text-white"
                        : "bg-[#E9F7E6] text-[#105A59] hover:bg-[#105A59] hover:text-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                ),
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-lg font-amiri font-semibold transition-colors ${
                page === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#105A59] text-white hover:bg-[#0d4544]"
              }`}
            >
              {toggled ? "পরবর্তী" : "Next"}
            </button>
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default AsmaUlHusna;
