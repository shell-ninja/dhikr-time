import PageTransition from "../../../Hooks/PageTransition";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState, useEffect } from "react";
import "../Pages.css";
import { usePageTitle } from "../../../Hooks/pageName";
import useTheme from "../../../Hooks/useTheme";

const QuranAndSunnah = () => {
  const containerRef = useRef(null);
  usePageTitle("Other Duas | Dua", " | Dhikr Time");

  // ── Theme ─────────────────────────────────────────────────
  // const [theme, setTheme] = useState(
  //   () => localStorage.getItem("theme") || "light",
  // );
  // useEffect(() => {
  //   const handle = () => setTheme(localStorage.getItem("theme") || "light");
  //   window.addEventListener("storage", handle);
  //   window.addEventListener("themeChange", handle);
  //   return () => {
  //     window.removeEventListener("storage", handle);
  //     window.removeEventListener("themeChange", handle);
  //   };
  // }, []);

  const theme = useTheme();
  const isDark = theme === "dark";
  const textMain = isDark ? "text-text-dark" : "text-text-light";
  const viaMain = isDark ? "via-text-dark" : "via-text-light";
  const borderCard = isDark ? "border-text-dark/10" : "border-text-light/10";
  const decoFrom = isDark ? "from-text-dark" : "from-text-light";
  const decoVia = isDark ? "via-[#c2ebfa]" : "via-[#c2ebfa]";
  const decoTo = isDark ? "to-text-dark" : "to-text-light";
  const bodyText = isDark ? "text-gray-300" : "text-gray-700";
  const bodyTextSm = isDark ? "text-gray-400" : "text-gray-600";
  const dotBg = isDark ? "bg-text-dark" : "bg-text-light";
  const circBg = isDark
    ? "from-text-dark/10 to-[#c2ebfa]/5"
    : "from-text-light/10 to-[#c2ebfa]/5";

  useGSAP(
    () => {
      gsap.from(".dua-title", {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.from(".dua-line", {
        scaleX: 0,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: "power3.out",
      });
      gsap.from(".content-card", {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.6,
        ease: "back.out(1.7)",
      });
      gsap.from(".deco-circle", {
        scale: 0,
        opacity: 0,
        duration: 1,
        delay: 0.9,
        stagger: 0.1,
        ease: "elastic.out(1, 0.5)",
      });
      gsap.to(".deco-circle", {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2,
      });
    },
    { scope: containerRef },
  );

  return (
    <PageTransition>
      <div
        ref={containerRef}
        className="min-h-screen flex flex-col justify-center items-center px-6 md:px-10 py-20 relative overflow-hidden"
      >
        {/* Decorative background blobs */}
        <div
          className={`deco-circle absolute top-20 left-10 w-32 h-32 ${dotBg} opacity-5 rounded-full blur-2xl`}
        />
        <div
          className={`deco-circle absolute bottom-32 right-20 w-40 h-40 ${dotBg} opacity-5 rounded-full blur-2xl`}
        />
        <div
          className={`deco-circle absolute top-1/2 left-1/4 w-24 h-24 ${dotBg} opacity-5 rounded-full blur-2xl`}
        />

        {/* Title */}
        <h1
          className={`dua-title text-4xl md:text-5xl lg:text-6xl font-amiri font-bold ${textMain} text-center mt-10 md:mt-20 px-4`}
        >
          Duas from the Quran and Sunnah
        </h1>

        <div
          className={`dua-line h-2 w-[75%] md:w-[40%] bg-gradient-to-r from-transparent ${viaMain} to-transparent rounded-2xl mt-4 mb-12`}
        />

        {/* Main card */}
        <div className="content-card max-w-3xl w-full mx-auto mb-10">
          <div
            className={`relative bg-transparent rounded-3xl shadow-2xl overflow-hidden border ${borderCard}`}
          >
            {/* Top accent bar */}
            <div
              className={`h-1.5 bg-gradient-to-r ${decoFrom} ${decoVia} ${decoTo}`}
            />

            <div className="p-8 md:p-12">
              {/* Icon */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div
                    className={`w-32 h-32 bg-gradient-to-br ${circBg} rounded-full flex items-center justify-center`}
                  >
                    <svg
                      className={`w-16 h-16 ${textMain}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div
                    className={`absolute inset-0 rounded-full border-2 ${isDark ? "border-text-dark/20" : "border-text-light/20"} animate-ping-slow`}
                  />
                </div>
              </div>

              {/* Message */}
              <div className="text-center space-y-6">
                <h2
                  className={`text-2xl md:text-3xl font-amiri font-semibold ${textMain} leading-relaxed`}
                >
                  Content Coming Soon
                </h2>

                <div
                  className={`w-20 h-1 bg-gradient-to-r ${decoFrom} ${decoVia} mx-auto rounded-full`}
                />

                <p
                  className={`text-lg md:text-xl ${bodyText} leading-relaxed font-lateef`}
                >
                  The REST API for duas are being prepared by the developer.
                </p>

                <p
                  className={`text-base md:text-lg ${bodyTextSm} leading-relaxed font-lateef italic`}
                >
                  Have patience, it will be released soon{" "}
                  <span
                    className={`font-amiri font-semibold ${textMain} not-italic`}
                  >
                    إِنْ شَاءَ ٱللَّٰهُ
                  </span>
                </p>

                {/* Bouncing dots */}
                <div className="pt-6">
                  <div className="flex items-center justify-center space-x-2">
                    <div
                      className={`w-3 h-3 ${dotBg} rounded-full animate-bounce`}
                    />
                    <div
                      className={`w-3 h-3 ${dotBg} rounded-full animate-bounce delay-100`}
                    />
                    <div
                      className={`w-3 h-3 ${dotBg} rounded-full animate-bounce delay-200`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom accent bar */}
            <div
              className={`h-2 bg-gradient-to-r ${isDark ? "from-text-dark/5 via-[#c2ebfa]/10 to-text-dark/5" : "from-text-light/5 via-[#c2ebfa]/10 to-text-light/5"}`}
            />
          </div>

          {/* Info card */}
          <div
            className={`mt-8 bg-transparent backdrop-blur-sm rounded-2xl p-6 border ${borderCard} shadow-lg`}
          >
            <p
              className={`text-center ${bodyTextSm} text-sm md:text-base font-lateef`}
            >
              Stay tuned for authentic duas from the Quran and the Sunnah
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default QuranAndSunnah;
