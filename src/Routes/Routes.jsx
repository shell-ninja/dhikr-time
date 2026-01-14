import { createBrowserRouter } from "react-router-dom";
import Main from "./Main";
import Home from "../Components/Home/Home";
import AsmaUlHusna from "../Components/AsmaUlHusna/AsmaUlHusna";
import PrayerTime from "../Components/PrayerTime/PrayerTime";

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
        path: "/prayer-time",
        Component: PrayerTime,
      },
      {
        path: "/asma-ul-husna",
        Component: AsmaUlHusna,
      },
    ],
  },
]);
