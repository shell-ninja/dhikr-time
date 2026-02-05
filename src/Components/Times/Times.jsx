import { useRef } from "react";
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

  // const API = `https://dhikr-time-server.onrender.com/api/prayer?lat=${lat}&lon=${lon}&method=${selectedMethod}&school=${schoolNum}`;

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

  const prayerTimes = {
    Fajr: times.Fajr,
    Sunrise: times.Sunrise,
    Dhuhr: times.Dhuhr,
    Asr: times.Asr,
    Maghrib: times.Maghrib,
    Isha: times.Isha,
    Tahajjud: times.Lastthird,
  };

  const formatTime = (time) => {
    const [h, m] = time.split(":").map(Number);
    const hour = h % 12 || 12;
    const period = h >= 12 ? "PM" : "AM";
    return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <div className="flex flex-col justify-center items-center my-20 px-4">
      <h1
        ref={dateRef}
        className="text-4xl md:text-5xl font-amiri font-bold text-[#105A59]"
      >
        {date.readable}
      </h1>

      <h3
        ref={locationRef}
        className="text-2xl md:text-3xl font-amiri font-bold text-[#105A59] mt-3"
      >
        {city}, {country}
      </h3>

      <div
        ref={dividerRef}
        className="h-2 w-[80%] md:w-[800px] bg-[#105A59] rounded-2xl mt-2 mb-8"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mt-8">
        {Object.entries(prayerTimes).map(([name, time], index) => (
          <div
            key={name}
            ref={(el) => (prayerCardsRef.current[index] = el)}
            className={`flex flex-col justify-between items-center bg-transparent border-2 border-[#105A59] rounded-[20px] px-15 py-6 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full ${
              index === 6 ? "md:col-span-2 lg:col-span-3" : ""
            }`}
          >
            <h4 className="text-2xl md:text-3xl font-amiri font-bold text-[#105A59] mb-4">
              {name}
            </h4>

            <p className="text-3xl md:text-4xl font-amiri font-bold text-[#105A59]">
              {formatTime(time)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Times;
