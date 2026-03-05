import { useRef, useState, useEffect } from "react";
import useSWR from "swr";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Loader from "../../Hooks/Loader";
import ErrorGPT from "../../Hooks/ErrorGPT";

gsap.registerPlugin(ScrollTrigger);

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error("Failed to fetch prayer times");
    error.status = res.status;
    throw error;
  }
  return res.json();
};

const Times = ({ formData }) => {
  // ── Language ──────────────────────────────────────────────
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en",
  );
  useEffect(() => {
    const handle = () =>
      setLanguage(localStorage.getItem("language") || "en");
    window.addEventListener("storage", handle);
    window.addEventListener("languageChange", handle);
    return () => {
      window.removeEventListener("storage", handle);
      window.removeEventListener("languageChange", handle);
    };
  }, []);

  // ── Theme ─────────────────────────────────────────────────
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );
  useEffect(() => {
    const handle = () =>
      setTheme(localStorage.getItem("theme") || "light");
    window.addEventListener("storage", handle);
    window.addEventListener("themeChange", handle);
    return () => {
      window.removeEventListener("storage", handle);
      window.removeEventListener("themeChange", handle);
    };
  }, []);

  const isDark = theme === "dark";
  const textMain   = isDark ? "text-text-dark"  : "text-text-light";
  const borderMain = isDark ? "border-text-dark" : "border-text-light";
  const viaMain    = isDark ? "via-text-dark"    : "via-text-light";
  const fontClass  = language === "bn" ? "font-balooDa" : "font-amiri";

  // ── Form data ─────────────────────────────────────────────
  const {
    City: city,
    Country: country,
    Latitude: lat,
    Longitude: lon,
    Method: selectedMethod,
    Number: schoolNum,
  } = formData;

  const dateRef        = useRef(null);
  const locationRef    = useRef(null);
  const dividerRef     = useRef(null);
  const prayerCardsRef = useRef([]);

  const API_KEY = import.meta.env.VITE_SECRET_API_KEY;
  const API = `https://islamicapi.com/api/v1/prayer-time/?lat=${lat}&lon=${lon}&method=${selectedMethod}&school=${schoolNum}&api_key=${API_KEY}`;
  const shouldFetch = Boolean(lat && lon);

  const { data, error, isLoading } = useSWR(shouldFetch ? API : null, fetcher);

  // ── Animations ────────────────────────────────────────────
  useGSAP(() => {
    if (!data) return;

    const fromScrollTrigger = (ref, props) =>
      gsap.from(ref.current, {
        ...props,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

    fromScrollTrigger(dateRef,     { y: -50, opacity: 0, duration: 0.8 });
    fromScrollTrigger(locationRef, { y: -30, opacity: 0, duration: 0.8, delay: 0.1 });
    fromScrollTrigger(dividerRef,  { scaleX: 0, opacity: 0, duration: 0.8, delay: 0.2 });

    prayerCardsRef.current.forEach((card, index) => {
      if (!card) return;
      gsap.from(card, {
        y: 50,
        opacity: 0,
        duration: 0.6,
        delay: 0.4 + index * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });
    });
  }, [data]);

  if (!shouldFetch) return <ErrorGPT />;
  if (isLoading)    return <Loader />;
  if (error)        return <ErrorGPT />;

  const date  = data?.data?.date;
  const times = data?.data?.times;

  if (!date || !times) return <ErrorGPT />;

  // ── Translations ──────────────────────────────────────────
  const prayerNames = {
    en: { Fajr: "Fajr", Sunrise: "Sunrise", Dhuhr: "Dhuhr", Asr: "Asr", Maghrib: "Maghrib", Isha: "Isha", Tahajjud: "Tahajjud" },
    bn: { Fajr: "ফজর", Sunrise: "সূর্যোদয়", Dhuhr: "যুহর", Asr: "আসর", Maghrib: "মাগরিব", Isha: "ইশা", Tahajjud: "তাহাজ্জুদ" },
  };

  const prayerTimes = {
    Fajr:     times.Fajr,
    Sunrise:  times.Sunrise,
    Dhuhr:    times.Dhuhr,
    Asr:      times.Asr,
    Maghrib:  times.Maghrib,
    Isha:     times.Isha,
    Tahajjud: times.Lastthird,
  };

  // ── Helpers ───────────────────────────────────────────────
  const toBengaliNumber = (num) => {
    const bn = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
    return num.toString().split("").map((d) => bn[parseInt(d)]).join("");
  };

  const formatDate = (dateObj) => {
    if (language === "bn") {
      const monthsBn = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];
      const parts      = dateObj.readable.split(" ");
      const day        = toBengaliNumber(parseInt(parts[0]));
      const monthIndex = new Date(Date.parse(parts[1] + " 1, 2000")).getMonth();
      const year       = toBengaliNumber(parts[2].replace(",", ""));
      return `${day} ${monthsBn[monthIndex]}, ${year}`;
    }
    return dateObj.readable;
  };

  const formatTime = (time) => {
    const [h, m] = time.split(":").map(Number);
    const hour   = h % 12 || 12;
    const period = h >= 12 ? "PM" : "AM";
    if (language === "bn") {
      return `${toBengaliNumber(hour)}:${toBengaliNumber(m.toString().padStart(2, "0"))} ${period}`;
    }
    return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="flex flex-col justify-center items-center my-20">
      <h1
        ref={dateRef}
        className={`text-4xl md:text-5xl font-bold ${textMain} ${fontClass}`}
      >
        {formatDate(date)}
      </h1>

      <h3
        ref={locationRef}
        className={`text-2xl md:text-3xl font-bold ${textMain} mt-3 ${fontClass} text-center`}
      >
        {city}, {country}
      </h3>

      <div
        ref={dividerRef}
        className={`dua-line h-2 w-[75%] md:w-[40%] bg-gradient-to-r from-transparent ${viaMain} to-transparent rounded-2xl mt-4 mb-12`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mt-8">
        {Object.entries(prayerTimes).map(([name, time], index) => (
          <div
            key={name}
            ref={(el) => (prayerCardsRef.current[index] = el)}
            className={`flex flex-col justify-center items-center bg-transparent border-2 ${borderMain} rounded-[20px] px-10 py-6 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full form-style-${theme} ${
              index === 6 ? "md:col-span-2 lg:col-span-3" : ""
            }`}
          >
            <div className="flex justify-center items-center gap-3 mb-2">
              <h4 className={`text-2xl md:text-3xl font-bold ${textMain} ${fontClass}`}>
                {prayerNames[language][name]}
              </h4>
              <img src={`/icons/${theme}/${name}.svg`} alt={name} className="w-8 h-8 mb-2" />
            </div>
            <p className={`text-3xl md:text-4xl font-bold ${textMain} ${fontClass}`}>
              {formatTime(time)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Times;