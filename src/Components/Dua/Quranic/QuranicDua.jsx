import PageTransition from "../../../Hooks/PageTransition";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import "../Pages.css";
import { usePageTitle } from "../../../Hooks/pageName";

const QuranicDua = () => {
  const containerRef = useRef(null);
  usePageTitle("Quranic Duas | Dua", " | Dhikr Time");

  useGSAP(
    () => {
      // Animate title
      gsap.from(".dua-title", {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // Animate line
      gsap.from(".dua-line", {
        scaleX: 0,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: "power3.out",
      });

      // Animate content card
      gsap.from(".content-card", {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.6,
        ease: "back.out(1.7)",
      });

      // Animate decorative elements
      gsap.from(".deco-circle", {
        scale: 0,
        opacity: 0,
        duration: 1,
        delay: 0.9,
        stagger: 0.1,
        ease: "elastic.out(1, 0.5)",
      });

      // Floating animation for decorative elements
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
        {/* Decorative Background Elements */}
        <div className="deco-circle absolute top-20 left-10 w-32 h-32 bg-[#105A59] opacity-5 rounded-full blur-2xl"></div>
        <div className="deco-circle absolute bottom-32 right-20 w-40 h-40 bg-[#105A59] opacity-5 rounded-full blur-2xl"></div>
        <div className="deco-circle absolute top-1/2 left-1/4 w-24 h-24 bg-[#105A59] opacity-5 rounded-full blur-2xl"></div>

        {/* Title Section */}
        <h1 className="dua-title text-4xl md:text-5xl lg:text-6xl font-amiri font-bold text-[#105A59] text-center mt-10 md:mt-0 px-4">
          Duas from the Quran
        </h1>

        <div className="dua-line h-2 w-[75%] md:w-[40%] bg-gradient-to-r from-transparent via-[#105A59] to-transparent rounded-2xl mt-4 mb-12"></div>

        {/* Main Content Card */}
        <div className="content-card max-w-3xl w-full mx-auto mb-10">
          {/* Beautiful Card Container */}
          <div className="relative bg-transparent rounded-3xl shadow-2xl overflow-hidden border border-[#105A59]/10">
            {/* Decorative Top Border */}
            <div className="h-1.5 bg-gradient-to-r from-[#105A59] via-[#1a8a88] to-[#105A59]"></div>

            {/* Card Content */}
            <div className="p-8 md:p-12">
              {/* Icon/Illustration Area */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  {/* Circular Background */}
                  <div className="w-32 h-32 bg-gradient-to-br from-[#105A59]/10 to-[#1a8a88]/5 rounded-full flex items-center justify-center">
                    {/* Islamic Pattern or Icon */}
                    <svg
                      className="w-16 h-16 text-[#105A59]"
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
                  {/* Decorative Rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-[#105A59]/20 animate-ping-slow"></div>
                </div>
              </div>

              {/* Message Section */}
              <div className="text-center space-y-6">
                <h2 className="text-2xl md:text-3xl font-amiri font-semibold text-[#105A59] leading-relaxed">
                  Content Coming Soon
                </h2>

                <div className="w-20 h-1 bg-gradient-to-r from-[#105A59] to-[#1a8a88] mx-auto rounded-full"></div>

                <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-lateef">
                  The REST API for duas are being prepared by the developer.
                </p>

                <p className="text-base md:text-lg text-gray-600 leading-relaxed font-lateef italic">
                  Have patience, it will be released soon{" "}
                  <span className="font-amiri font-semibold text-[#105A59] not-italic">
                    إِنْ شَاءَ ٱللَّٰهُ
                  </span>
                </p>

                {/* Progress Indicator */}
                <div className="pt-6">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-[#105A59] rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-[#105A59] rounded-full animate-bounce delay-100"></div>
                    <div className="w-3 h-3 bg-[#105A59] rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Bottom Pattern */}
            <div className="h-2 bg-gradient-to-r from-[#105A59]/5 via-[#1a8a88]/10 to-[#105A59]/5"></div>
          </div>

          {/* Additional Info Card */}
          <div className="mt-8 bg-transparent backdrop-blur-sm rounded-2xl p-6 border border-[#105A59]/10 shadow-lg">
            <p className="text-center text-gray-600 text-sm md:text-base font-lateef">
              Stay tuned for authentic duas from the Quran
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default QuranicDua;
