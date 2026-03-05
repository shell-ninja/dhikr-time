import { Link } from "react-router-dom";
import "./Dua.css";
import { usePageTitle } from "../../Hooks/pageName";
import PageTransition from "../../Hooks/PageTransition";
import morningEvening from "../../assets/images/morning-evening.png";
import salah from "../../assets/images/salah.png";
import quran from "../../assets/images/quran.png";
// import sunnah from "../../assets/images/sunnah.png";
// import salawat from "../../assets/images/durood.png";
import istigfar from "../../assets/images/istigfar.png";
import { ScrollTrigger } from "gsap/all";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useState, useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

const Dua = () => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  usePageTitle("Dua", " | Dhikr Time");
  const containerRef = useRef(null);

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

  useGSAP(
    () => {
      const cards = containerRef.current.querySelectorAll(".dua-card");

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

      const directions = [
        { x: -300, y: 0, rotation: -15 },
        { x: 0, y: -300, rotation: 0 },
        { x: 300, y: 0, rotation: 15 },
        { x: -300, y: 0, rotation: -15 },
        { x: 0, y: 300, rotation: 0 },
        { x: 300, y: 0, rotation: 15 },
      ];

      cards.forEach((card, index) => {
        const direction = directions[index % directions.length];
        gsap.from(card, {
          x: direction.x,
          y: direction.y,
          rotation: direction.rotation,
          opacity: 0,
          duration: 1,
          delay: 0.6 + index * 0.15,
          ease: "back.out(1.7)",
        });
      });
    },
    { scope: containerRef },
  );

  return (
    <PageTransition>
      <div
        ref={containerRef}
        className="min-h-screen flex flex-col justify-start items-center px-8 md:px-20 relative"
      >
        {language === "bn" ? (
          <h1 className="dua-title text-5xl font-amiri font-bold text-text-light mt-30 md:mt-10">
            দু'আ
          </h1>
        ) : (
          <h1 className="dua-title text-5xl font-amiri font-bold text-text-light mt-30 md:mt-10">
            Dua
          </h1>
        )}

        <div className="dua-line h-2 w-[75%] md:w-[40%] bg-gradient-to-r from-transparent via-text-light to-transparent rounded-2xl mt-4 mb-12"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center font-bold text-text-light mb-20 w-full max-w-[1150px]">
          {/* Morning and Evening */}
          <Link
            to={`/dua/morning-evening?lang=${language}`}
            className="dua-card w-full max-w-[350px]"
          >
            <div className="w-full h-[300px] flex flex-col border-2 rounded-2xl overflow-hidden form-style hover-card">
              <div className="flex-1 overflow-hidden card-image-wrapper">
                <img
                  src={morningEvening}
                  alt="Image for Morning and Evening dua"
                  className="w-full h-full object-cover card-image"
                />
              </div>
              <div className="py-3 px-4 bg-transparent">
                {language === "bn" ? (
                  <h2 className="font-normal font-balooDa text-xl text-center tracking-wider">
                    সকাল এবং সন্ধ্যা
                  </h2>
                ) : (
                  <h2 className="font-normal text-2xl text-center font-amiri tracking-wider">
                    Morning and Evening
                  </h2>
                )}
              </div>
            </div>
          </Link>

          {/* After Salah */}
          <Link
            to={`/dua/after-salah?lang=${language}`}
            className="dua-card w-full max-w-[350px]"
          >
            <div className="w-full h-[300px] flex flex-col border-2 rounded-2xl overflow-hidden form-style hover-card">
              <div className="flex-1 overflow-hidden card-image-wrapper">
                <img
                  src={salah}
                  alt="Image for dua after Salah"
                  className="w-full h-full object-cover card-image"
                />
              </div>
              <div className="py-3 px-4 bg-transparent">
                {language === "bn" ? (
                  <h2 className="font-normal text-xl text-center font-balooDa tracking-wider">
                    সালাতের পরে
                  </h2>
                ) : (
                  <h2 className="font-normal text-2xl text-center font-amiri tracking-wider">
                    After Salah
                  </h2>
                )}
              </div>
            </div>
          </Link>

          <Link
            to={`/dua/quran-sunnah?lang=${language}`}
            className="dua-card w-full max-w-[350px]"
          >
            <div className="w-full h-[300px] flex flex-col border-2 rounded-2xl overflow-hidden form-style hover-card">
              <div className="flex-1 overflow-hidden card-image-wrapper">
                <img
                  src={quran}
                  alt="Image for quranic dua"
                  className="w-full h-full object-cover card-image"
                />
              </div>
              <div className="py-3 px-4 bg-transparent">
                {language === "bn" ? (
                  <h2 className="font-normal text-xl text-center font-balooDa tracking-wider">
                    কুরানে এবং সুন্নাহ সম্মত দু'আ
                  </h2>
                ) : (
                  <h2 className="font-normal text-2xl text-center font-amiri tracking-wider">
                    Quran And Sunnah
                  </h2>
                )}
              </div>
            </div>
          </Link>

          {/*
          <Link
            to={`/dua/sunnah?lang=${language}`}
            className="dua-card w-full max-w-[350px]"
          >
            <div className="w-full h-[300px] flex flex-col border-2 rounded-2xl overflow-hidden form-style hover-card">
              <div className="flex-1 overflow-hidden card-image-wrapper">
                <img
                  src={sunnah}
                  alt="Image for sunnah dua"
                  className="w-full h-full object-cover card-image"
                />
              </div>
              <div className="py-3 px-4 bg-transparent">
                {language === "bn" ? (
                  <h2 className="font-normal text-xl text-center font-balooDa tracking-wider">
                    সুন্নাত দুয়া
                  </h2>
                ) : (
                  <h2 className="font-normal text-2xl text-center font-amiri tracking-wider">
                    Sunnah Dua
                  </h2>
                )}
              </div>
            </div>
          </Link>
                    */}

          {/* Salawat / Durood */}
          {/*
          <Link
            to={`/dua/salawat?lang=${language}`}
            className="dua-card w-full max-w-[350px]"
          >
            <div className="w-full h-[300px] flex flex-col border-2 rounded-2xl overflow-hidden form-style hover-card">
              <div className="flex-1 overflow-hidden card-image-wrapper">
                <img
                  src={salawat}
                  alt="Image for salawat"
                  className="w-full h-full object-cover card-image"
                />
              </div>
              <div className="py-3 px-4 bg-transparent">
                {language === "bn" ? (
                  <h2 className="font-normal text-xl text-center font-balooDa tracking-wider">
                    দুরুদ
                  </h2>
                ) : (
                  <h2 className="font-normal text-2xl text-center font-amiri tracking-wider">
                    Durood
                  </h2>
                )}
              </div>
            </div>
          </Link>
    */}

          {/* Istighfar */}
          <Link
            to={`/dua/istighfar?lang=${language}`}
            className="dua-card w-full max-w-[350px]"
          >
            <div className="w-full h-[300px] flex flex-col border-2 rounded-2xl overflow-hidden form-style hover-card">
              <div className="flex-1 overflow-hidden card-image-wrapper">
                <img
                  src={istigfar}
                  alt="Image for istigfar dua"
                  className="w-full h-full object-cover card-image"
                />
              </div>
              <div className="py-3 px-4 bg-transparent">
                {language === "bn" ? (
                  <h2 className="font-normal text-xl text-center font-balooDa tracking-wider">
                    ইসতিগফার
                  </h2>
                ) : (
                  <h2 className="font-normal text-2xl text-center font-amiri tracking-wider">
                    Istigfar
                  </h2>
                )}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dua;
