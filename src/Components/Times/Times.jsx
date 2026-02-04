import { useRef } from "react";
import useSWR from "swr";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Loader from "../../Hooks/Loader";

gsap.registerPlugin(ScrollTrigger);

const fetcher = (url) => fetch(url).then((res) => res.json());

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
  const containerRef = useRef(null);
  const prayerRowsRef = useRef([]);

  const API_KEY = import.meta.env.VITE_SECRET_API_KEY;
  const API = `https://islamicapi.com/api/v1/prayer-time/?lat=${lat}&lon=${lon}&method=${selectedMethod}&school=${schoolNum}&api_key=${API_KEY}`;

  const { data, error, isLoading } = useSWR(API, fetcher);

  useGSAP(() => {
    if (!data) return;

    // Date animation - fade in from top
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

    // Location animation - fade in
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

    // Divider animation - scale from left
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

    // Container animation - fade in and scale
    gsap.from(containerRef.current, {
      scale: 0.95,
      opacity: 0,
      duration: 0.8,
      delay: 0.3,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });

    // Prayer rows stagger animation - alternate from left and right
    prayerRowsRef.current.forEach((row, index) => {
      if (row) {
        gsap.from(row, {
          x: index % 2 === 0 ? -100 : 100,
          opacity: 0,
          duration: 0.6,
          delay: 0.5 + index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: row,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });
      }
    });
  }, [data]);

  if (isLoading) return <Loader />;
  if (error) return <p>Error...</p>;

  const date = data.data.date;
  const times = data.data.times;
  const Fajr = times.Fajr;
  const Sunrise = times.Sunrise;
  const Dhuhr = times.Dhuhr;
  const Asr = times.Asr;
  const Maghrib = times.Maghrib;
  const Isha = times.Isha;
  const Tahajjud = times.Lastthird;

  const prayerTimes = {
    Fajr,
    Sunrise,
    Dhuhr,
    Asr,
    Maghrib,
    Isha,
    Tahajjud,
  };

  console.log("Prayer Times: ", prayerTimes);

  const formatTime = (time) => {
    const [h, m] = time.split(":").map(Number);
    const hour = h % 12 || 12;
    const period = h >= 12 ? "PM" : "AM";
    return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <div className="flex flex-col justify-center items-center my-20">
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
      ></div>
      <div
        ref={containerRef}
        className="flex flex-col w-full max-w-[85%] gap-10 md:gap-3 mt-8 border-2 border-[#105A59] p-10 px-[120px] md:px-10 rounded-[20px] form-style"
      >
        {Object.entries(prayerTimes).map(([name, time], index) => (
          <div
            key={name}
            ref={(el) => (prayerRowsRef.current[index] = el)}
            className="flex flex-col md:flex-row justify-center md:justify-between items-center text-[#105A59] font-amiri font-bold text-[30px] md:text-[40px]"
          >
            <span>{name}:</span>
            <span>{formatTime(time)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Times;
