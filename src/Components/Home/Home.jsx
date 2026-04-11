import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Form from "../Form/Form";
import PageTransition from "../../Hooks/PageTransition";
import CountriesArray from "../../Hooks/CountriesArray";
import { usePageTitle } from "../../Hooks/pageName";
import useTheme from "../../Hooks/useTheme";
import useLanguage from "../../Hooks/useLanguage";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  usePageTitle("Home", " | Dhikr Time");
  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const ayahRef = useRef(null);
  const translationRef = useRef(null);
  const chapterRef = useRef(null);
  const formRef = useRef(null);

  const language = useLanguage();

  const theme = useTheme();
  const isDark = theme === "dark";

  useGSAP(() => {
    const isMobile = window.innerWidth < 768;

    // Background slow zoom — desktop only
    if (!isMobile) {
      gsap.fromTo(
        bgRef.current,
        { scale: 1.05 },
        { scale: 1, duration: 2.5, ease: "power2.out" },
      );
    }

    // Entrance animations — ALL devices
    const tl = gsap.timeline({ delay: 0.3 });
    tl.from(ayahRef.current, {
      y: isMobile ? 30 : 0,
      x: isMobile ? 0 : 40,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    })
      .from(
        translationRef.current,
        {
          y: isMobile ? 30 : 0,
          x: isMobile ? 0 : 25,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.6",
      )
      .from(
        chapterRef.current,
        {
          y: isMobile ? 20 : 0,
          x: isMobile ? 0 : 25,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.6",
      )

      // Scroll-out animations — desktop only
      .add(() => {
        if (isMobile) return;

        gsap.to(ayahRef.current, {
          x: 200,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "50% top",
            scrub: 0.4,
          },
        });

        gsap.to(translationRef.current, {
          x: -200,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "8% top",
            end: "50% top",
            scrub: 0.4,
          },
        });

        gsap.to(chapterRef.current, {
          x: 50,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "15% top",
            end: "50% top",
            scrub: 0.4,
          },
        });
      });

    // Form slide-in — ALL devices
    gsap.fromTo(
      formRef.current,
      { x: isMobile ? 0 : -100, y: isMobile ? 40 : 0, opacity: 0 },
      {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 80%",
          end: "top 50%",
          toggleActions: "play none none reverse",
        },
      },
    );
  }, []);

  return (
    <PageTransition>
      <div>
        {/* ================= HERO SECTION ================= */}
        <div
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center px-[50px] overflow-hidden"
        >
          {/* Background image — swapped via inline style, not dynamic Tailwind class */}
          <div
            ref={bgRef}
            className="absolute inset-0 bg-no-repeat bg-cover bg-center"
            style={{
              backgroundImage: `url('/images/BG-${isDark ? "dark" : "light"}.png')`,
              opacity: 0.45,
            }}
          />

          {/* Ayah Content */}
          <div className="absolute md:top-[350px] flex flex-col items-center justify-center text-center px-6">
            <p
              ref={ayahRef}
              className={`text-4xl md:text-5xl lg:text-6xl font-mirza leading-relaxed ${isDark ? "text-text-dark" : "text-text-light"
                }`}
            >
              یٰۤاَیُّهَا الَّذِیۡنَ اٰمَنُوا اسۡتَعِیۡنُوۡا بِالصَّبۡرِ وَ
              الصَّلٰوۃِ ؕ اِنَّ اللّٰهَ مَعَ الصّٰبِرِیۡنَ
            </p>

            {language === "en" ? (
              <p
                ref={translationRef}
                className={`mt-6 text-2xl md:text-3xl font-amiri font-bold px-2 md:px-6 ${isDark ? "text-text-dark" : "text-text-light"
                  }`}
              >
                O you who have believed, seek help through patience and prayer.
                Indeed, Allah is with the patient.
              </p>
            ) : (
              <p
                ref={translationRef}
                className={`mt-6 text-xl md:text-3xl font-balooDa font-bold px-2 md:px-6 ${isDark ? "text-text-dark" : "text-text-light"
                  }`}
              >
                হে ঈমানদারগণ! তোমরা সাহায্য চাও সবর ও সালাতের মাধ্যমে। নিশ্চয়ই
                আল্লাহ্‌ সবরকারীদের সাথে আছেন।
              </p>
            )}

            {language === "en" ? (
              <p
                ref={chapterRef}
                className={`mt-5 md:mt-10 text-xl md:text-3xl font-amiri font-normal ${isDark ? "text-text-dark" : "text-text-light"
                  }`}
              >
                Al-Baqarah 2:153
              </p>
            ) : (
              <p
                ref={chapterRef}
                className={`mt-5 md:mt-10 text-xl md:text-3xl font-balooDa font-normal ${isDark ? "text-text-dark" : "text-text-light"
                  }`}
              >
                আল-বাকারা ২ঃ১৫৩
              </p>
            )}
          </div>
        </div>

        {/* ================= OTHER CONTENT ================= */}
        <div ref={formRef} className="relative">
          <Form />
        </div>
        <CountriesArray />
      </div>
    </PageTransition>
  );
};

export default Home;
