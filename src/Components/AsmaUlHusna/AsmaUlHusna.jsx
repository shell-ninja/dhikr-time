import { useState } from "react";
import useSWR from "swr";
import Card from "./Card";
import Loader from "../../Hooks/Loader";

const fetcher = (url) => fetch(url).then((res) => res.json());

const ITEMS_PER_PAGE = 9;

const AsmaUlHusna = () => {
  const API_KEY = import.meta.env.VITE_SECRET_API_KEY;
  const LANGUAGE = "bn";

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
      <h1 className="text-2xl font-bold text-center mb-6">Asma Ul Husna</h1>

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
    </>
  );
};

export default AsmaUlHusna;
