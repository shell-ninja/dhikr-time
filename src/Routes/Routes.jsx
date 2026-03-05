import { createBrowserRouter } from "react-router-dom";
import Main from "./Main";
import Home from "../Components/Home/Home";
import AsmaUlHusna from "../Components/AsmaUlHusna/AsmaUlHusna";
import Dua from "../Components/Dua/Dua";
import Times from "../Components/Times/Times";
import Methods from "../Components/Form/Methods";

import MorningEvening from "../Components/Dua/MorningEvening/MorningEvening";
import AfterSalah from "../Components/Dua/AfterSalah/AfterSalah";
import Istighfar from "../Components/Dua/Istighfar/Istighfar";
import QuranAndSunnah from "../Components/Dua/QuranAndSunnah/QuranAndSunnah";

export const routes = createBrowserRouter([
  {
    path: "/",
    Component: Main,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "dua", // ✅ relative
        Component: Dua,
      },
      {
        path: "dua/morning-evening", // /dua/morning-evening
        Component: MorningEvening,
      },
      {
        path: "dua/after-salah",
        Component: AfterSalah,
      },
      {
        path: "dua/quran-sunnah",
        Component: QuranAndSunnah,
      },
      {
        path: "dua/istighfar",
        Component: Istighfar,
      },
      {
        path: "asma-ul-husna",
        Component: AsmaUlHusna,
      },
      {
        path: "methods",
        Component: Methods,
      },
      {
        path: "times",
        Component: Times,
      },
    ],
  },
]);
