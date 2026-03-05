import { useRef, useState, useEffect } from "react";
import useSWR from "swr";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Loader from "../../Hooks/Loader";
import ErrorGPT from "../../Hooks/ErrorGPT";

gsap.registerPlugin(ScrollTrigger);

// Safe SWR fetcher
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
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  // Listen for language changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const newLanguage = localStorage.getItem("language") || "en";
      setLanguage(newLanguage);
    };

    // Listen for storage events (works across tabs)
    window.addEventListener("storage", handleStorageChange);

    // Custom event for same-tab changes
    window.addEventListener("languageChange", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("languageChange", handleStorageChange);
    };
  }, []);

  const {
    City: city,
    Country: country,
    Latitude: lat,
    Longitude: lon,
    Method: selectedMethod,
    Number: schoolNum,
  } = formData;

  const dateRef = useRef(null);
  const locationRef = useRef(null);
  const dividerRef = useRef(null);
  const prayerCardsRef = useRef([]);

  const API_KEY = import.meta.env.VITE_SECRET_API_KEY;

  const API = `https://islamicapi.com/api/v1/prayer-time/?lat=${lat}&lon=${lon}&method=${selectedMethod}&school=${schoolNum}&api_key=${API_KEY}`;

  // Guard: fetch only when coords exist
  const shouldFetch = Boolean(lat && lon);

  const { data, error, isLoading } = useSWR(shouldFetch ? API : null, fetcher);

  // Animations (only when data exists)
  useGSAP(() => {
    if (!data) return;

    gsap.from(dateRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: dateRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });

    gsap.from(locationRef.current, {
      y: -30,
      opacity: 0,
      duration: 0.8,
      delay: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: locationRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });

    gsap.from(dividerRef.current, {
      scaleX: 0,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: dividerRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });

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
  if (isLoading) return <Loader />;
  if (error) return <ErrorGPT />;

  const date = data?.data?.date;
  const times = data?.data?.times;

  if (!date || !times) return <ErrorGPT />;

  // Prayer names translations
  const prayerNames = {
    en: {
      Fajr: "Fajr",
      Sunrise: "Sunrise",
      Dhuhr: "Dhuhr",
      Asr: "Asr",
      Maghrib: "Maghrib",
      Isha: "Isha",
      Tahajjud: "Tahajjud",
    },
    bn: {
      Fajr: "ফজর",
      Sunrise: "সূর্যোদয়",
      Dhuhr: "যুহর",
      Asr: "আসর",
      Maghrib: "মাগরিব",
      Isha: "ইশা",
      Tahajjud: "তাহাজ্জুদ",
    },
  };

  const prayerTimes = {
    Fajr: times.Fajr,
    Sunrise: times.Sunrise,
    Dhuhr: times.Dhuhr,
    Asr: times.Asr,
    Maghrib: times.Maghrib,
    Isha: times.Isha,
    Tahajjud: times.Lastthird,
  };

  // Convert English numerals to Bengali numerals
  const toBengaliNumber = (num) => {
    const bengaliNumerals = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
      .toString()
      .split("")
      .map((d) => bengaliNumerals[parseInt(d)])
      .join("");
  };

  // Format date based on language
  const formatDate = (dateObj) => {
    if (language === "bn") {
      // Bengali month names
      const monthsBn = [
        "জানুয়ারি",
        "ফেব্রুয়ারি",
        "মার্চ",
        "এপ্রিল",
        "মে",
        "জুন",
        "জুলাই",
        "আগস্ট",
        "সেপ্টেম্বর",
        "অক্টোবর",
        "নভেম্বর",
        "ডিসেম্বর",
      ];

      // Parse the readable date (e.g., "14 February, 2026")
      const parts = dateObj.readable.split(" ");
      const day = toBengaliNumber(parseInt(parts[0]));
      const monthIndex = new Date(Date.parse(parts[1] + " 1, 2000")).getMonth();
      const month = monthsBn[monthIndex];
      const year = toBengaliNumber(parts[2].replace(",", ""));

      return `${day} ${month}, ${year}`;
    }

    return dateObj.readable;
  };

  const formatTime = (time) => {
    const [h, m] = time.split(":").map(Number);
    const hour = h % 12 || 12;
    const period = h >= 12 ? "PM" : "AM";
    const periodBn = h >= 12 ? "PM" : "AM";

    if (language === "bn") {
      const hourBn = toBengaliNumber(hour);
      const minuteBn = toBengaliNumber(m.toString().padStart(2, "0"));
      return `${hourBn}:${minuteBn} ${periodBn}`;
    }

    return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <div className="flex flex-col justify-center items-center my-20 px-4">
      <h1
        ref={dateRef}
        className={`text-4xl md:text-5xl font-bold text-[#105A59] ${
          language === "bn" ? "font-balooDa" : "font-amiri"
        }`}
      >
        {formatDate(date)}
      </h1>

      <h3
        ref={locationRef}
        className={`text-2xl md:text-3xl font-bold text-[#105A59] mt-3 ${
          language === "bn" ? "font-balooDa" : "font-amiri"
        } text-center`}
      >
        {city}, {country}
      </h3>

      <div
        ref={dividerRef}
        className="dua-line h-2 w-[75%] md:w-[40%] bg-gradient-to-r from-transparent via-[#105A59] to-transparent rounded-2xl mt-4 mb-12"
      ></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mt-8">
        {Object.entries(prayerTimes).map(([name, time], index) => (
          <div
            key={name}
            ref={(el) => (prayerCardsRef.current[index] = el)}
            className={`flex flex-col justify-center items-center bg-transparent border-2 border-[#105A59] rounded-[20px] px-15 py-6 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full form-style ${
              index === 6 ? "md:col-span-2 lg:col-span-3" : ""
            }`}
          >
            <h4
              className={`text-2xl md:text-3xl font-bold text-[#105A59] mb-4 ${
                language === "bn" ? "font-balooDa" : "font-amiri"
              }`}
            >
              {prayerNames[language][name]}
            </h4>

            <p
              className={`text-3xl md:text-4xl font-bold text-[#105A59] ${
                language === "bn" ? "font-balooDa" : "font-amiri"
              }`}
            >
              {formatTime(time)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Times;

