import { createBrowserRouter } from "react-router-dom";
import Main from "./Main";
import Home from "../Components/Home/Home";
import AsmaUlHusna from "../Components/AsmaUlHusna/AsmaUlHusna";
import Dua from "../Components/Dua/Dua";
import Times from "../Components/Times/Times";
import Methods from "../Components/Form/Methods";

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
        path: "/dua",
        Component: Dua,
      },
      {
        path: "/asma-ul-husna",
        Component: AsmaUlHusna,
      },
      {
        path: "/methods",
        Component: Methods,
      },
      {
        path: "/times",
        Component: Times,
      },
    ],
  },
]);
