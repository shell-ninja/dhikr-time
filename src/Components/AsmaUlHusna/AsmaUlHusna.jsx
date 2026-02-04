import { useState } from "react";
import useSWR from "swr";
import Card from "./Card";
import Loader from "../../Hooks/Loader";
import PageTransition from "../../Hooks/PageTransition";
import "./AsmaUlHusna.css";

const fetcher = (url) => fetch(url).then((res) => res.json());

const ITEMS_PER_PAGE = 9;

const AsmaUlHusna = () => {
  const [toggled, setToggled] = useState(false);
  const API_KEY = import.meta.env.VITE_SECRET_API_KEY;
  const LANGUAGE = toggled ? "bn" : "en";

  const url = `https://islamicapi.com/api/v1/asma-ul-husna/?language=${LANGUAGE}&api_key=${API_KEY}`;

  const { data, error, isLoading } = useSWR(url, fetcher);
  const [page, setPage] = useState(1);

  if (isLoading) return <Loader />;
  if (error) return <p>Error...</p>;

  const entries = Object.entries(data?.data?.names || []);
  const totalPages = Math.ceil(entries.length / ITEMS_PER_PAGE);

  const paginatedData = entries.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <>
      <PageTransition>
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-5xl text-[#105A59] font-amiri font-bold mt-20">
            Asma Ul Husna
          </h1>
          <div className="h-2 w-[75%] md:w-[40%] bg-[#105A59] rounded-2xl mt-2 mb-8"></div>
        </div>

        <div className="relative left-10 bottom-5">
          <button
            onClick={() => setToggled(!toggled)}
            className={`toggle-btn ${toggled ? "toggled" : ""}`}
          >
            <div className="circle">
              <p className={`en font-amiri ${toggled ? "en-hide" : ""}`}>en</p>
              <p className={`bn font-amiri ${toggled ? "bn-hide" : ""}`}>bn</p>
            </div>
          </button>
        </div>

        <div className="px-10">
          <Card cardData={paginatedData} />

          {/* Pagination */}
          <div className="flex justify-center gap-3 my-8">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 border-2 rounded-xl disabled:opacity-40 text-[#105A59] cursor-pointer border-[#105A59]"
            >
              Prev
            </button>

            <span className="px-3 py-2 font-semibold text-[#105A59]">
              {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-xl disabled:opacity-40 text-[#105A59] cursor-pointer border-[#105A59] border-2"
            >
              Next
            </button>
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default AsmaUlHusna;
