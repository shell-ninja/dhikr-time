import { useState, useRef, useEffect } from "react";
import "./Form.css";
import { Link } from "react-router-dom";
import Times from "../Times/Times";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Loader from "../../Hooks/Loader";
import { countries } from "../../Hooks/CountriesArray";
import useAlert from "../../Hooks/useAllert";
import useTheme from "../../Hooks/useTheme";

gsap.registerPlugin(ScrollTrigger);

const schools = ["Hanafi", "Shafie"];
const methods = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
].map(Number);

const STORAGE_KEY = "prayerTimesFormData";

const Form = () => {
  // ── Language ──────────────────────────────────────────────
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en",
  );
  useEffect(() => {
    const handle = () => setLanguage(localStorage.getItem("language") || "en");
    window.addEventListener("storage", handle);
    window.addEventListener("languageChange", handle);
    return () => {
      window.removeEventListener("storage", handle);
      window.removeEventListener("languageChange", handle);
    };
  }, []);

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

  // ── Convenience class shorthands (avoids repeating ternaries) ──
  const textMain = isDark ? "text-text-dark" : "text-text-light";
  const borderMain = isDark ? "border-text-dark" : "border-text-light";
  const bgDropdown = isDark ? "bg-text-dark" : "bg-text-light";
  const textInside = isDark ? "text-bg-dark" : "text-bg-light";
  const hoverItem = isDark
    ? "hover:bg-bg-dark hover:text-text-dark"
    : "hover:bg-bg-light hover:text-text-light";

  // ── Form state ────────────────────────────────────────────
  const [selectedSchool, setSelectedSchool] = useState(
    () => localStorage.getItem("prayerSchool") || schools[0],
  );
  const [schoolOpen, setSchoolOpen] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState(
    () => Number(localStorage.getItem("prayerMethod")) || methods[0],
  );
  const [methodOpen, setMethodOpen] = useState(false);

  const [city, setCity] = useState(
    () => localStorage.getItem("prayerCity") || "",
  );
  const [country, setCountry] = useState(
    () => localStorage.getItem("prayerCountry") || "",
  );

  const [countrySuggestions, setCountrySuggestions] = useState([]);
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(-1);

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const { showAlert } = useAlert();

  const shouldScroll = useRef(false);

  // ── Refs — mobile ─────────────────────────────────────────
  const titleRef = useRef(null);
  const dividerRef = useRef(null);
  const cityInputMobileRef = useRef(null);
  const countryInputMobileRef = useRef(null);
  const schoolDropdownMobileRef = useRef(null);
  const methodDropdownMobileRef = useRef(null);
  const submitBtnMobileRef = useRef(null);

  // ── Refs — desktop ────────────────────────────────────────
  const cityInputDesktopRef = useRef(null);
  const countryInputDesktopRef = useRef(null);
  const schoolDropdownDesktopRef = useRef(null);
  const methodDropdownDesktopRef = useRef(null);
  const submitBtnDesktopRef = useRef(null);

  // ── Refs — autocomplete ───────────────────────────────────
  const countrySuggestionsRefMobile = useRef(null);
  const countrySuggestionsRefDesktop = useRef(null);

  // ── Persist field values ──────────────────────────────────
  useEffect(() => {
    localStorage.setItem("prayerCity", city);
  }, [city]);
  useEffect(() => {
    localStorage.setItem("prayerCountry", country);
  }, [country]);
  useEffect(() => {
    localStorage.setItem("prayerSchool", selectedSchool);
  }, [selectedSchool]);
  useEffect(() => {
    localStorage.setItem("prayerMethod", selectedMethod);
  }, [selectedMethod]);

  // ── Country autocomplete filter ───────────────────────────
  useEffect(() => {
    if (country.trim() === "") {
      setCountrySuggestions([]);
      setShowCountrySuggestions(false);
      return;
    }
    const filtered = countries.filter((c) =>
      c.toLowerCase().includes(country.toLowerCase()),
    );
    setCountrySuggestions(filtered);
    setShowCountrySuggestions(true);
    setSelectedCountryIndex(-1);
  }, [country]);

  // ── Close suggestions on outside click ───────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        countrySuggestionsRefMobile.current &&
        !countrySuggestionsRefMobile.current.contains(e.target) &&
        !countryInputMobileRef.current?.contains(e.target) &&
        countrySuggestionsRefDesktop.current &&
        !countrySuggestionsRefDesktop.current.contains(e.target) &&
        !countryInputDesktopRef.current?.contains(e.target)
      ) {
        setShowCountrySuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Scroll after fresh submit ─────────────────────────────
  useEffect(() => {
    if (formData && shouldScroll.current) {
      const timesSection = document.querySelector(".px-10");
      if (timesSection) {
        setTimeout(() => {
          timesSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
      shouldScroll.current = false;
    }
  }, [formData]);

  // ── GSAP animations ───────────────────────────────────────
  useGSAP(() => {
    gsap.from(titleRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: titleRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
    gsap.from(dividerRef.current, {
      scaleX: 0,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: dividerRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });

    const animateRef = (ref, props) => {
      if (ref.current)
        gsap.from(ref.current, {
          ...props,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
    };

    animateRef(cityInputMobileRef, { x: -100, opacity: 0, duration: 0.8 });
    animateRef(countryInputMobileRef, {
      x: 100,
      opacity: 0,
      duration: 0.8,
      delay: 0.1,
    });
    animateRef(schoolDropdownMobileRef, {
      x: -100,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
    });
    animateRef(methodDropdownMobileRef, {
      x: 100,
      opacity: 0,
      duration: 0.8,
      delay: 0.3,
    });
    animateRef(submitBtnMobileRef, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      delay: 0.4,
    });
    animateRef(cityInputDesktopRef, { x: -150, opacity: 0, duration: 0.8 });
    animateRef(countryInputDesktopRef, { x: 150, opacity: 0, duration: 0.8 });
    animateRef(schoolDropdownDesktopRef, {
      x: -150,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
    });
    animateRef(methodDropdownDesktopRef, {
      x: 150,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
    });
    animateRef(submitBtnDesktopRef, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      delay: 0.4,
    });
  }, []);

  // ── Handlers ──────────────────────────────────────────────
  const handleCountrySelect = (selectedCountry) => {
    setCountry(selectedCountry);
    setShowCountrySuggestions(false);
    setCountrySuggestions([]);
  };

  const handleCountryKeyDown = (e) => {
    if (!showCountrySuggestions) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedCountryIndex((prev) =>
        prev < countrySuggestions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedCountryIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedCountryIndex >= 0) {
      e.preventDefault();
      handleCountrySelect(countrySuggestions[selectedCountryIndex]);
    } else if (e.key === "Escape") {
      setShowCountrySuggestions(false);
    }
  };

  useEffect(() => {
    if (selectedCountryIndex >= 0) {
      const activeItem =
        countrySuggestionsRefMobile.current?.children[selectedCountryIndex] ||
        countrySuggestionsRefDesktop.current?.children[selectedCountryIndex];
      activeItem?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedCountryIndex]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city.trim() || !country.trim()) {
      showAlert("Please enter both city and country");
      return;
    }
    const schoolNum = selectedSchool === "Hanafi" ? 1 : 2;
    const URL = "https://nominatim.openstreetmap.org/search";
    const QUERY = `?q=${encodeURIComponent(city + ", " + country)}&format=json&limit=5&addressdetails=1`;
    setIsLoading(true);
    try {
      const res = await fetch(URL + QUERY, {
        headers: { "User-Agent": "prayer-times-app" },
      });
      const data = await res.json();
      if (!data.length) {
        showAlert(
          language === "en"
            ? "Location not found. Please check your city and country names."
            : "লোকেশনটি পাওয়া যায়নি। দয়া করে শহর ও দেশের নাম সঠিক ভাবে লিখুন",
        );
        setIsLoading(false);
        return;
      }
      const countryLower = country.toLowerCase().trim();
      const matchingResult = data.find((result) => {
        const address = result.address || {};
        const resultCountry = (address.country || "").toLowerCase();
        const displayName = (result.display_name || "").toLowerCase();
        return (
          resultCountry === countryLower ||
          resultCountry.includes(countryLower) ||
          displayName.endsWith(countryLower)
        );
      });
      if (!matchingResult) {
        showAlert(
          `${city} was not found in ${country}. Please verify your entry.`,
        );
        setIsLoading(false);
        return;
      }
      const newFormData = {
        City: city,
        Country: country,
        School: selectedSchool,
        Number: schoolNum,
        Method: selectedMethod,
        Latitude: matchingResult.lat,
        Longitude: matchingResult.lon,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFormData));
      shouldScroll.current = true;
      setFormData(newFormData);
    } catch (err) {
      console.error("Geocoding error:", err);
      showAlert("An error occurred. Please reload the site and try again");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Shared JSX fragments ──────────────────────────────────
  const inputClass = (extraClasses = "") =>
    `h-[68px] bg-transparent ${borderMain} border-2 rounded-[15px] pl-5 ${textMain} outline-none input-style-${theme} ${extraClasses}`;

  const dropdownTriggerClass = `h-[68px] border-2 ${borderMain} rounded-[15px] pl-5 flex items-center justify-between cursor-pointer font-amiri font-bold ${textMain} bg-transparent`;

  const dropdownPanelClass = `absolute top-[68px] left-0 w-full ${bgDropdown} rounded-[15px] overflow-hidden z-50 shadow-lg`;

  const dropdownItemClass = (isActive = false) =>
    `px-5 py-4 font-amiri font-bold ${textInside} ${hoverItem} cursor-pointer transition-all duration-200${isActive ? " bg-[#0d3b35]" : ""}`;

  const suggestionItemClass = (isActive = false) =>
    `px-5 py-3 font-amiri font-bold cursor-pointer transition-all duration-200 ${
      isActive ? `bg-[#0d3b35] ${textInside}` : `${textInside} ${hoverItem}`
    }`;

  const labelClass = `text-xl font-amiri font-bold ${textMain} text-start w-full`;

  return (
    <>
      <div className="flex flex-col justify-center items-center mb-20 overflow-x-hidden">
        {/* Title */}
        <h1
          ref={titleRef}
          className={`text-5xl ${textMain} ${language === "en" ? "font-amiri" : "font-balooDa"} font-bold`}
        >
          {language === "en" ? "Prayer Times" : "সালাতের সময়"}
        </h1>

        {/* Divider */}
        <div
          ref={dividerRef}
          className={`dua-line h-2 w-[75%] md:w-[40%] bg-gradient-to-r from-transparent ${isDark ? "via-text-dark" : "via-text-light"} to-transparent rounded-2xl mt-4 mb-12`}
        />

        {/* ══════════ MOBILE FORM ══════════ */}
        <form
          onSubmit={handleSubmit}
          className={`flex flex-col justify-center items-center gap-3 bg-transparent ${borderMain} border-2 w-[85%] px-[50px] py-[50px] rounded-[20px] md:hidden relative mb-20 form-style-${theme}`}
        >
          {/* City */}
          <input
            ref={cityInputMobileRef}
            className={inputClass(
              `w-[274px] text-2xl md:text-3xl ${language === "en" ? "font-amiri input-en" : "font-balooDa input-bn"} font-bold`,
            )}
            type="text"
            placeholder={language === "en" ? "City" : "শহর"}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />

          {/* Country + autocomplete — mobile */}
          <div className="relative w-[274px] z-40">
            <input
              ref={countryInputMobileRef}
              className={inputClass(
                `w-[274px] text-2xl md:text-3xl ${language === "en" ? "font-amiri input-en" : "font-balooDa input-bn"} font-bold`,
              )}
              type="text"
              placeholder={language === "en" ? "Country" : "দেশ"}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              onKeyDown={handleCountryKeyDown}
              onFocus={() => country && setShowCountrySuggestions(true)}
              required
            />
            {showCountrySuggestions && countrySuggestions.length > 0 && (
              <ul
                ref={countrySuggestionsRefMobile}
                className={`absolute top-[68px] left-0 w-full ${bgDropdown} rounded-[15px] max-h-[200px] overflow-y-auto dropdown-scroll z-50 shadow-lg`}
              >
                {countrySuggestions.map((c, index) => (
                  <li
                    key={c}
                    onClick={() => handleCountrySelect(c)}
                    className={`${suggestionItemClass(index === selectedCountryIndex)} text-2xl`}
                  >
                    {c}
                  </li>
                ))}
              </ul>
            )}
            {showCountrySuggestions &&
              countrySuggestions.length === 0 &&
              country.trim() !== "" && (
                <div
                  className={`absolute top-[68px] left-0 w-full ${bgDropdown} rounded-[15px] p-4 ${textInside} text-center text-xl font-amiri z-50 shadow-lg`}
                >
                  {language === "en" ? (
                    "No countries found"
                  ) : (
                    <span className="font-balooDa">কোন দেশ পাওয়া যায়নি</span>
                  )}
                </div>
              )}
          </div>

          {/* School — mobile */}
          <div ref={schoolDropdownMobileRef} className="w-[274px] z-30">
            <label className={`mt-5 ${labelClass}`}>
              {language === "en" ? (
                "Select a School"
              ) : (
                <span className="font-balooDa font-normal">মাজহাব</span>
              )}
            </label>
            <div className="relative w-[274px]">
              <div
                className={`${dropdownTriggerClass} text-2xl md:text-3xl`}
                onClick={() => setSchoolOpen(!schoolOpen)}
              >
                {selectedSchool}
                <span className="mr-5">&#9662;</span>
              </div>
              {schoolOpen && (
                <div className={dropdownPanelClass}>
                  {schools.map((school) => (
                    <div
                      key={school}
                      className={`${dropdownItemClass()} text-3xl`}
                      onClick={() => {
                        setSelectedSchool(school);
                        setSchoolOpen(false);
                      }}
                    >
                      {school}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Method — mobile */}
          <div ref={methodDropdownMobileRef} className="w-[274px] z-20">
            <label className={`mt-5 ${labelClass}`}>
              {language === "en" ? (
                "Select a Method"
              ) : (
                <Link className="font-bold" to="/methods">
                  গণনা পদ্ধতি
                </Link>
              )}
            </label>
            <div className="relative w-[274px]">
              <div
                className={`${dropdownTriggerClass} text-2xl md:text-3xl`}
                onClick={() => setMethodOpen(!methodOpen)}
              >
                {selectedMethod}
                <span className="mr-5">&#9662;</span>
              </div>
              {methodOpen && (
                <div
                  className={`absolute top-[68px] left-0 w-full ${bgDropdown} max-h-[180px] overflow-y-auto dropdown-scroll rounded-[15px] z-50 shadow-lg`}
                >
                  {methods.map((method) => (
                    <div
                      key={method}
                      className={`${dropdownItemClass()} text-2xl md:text-3xl`}
                      onClick={() => {
                        setSelectedMethod(method);
                        setMethodOpen(false);
                      }}
                    >
                      {method}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit — mobile */}
          <input
            ref={submitBtnMobileRef}
            className={`h-[68px] w-[274px] ${textInside} ${bgDropdown} border-2 rounded-[15px] text-3xl ${language === "en" ? "font-amiri" : "font-balooDa"} font-bold mt-6 cursor-pointer btn-submit`}
            type="submit"
            value={language === "en" ? "Find" : "খুঁজুন"}
          />
        </form>

        {/* ══════════ DESKTOP FORM ══════════ */}
        <form
          onSubmit={handleSubmit}
          className={`hidden md:flex flex-col justify-center items-center gap-3 bg-transparent ${borderMain} border-2 w-[800px] px-[50px] py-[50px] rounded-[20px] mb-20 form-style-${theme}`}
        >
          <div className="flex justify-center items-start gap-5">
            {/* City */}
            <input
              ref={cityInputDesktopRef}
              className={inputClass(
                `w-[350px] text-3xl font-amiri font-bold ${language === "en" ? "input-en" : "input-bn"}`,
              )}
              type="text"
              placeholder={language === "en" ? "City" : "শহর"}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />

            {/* Country + autocomplete — desktop */}
            <div className="relative w-[350px] z-40">
              <input
                ref={countryInputDesktopRef}
                className={inputClass(
                  `w-[350px] text-3xl font-amiri font-bold ${language === "en" ? "input-en" : "input-bn"}`,
                )}
                type="text"
                placeholder={language === "en" ? "Country" : "দেশ"}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                onKeyDown={handleCountryKeyDown}
                onFocus={() => country && setShowCountrySuggestions(true)}
                required
              />
              {showCountrySuggestions && countrySuggestions.length > 0 && (
                <ul
                  ref={countrySuggestionsRefDesktop}
                  className={`absolute top-[68px] left-0 w-full ${bgDropdown} rounded-[15px] max-h-[200px] overflow-y-auto dropdown-scroll z-50 shadow-lg`}
                >
                  {countrySuggestions.map((c, index) => (
                    <li
                      key={c}
                      onClick={() => handleCountrySelect(c)}
                      className={`${suggestionItemClass(index === selectedCountryIndex)} text-3xl`}
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              )}
              {showCountrySuggestions &&
                countrySuggestions.length === 0 &&
                country.trim() !== "" && (
                  <div
                    className={`absolute top-[68px] left-0 w-full ${bgDropdown} rounded-[15px] p-4 ${textInside} text-center text-xl font-amiri z-50 shadow-lg`}
                  >
                    {language === "en" ? (
                      "No countries found"
                    ) : (
                      <span className="font-balooDa">
                        কোন দেশ পাওয়া যায়নি
                      </span>
                    )}
                  </div>
                )}
            </div>
          </div>

          <div className="flex justify-center items-start gap-5 mt-5">
            {/* School — desktop */}
            <div
              ref={schoolDropdownDesktopRef}
              className="relative w-[350px] z-30"
            >
              <label className={`${labelClass} mb-2`}>
                {language === "en" ? (
                  "Select a School"
                ) : (
                  <span className="font-balooDa font-normal">মাজহাব</span>
                )}
              </label>
              <div
                className={`${dropdownTriggerClass} text-3xl`}
                onClick={() => setSchoolOpen(!schoolOpen)}
              >
                {selectedSchool}
                <span className="mr-5">&#9662;</span>
              </div>
              {schoolOpen && (
                <div className={dropdownPanelClass}>
                  {schools.map((school) => (
                    <div
                      key={school}
                      className={`${dropdownItemClass()} text-3xl`}
                      onClick={() => {
                        setSelectedSchool(school);
                        setSchoolOpen(false);
                      }}
                    >
                      {school}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Method — desktop */}
            <div
              ref={methodDropdownDesktopRef}
              className="relative w-[350px] z-20"
            >
              <label className={`${labelClass} font-balooDa font-normal mb-2`}>
                {language === "en" ? (
                  "Select a Method"
                ) : (
                  <Link className="font-bold" to="/methods">
                    গণনা পদ্ধতি
                  </Link>
                )}
              </label>
              <div
                className={`${dropdownTriggerClass} text-3xl`}
                onClick={() => setMethodOpen(!methodOpen)}
              >
                {selectedMethod}
                <span className="mr-5">&#9662;</span>
              </div>
              {methodOpen && (
                <div
                  className={`absolute top-[68px] left-0 w-full max-h-[180px] overflow-y-auto dropdown-scroll ${bgDropdown} rounded-[15px] z-50 shadow-lg`}
                >
                  {methods.map((method) => (
                    <div
                      key={method}
                      className={`${dropdownItemClass()} text-3xl`}
                      onClick={() => {
                        setSelectedMethod(method);
                        setMethodOpen(false);
                      }}
                    >
                      {method}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit — desktop */}
          <input
            ref={submitBtnDesktopRef}
            className={`h-[68px] w-full ${textInside} ${bgDropdown} border-2 rounded-[15px] text-4xl ${language === "en" ? "font-amiri" : "font-balooDa"} font-bold mt-6 cursor-pointer`}
            type="submit"
            value={language === "en" ? "Find" : "খুঁজুন"}
          />
        </form>

        {/* ══════════ RESULTS ══════════ */}
        <div className="px-10">
          {isLoading ? (
            <Loader />
          ) : formData ? (
            <Times formData={formData} />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Form;
