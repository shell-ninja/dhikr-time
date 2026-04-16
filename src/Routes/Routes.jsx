import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Main from "./Main";

// ── Lazy-loaded page components ────────────────────────────
// Each component is only downloaded when the user first visits that route.
const Home           = lazy(() => import("../Components/Home/Home"));
const AsmaUlHusna    = lazy(() => import("../Components/AsmaUlHusna/AsmaUlHusna"));
const Dua            = lazy(() => import("../Components/Dua/Dua"));
const Times          = lazy(() => import("../Components/Times/Times"));
const Methods        = lazy(() => import("../Components/Form/Methods"));
const Tasbeeh        = lazy(() => import("../Components/Tasbeeh/Tasbeeh"));
const MorningEvening = lazy(() => import("../Components/Dua/MorningEvening/MorningEvening"));
const AfterSalah     = lazy(() => import("../Components/Dua/AfterSalah/AfterSalah"));
const Istighfar      = lazy(() => import("../Components/Dua/Istighfar/Istighfar"));
const QuranAndSunnah = lazy(() => import("../Components/Dua/QuranAndSunnah/QuranAndSunnah"));
const Quran          = lazy(() => import("../Components/Quran/Quran"));
const Surah          = lazy(() => import("../Components/Quran/Surah"));

// Minimal fallback — the app's own loader handles the full spinner
const PageLoader = () => (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }} />
);

const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const routes = createBrowserRouter([
  {
    path: "/",
    Component: Main,
    children: [
      { index: true,                    element: withSuspense(Home)           },
      { path: "dua",                    element: withSuspense(Dua)            },
      { path: "dua/morning-evening",    element: withSuspense(MorningEvening) },
      { path: "dua/after-salah",        element: withSuspense(AfterSalah)     },
      { path: "dua/quran-sunnah",       element: withSuspense(QuranAndSunnah) },
      { path: "dua/istighfar",          element: withSuspense(Istighfar)      },
      { path: "asma-ul-husna",          element: withSuspense(AsmaUlHusna)    },
      { path: "tasbeeh",                element: withSuspense(Tasbeeh)        },
      { path: "methods",                element: withSuspense(Methods)        },
      { path: "times",                  element: withSuspense(Times)          },
      { path: "quran",                  element: withSuspense(Quran)          },
      { path: "quran/:id",              element: withSuspense(Surah)          },
    ],
  },
]);

