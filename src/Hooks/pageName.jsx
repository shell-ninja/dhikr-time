import { useEffect } from "react";

export function usePageTitle(title, suffix = "") {
  useEffect(() => {
    const previousTitle = document.title;

    document.title = suffix ? `${title}${suffix}` : title;

    // Cleanup: restore previous title when component unmounts
    return () => {
      document.title = previousTitle;
    };
  }, [title, suffix]);
}
