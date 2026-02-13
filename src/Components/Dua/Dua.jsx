import { Link, Outlet } from "react-router-dom";
import "./Dua.css";
import { usePageTitle } from "../../Hooks/pageName";
import PageTransition from "../../Hooks/PageTransition";
import morningEvening from "../../assets/images/morning-evening.png";
import salah from "../../assets/images/salah.png";
import quran from "../../assets/images/quran.png";
import sunnah from "../../assets/images/sunnah.png";
import salawat from "../../assets/images/durood.png";
import istigfar from "../../assets/images/istigfar.png";
import { ScrollTrigger } from "gsap/all";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const Dua = () => {
  const [toggled, setToggled] = useState(() => {
    const saved = localStorage.getItem("language");
    return saved === "bn";
  });
  const Language = toggled ? "bn" : "en";

  const setLan = () => {
    const newToggled = !toggled;
    setToggled(newToggled);
    localStorage.setItem("language", newToggled ? "bn" : "en");
  };

  usePageTitle("Dua", " | Dhikr Time");
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const cards = containerRef.current.querySelectorAll(".dua-card");

      // Animate title and line first
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

      // Animate cards from different directions
      const directions = [
        { x: -300, y: 0, rotation: -15 }, // from left
        { x: 0, y: -300, rotation: 0 }, // from top
        { x: 300, y: 0, rotation: 15 }, // from right
        { x: -300, y: 0, rotation: -15 }, // from left
        { x: 0, y: 300, rotation: 0 }, // from bottom
        { x: 300, y: 0, rotation: 15 }, // from right
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
        className="min-h-screen flex flex-col justify-center items-center px-10"
      >
        <h1 className="dua-title text-5xl font-amiri font-bold text-[#105A59] mt-20 md:mt-10">
          Dua
        </h1>

        <div className="dua-line h-2 w-[75%] md:w-[40%] bg-gradient-to-r from-transparent via-[#105A59] to-transparent rounded-2xl mt-4 mb-12"></div>

        <div className="relative right-35 md:right-80 lg:right-125 bottom-5">
          <button
            onClick={() => setLan()}
            className={`toggle-btn ${toggled ? "toggled" : ""}`}
          >
            <div className="circle">
              <p className={`en font-amiri ${toggled ? "en-hide" : ""}`}>en</p>
              <p className={`bn font-amiri ${toggled ? "bn-hide" : ""}`}>bn</p>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center font-bold text-[#105A59] mb-20">
          {/* Link for Morning and Evening Dua */}
          <Link
            to={`/dua/morning-evening?lang=${Language}`}
            className="dua-card"
          >
            <div className="w-[350px] max-w-md h-[300px] flex flex-col border-2 rounded-2xl overflow-hidden form-style hover-card">
              <div className="flex-1 overflow-hidden card-image-wrapper">
                <img
                  src={morningEvening}
                  alt="Image for Morning and Evening dua"
                  className="w-full h-full object-cover card-image"
                />
              </div>
              <div className="py-3 px-4 bg-transparent">
                {toggled ? (
                  <h2 className="font-normal text-xl text-center font-lateef tracking-wider">
                    সকাল এবং সন্ধ্যা
                  </h2>
                ) : (
                  <h2 className="font-normal text-2xl text-center font-lateef tracking-wider">
                    Morning and Evening
                  </h2>
                )}
              </div>
            </div>
          </Link>

          {/* Link for Dua after Salah */}
          <Link to={`/dua/after-salah?lang=${Language}`} className="dua-card">
            <div className="w-[350px] max-w-md h-[300px] flex flex-col border-2 rounded-2xl overflow-hidden form-style hover-card">
              <div className="flex-1 overflow-hidden card-image-wrapper">
                <img
                  src={salah}
                  alt="Image for dua after Salah"
                  className="w-full h-full object-cover card-image"
                />
              </div>
              <div className="py-3 px-4 bg-transparent">
                {toggled ? (
                  <h2 className="font-normal text-xl text-center font-lateef tracking-wider">
                    সালাতের পরে
                  </h2>
                ) : (
                  <h2 className="font-normal text-2xl text-center font-lateef tracking-wider">
                    After Salah
                  </h2>
                )}
              </div>
            </div>
          </Link>

          {/* Link for Quranic Dua */}
          <Link to={`/dua/quranic?lang=${Language}`} className="dua-card">
            <div className="w-[350px] max-w-md h-[300px] flex flex-col border-2 rounded-2xl overflow-hidden form-style hover-card">
              <div className="flex-1 overflow-hidden card-image-wrapper">
                <img
                  src={quran}
                  alt="Image for quranic dua"
                  className="w-full h-full object-cover card-image"
                />
              </div>
              <div className="py-3 px-4 bg-transparent">
                {toggled ? (
                  <h2 className="font-normal text-xl text-center font-lateef tracking-wider">
                    কুরানের দুয়া
                  </h2>
                ) : (
                  <h2 className="font-normal text-2xl text-center font-lateef tracking-wider">
                    Quranic Dua
                  </h2>
                )}
              </div>
            </div>
          </Link>

          {/* Link for Sunnah Dua */}
          <Link to={`/dua/sunnah?lang=${Language}`} className="dua-card">
            <div className="w-[350px] max-w-md h-[300px] flex flex-col border-2 rounded-2xl overflow-hidden form-style hover-card">
              <div className="flex-1 overflow-hidden card-image-wrapper">
                <img
                  src={sunnah}
                  alt="Image for sunnah dua"
                  className="w-full h-full object-cover card-image"
                />
              </div>
              <div className="py-3 px-4 bg-transparent">
                {toggled ? (
                  <h2 className="font-normal text-xl text-center font-lateef tracking-wider">
                    সুন্নাত দুয়া
                  </h2>
                ) : (
                  <h2 className="font-normal text-2xl text-center font-lateef tracking-wider">
                    Sunnah Dua
                  </h2>
                )}
              </div>
            </div>
          </Link>

          {/* Link for salawat upon the Prophet (pbuh) */}
          <Link to={`/dua/salawat?lang=${Language}`} className="dua-card">
            <div className="w-[350px] max-w-md h-[300px] flex flex-col border-2 rounded-2xl overflow-hidden form-style hover-card">
              <div className="flex-1 overflow-hidden card-image-wrapper">
                <img
                  src={salawat}
                  alt="Image for salawat"
                  className="w-full h-full object-cover card-image"
                />
              </div>
              <div className="py-3 px-4 bg-transparent">
                {toggled ? (
                  <h2 className="font-normal text-xl text-center font-lateef tracking-wider">
                    দুরুদ
                  </h2>
                ) : (
                  <h2 className="font-normal text-2xl text-center font-lateef tracking-wider">
                    Durood
                  </h2>
                )}
              </div>
            </div>
          </Link>

          {/* Link for Istigfar */}
          <Link to={`/dua/istigfar?lang=${Language}`} className="dua-card">
            <div className="w-[350px] max-w-md h-[300px] flex flex-col border-2 rounded-2xl overflow-hidden form-style hover-card">
              <div className="flex-1 overflow-hidden card-image-wrapper">
                <img
                  src={istigfar}
                  alt="Image for istigfar dua"
                  className="w-full h-full object-cover card-image"
                />
              </div>
              <div className="py-3 px-4 bg-transparent">
                {toggled ? (
                  <h2 className="font-normal text-xl text-center font-lateef tracking-wider">
                    ইস্তিগফার
                  </h2>
                ) : (
                  <h2 className="font-normal text-2xl text-center font-lateef tracking-wider">
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
