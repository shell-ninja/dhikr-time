import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Form from "../Form/Form";
import PageTransition from "../../Hooks/PageTransition";
import CountriesArray from "../../Hooks/CountriesArray";
import { usePageTitle } from "../../Hooks/pageName";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  usePageTitle("Home", " | Dhikr Time");
  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const ayahRef = useRef(null);
  const translationRef = useRef(null);
  const chapterRef = useRef(null);
  const formRef = useRef(null);

  useGSAP(() => {
    if (window.innerWidth < 768) return;

    // Background slow zoom
    gsap.fromTo(
      bgRef.current,
      { scale: 1.05 },
      { scale: 1, duration: 2.5, ease: "power2.out" },
    );

    // Entrance animation
    const tl = gsap.timeline({ delay: 0.3 });
    tl.from(ayahRef.current, {
      x: 40,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    })
      .from(
        translationRef.current,
        {
          x: 25,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.6",
      )
      .from(
        chapterRef.current,
        {
          x: 25,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.6",
      )
      // Scroll-out animations run AFTER entrance finishes
      .add(() => {
        // Arabic ayah
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
        // English translation
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
        // Surah reference
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
    //
    // Form slide-in from left animation
    gsap.fromTo(
      formRef.current,
      {
        x: -100,
        opacity: 0,
      },
      {
        x: 0,
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
          {/* Background image */}
          <div
            ref={bgRef}
            className="absolute inset-0 bg-no-repeat bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/BG.png')",
              opacity: 0.45,
            }}
          />
          {/* Ayah Content */}
          <div className="absolute md:top-[250px] flex flex-col items-center justify-center text-center px-6">
            <p
              ref={ayahRef}
              className="text-4xl md:text-6xl lg:text-8xl font-lateef leading-relaxed text-[#105A59]"
            >
              یٰۤاَیُّهَا الَّذِیۡنَ اٰمَنُوا اسۡتَعِیۡنُوۡا بِالصَّبۡرِ وَ
              الصَّلٰوۃِ ؕ اِنَّ اللّٰهَ مَعَ الصّٰبِرِیۡنَ
            </p>
            <p
              ref={translationRef}
              className="mt-6 text-2xl md:text-5 lg:text-6xl font-amiri font-bold text-[#105A59] px-2 md:px-6"
            >
              O believers! Seek comfort in patience and prayer. Allah is truly
              with those who are patient.
            </p>
            <p
              ref={chapterRef}
              className="mt-5 md:mt-10 text-xl md:text-3xl font-amiri font-normal text-[#105A59]"
            >
              Al-Baqarah 2:153
            </p>
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
