import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import useLanguage from "../../Hooks/useLanguage";
import useTheme from "../../Hooks/useTheme";
import { usePageTitle } from "../../Hooks/pageName";
import PageTransition from "../../Hooks/PageTransition";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const PRESETS = [
  { id: "subhanallah", en: "SubhanAllah", bn: "সুবহান-আল্লাহ", target: 33 },
  { id: "alhamdulillah", en: "Alhamdulillah", bn: "আল'হামদুলিল্লাহ", target: 33 },
  { id: "allahuakbar", en: "Allahu Akbar", bn: "আল্লাহু আকবার", target: 34 },
  { id: "astaghfirullah", en: "Astaghfirullah", bn: "আস্তাগফিরুল্লাহ", target: 100 },
  { id: "general", en: "General", bn: "সাধারণ", target: Infinity },
];

const DAILY_TRACKER_KEY = "tasbeeh_daily_tracker";

const Tasbeeh = () => {
  usePageTitle("Tasbeeh", " | Dhikr Time");
  const language = useLanguage();
  const theme = useTheme();

  const isDark = theme === "dark";
  const textMain = isDark ? "text-text-dark" : "text-text-light";
  const bgMainStyle = isDark ? "rgba(10, 31, 28, 0.5)" : "rgba(255, 255, 255, 0.2)";
  const strokeColor = isDark ? "#c2ebfa" : "#0d3b35";
  const secondaryStroke = isDark ? "rgba(194, 235, 250, 0.2)" : "rgba(13, 59, 53, 0.2)";
  const btnBg = isDark ? "bg-[#c2ebfa]/10" : "bg-[#0d3b35]/10";
  const btnActiveBg = isDark ? "bg-[#c2ebfa]" : "bg-[#0d3b35]";
  const btnActiveText = isDark ? "text-[#0a1f1c]" : "text-[#c2ebfa]";
  const dividerVia = isDark ? "via-text-dark" : "via-text-light";

  const fontClass = language === "en" ? "font-amiri" : "font-balooDa";

  const [activePreset, setActivePreset] = useState(PRESETS[0]);
  const [count, setCount] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Daily Tracker State
  const [dailyStats, setDailyStats] = useState(() => {
    const today = new Date().toLocaleDateString();
    try {
      const stored = localStorage.getItem(DAILY_TRACKER_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === today) {
          return parsed;
        }
      }
    } catch(e) {}
    return { date: today, sessionsCompleted: 0, totalCount: 0 };
  });

  const containerRef = useRef(null);
  const circleRef = useRef(null);
  const pulseRef = useRef(null);
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };
  
  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  // Bengali number conversion
  const toBengaliNumber = (num) => {
    const bn = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num.toString().split("").map((d) => bn[parseInt(d)]).join("");
  };

  const currentCountText = language === "en" ? count : toBengaliNumber(count);
  const targetText = activePreset.target === Infinity 
    ? "∞" 
    : (language === "en" ? activePreset.target : toBengaliNumber(activePreset.target));
    
  // Sync Daily Tracker
  useEffect(() => {
    localStorage.setItem(DAILY_TRACKER_KEY, JSON.stringify(dailyStats));
  }, [dailyStats]);
  
  // Midnight Cross Check
  useEffect(() => {
    const today = new Date().toLocaleDateString();
    if (dailyStats.date !== today) {
       setDailyStats({ date: today, sessionsCompleted: 0, totalCount: 0 });
    }
  }, [count]); // checked passively when interacts

  // Change preset gracefully
  const handlePresetSelect = (preset) => {
    setActivePreset(preset);
    setCount(0);
    setCompleted(false);
  };

  // Reset / Next Stage
  const handleReset = () => {
    if (completed && activePreset.target !== Infinity) {
       const currentIndex = PRESETS.findIndex(p => p.id === activePreset.id);
       
       if (currentIndex === 3) {
           // Finished Astaghfirullah -> Complete 1 Full Session
           setDailyStats(prev => ({ ...prev, sessionsCompleted: prev.sessionsCompleted + 1 }));
           setActivePreset(PRESETS[0]);
       } else if (currentIndex >= 0 && currentIndex < 3) {
           // Finished a step -> Move to next preset automatically
           setActivePreset(PRESETS[currentIndex + 1]);
       }
    }
    setCount(0);
    setCompleted(false);
  };

  // Button conditional text
  const resetBtnTextEn = !completed 
    ? "Reset Focus" 
    : (activePreset.id === "astaghfirullah" ? "Complete Session" : "Next Dhikr");
  
  const resetBtnTextBn = !completed 
    ? "রিসেট করুন" 
    : (activePreset.id === "astaghfirullah" ? "সেশন সম্পূর্ণ করুন" : "পরবর্তী জিকির");

  // Animation on completion
  useEffect(() => {
    if (activePreset.target !== Infinity && count >= activePreset.target) {
      setCompleted(true);
      gsap.fromTo(circleRef.current, { scale: 1 }, { scale: 1.05, yoyo: true, repeat: 1, duration: 0.2, ease: "power2.out" });
      gsap.fromTo(pulseRef.current, { scale: 1, opacity: 0.5 }, { scale: 1.8, opacity: 0, duration: 0.6, ease: "power3.out" });
      
      // Attempt haptic feedback if available
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([200, 100, 200]);
      }
    }
  }, [count, activePreset.target]);

  // Click handler
  const handleClick = useCallback(() => {
    if (completed && activePreset.target !== Infinity) return;

    // Small haptic for standard click
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(20);
    }

    gsap.fromTo(circleRef.current, 
      { scale: 0.96 }, 
      { scale: 1, duration: 0.4, ease: "elastic.out(1.2, 0.5)" }
    );
    
    setCount((prev) => prev + 1);
    setDailyStats((prev) => ({ ...prev, totalCount: prev.totalCount + 1 }));
  }, [completed, activePreset.target]);

  // SVG metrics for ring
  const sqSizeDesktop = 260; // desktop size
  const sqSizeMobile = 240; // mobile size
  const strokeWidth = 12;
  const rx = 25; // Corner radius matching rounded-[25px]
  
  const getDashArray = (sqSize) => {
    const W = sqSize - strokeWidth;
    return (W * 4) - (8 * rx) + (2 * Math.PI * rx);
  };
  
  const dashArrayDesktop = getDashArray(sqSizeDesktop);
  const dashArrayMobile = getDashArray(sqSizeMobile);
  
  // Progress calculation
  let progress = 0;
  if (activePreset.target !== Infinity) {
    progress = (count / activePreset.target) * 100;
  } else {
    progress = (count % 100); 
  }
  
  const dashOffsetDesktop = dashArrayDesktop - (dashArrayDesktop * progress) / 100;
  const dashOffsetMobile = dashArrayMobile - (dashArrayMobile * progress) / 100;

  // Entry animation
  useGSAP(() => {
    gsap.from(containerRef.current, { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" });
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center pt-28 pb-20 px-4 md:px-10 overflow-x-hidden">
        
        {/* Header */}
        <div ref={containerRef} className="flex flex-col items-center w-full max-w-4xl">
          <h1 className={`text-4xl md:text-5xl lg:text-6xl ${textMain} ${fontClass} font-bold text-center`}>
            {language === "en" ? "Tasbeeh Counter" : "তাসবিহ"}
          </h1>
          
          {/* Divider */}
          <div className={`h-2 w-[75%] md:w-[40%] bg-gradient-to-r from-transparent ${dividerVia} to-transparent rounded-2xl mt-4 mb-10`} />

          {/* Presets Row */}
          <div className="relative w-full max-w-4xl mb-12 flex items-center">
            
            <button 
                onClick={scrollLeft} 
                className={`absolute left-0 p-1 md:hidden ${textMain} opacity-60 hover:opacity-100 z-10 bg-transparent`}
                aria-label="Scroll left"
            >
               <FiChevronLeft size={36} />
            </button>

            <div ref={scrollRef} className="flex overflow-x-auto items-center justify-start lg:justify-center gap-3 w-full px-10 md:px-4 py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x scroll-smooth">
              {PRESETS.map((preset) => {
                const isActive = activePreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className={`snap-center shrink-0 px-5 py-3 rounded-[15px] border-2 border-transparent transition-all duration-300 font-bold tracking-wide shadow-sm hover:shadow-md ${fontClass} text-lg md:text-xl
                      ${isActive ? `${btnActiveBg} ${btnActiveText}` : `${btnBg} ${textMain}`}`}
                  >
                    {language === "en" ? preset.en : preset.bn}
                  </button>
                );
              })}
            </div>

            <button 
                onClick={scrollRight} 
                className={`absolute right-0 p-1 md:hidden ${textMain} opacity-60 hover:opacity-100 z-10 bg-transparent`}
                aria-label="Scroll right"
            >
               <FiChevronRight size={36} />
            </button>
            
          </div>

          {/* Main Interaction Area */}
          <div className="relative flex flex-col items-center justify-center p-8 md:p-12 rounded-[15px] shadow-2xl backdrop-blur-md" 
               style={{ backgroundColor: bgMainStyle, border: `2px solid ${strokeColor}40` }}>

            <div className="mb-6 mb-10">
              <h2 className={`text-2xl md:text-4xl ${textMain} ${fontClass} font-bold tracking-wider text-center`}>
                {language === "en" ? activePreset.en : activePreset.bn}
              </h2>
            </div>
            
            {/* The Counter Widget */}
            <div className="relative flex justify-center items-center mb-6 z-10 w-[240px] md:w-[260px] h-[240px] md:h-[260px]">
               {/* Progress Ring */}
              <svg
                  width={sqSizeDesktop}
                  height={sqSizeDesktop}
                  viewBox={`0 0 ${sqSizeDesktop} ${sqSizeDesktop}`}
                  className="absolute inset-0 z-0 hidden md:block"
              >
                  <rect
                      className="transition-all duration-500 ease-out"
                      fill="none"
                      stroke={secondaryStroke}
                      x={strokeWidth / 2}
                      y={strokeWidth / 2}
                      width={sqSizeDesktop - strokeWidth}
                      height={sqSizeDesktop - strokeWidth}
                      rx={rx}
                      ry={rx}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                  />
                  <rect
                      className="transition-all duration-500 ease-out"
                      fill="none"
                      stroke={strokeColor}
                      x={strokeWidth / 2}
                      y={strokeWidth / 2}
                      width={sqSizeDesktop - strokeWidth}
                      height={sqSizeDesktop - strokeWidth}
                      rx={rx}
                      ry={rx}
                      strokeWidth={strokeWidth}
                      strokeDasharray={dashArrayDesktop}
                      strokeDashoffset={dashOffsetDesktop}
                      strokeLinecap="round"
                  />
              </svg>
              
              {/* Mobile scalar SVG */}
              <svg
                  width={sqSizeMobile}
                  height={sqSizeMobile}
                  viewBox={`0 0 ${sqSizeMobile} ${sqSizeMobile}`}
                  className="absolute inset-0 z-0 md:hidden"
              >
                  <rect
                      className="transition-all duration-500 ease-out"
                      fill="none"
                      stroke={secondaryStroke}
                      x={strokeWidth / 2}
                      y={strokeWidth / 2}
                      width={sqSizeMobile - strokeWidth}
                      height={sqSizeMobile - strokeWidth}
                      rx={rx}
                      ry={rx}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                  />
                  <rect
                      className="transition-all duration-500 ease-out"
                      fill="none"
                      stroke={strokeColor}
                      x={strokeWidth / 2}
                      y={strokeWidth / 2}
                      width={sqSizeMobile - strokeWidth}
                      height={sqSizeMobile - strokeWidth}
                      rx={rx}
                      ry={rx}
                      strokeWidth={strokeWidth}
                      strokeDasharray={dashArrayMobile}
                      strokeDashoffset={dashOffsetMobile}
                      strokeLinecap="round"
                  />
              </svg>

              {/* Pulse ripple div */}
              <div ref={pulseRef} className={`absolute inset-0 rounded-[25px] ${btnBg} pointer-events-none`} />

              {/* Tappable Button Base */}
              <button
                ref={circleRef}
                onClick={handleClick}
                disabled={completed}
                className={`relative z-10 w-[190px] md:w-[210px] h-[190px] md:h-[210px] rounded-[25px] shadow-lg flex flex-col justify-center items-center focus:outline-none transition-shadow hover:shadow-2xl active:shadow-inner ${btnBg} disabled:opacity-90 disabled:cursor-not-allowed`}
              >
                <span className={`text-6xl md:text-7xl font-bold mb-1 ${textMain} ${fontClass} leading-none tracking-tighter`}>
                  {currentCountText}
                </span>
                <div className={`h-1 w-1/3 rounded-full my-2 bg-gradient-to-r from-transparent ${dividerVia} to-transparent opacity-50`} />
                <span className={`text-2xl md:text-3xl font-normal opacity-70 ${textMain} ${fontClass} leading-none`}>
                  {targetText}
                </span>
              </button>
            </div>

            {/* Status & Reset */}
            <div className={`flex flex-col items-center gap-4 transition-all duration-500 min-h-[60px] ${completed ? 'opacity-100 scale-100 mt-2' : 'opacity-0 scale-95 mt-[-10px] pointer-events-none'}`}>
               <p className={`text-2xl md:text-3xl font-bold ${textMain} ${completed ? 'text-green-500' : ''} ${fontClass}`}>
                  {language === "en" ? "Target Reached! MashaAllah!" : "লক্ষ্য পূরণ হয়েছে! মাশাআল্লাহ্‌!"}
               </p>
            </div>
               
            <button 
                onClick={handleReset}
                className={`mt-4 px-6 py-2 rounded-[15px] text-xl md:text-2xl font-bold cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-dashed
                ${fontClass} ${completed ? 'bg-green-500/20 text-green-500 border-green-500/70' : textMain}`}
                style={{ borderColor: completed ? '' : `${strokeColor}80` }}
            >
                {language === "en" ? resetBtnTextEn : resetBtnTextBn}
            </button>

          </div>

          {/* Daily Dashboard Area */}
          <div className="w-full max-w-2xl px-6 py-8 rounded-[15px] shadow-xl backdrop-blur-md flex flex-col items-center mt-8 transition-all duration-500"
               style={{ backgroundColor: bgMainStyle, border: `2px solid ${strokeColor}20` }}>
             <h3 className={`text-2xl md:text-3xl font-bold mb-6 tracking-wide ${textMain} ${fontClass}`}>
               {language === "en" ? "Daily Progress" : "দৈনিক অগ্রগতি"}
             </h3>
             <div className="w-full flex flex-col gap-4 px-2">
                 <div className="flex justify-between items-end w-full">
                     <span className={`text-lg md:text-xl ${textMain} opacity-80 ${fontClass}`}>
                       {language === "en" ? "Sessions Completed" : "সেশন সম্পন্ন"}
                     </span>
                     <span className={`text-2xl font-bold ${textMain} ${fontClass}`}>
                       {language === "en" ? `${dailyStats.sessionsCompleted} / 5` : `${toBengaliNumber(dailyStats.sessionsCompleted)} / ৫`}
                     </span>
                 </div>
                 
                 {/* Progress Bar */}
                 <div className="w-full h-3 rounded-full overflow-hidden shadow-inner" style={{ backgroundColor: `${strokeColor}20` }}>
                    <div className="h-full rounded-full transition-all duration-1000 ease-out shadow-lg" 
                         style={{ 
                            width: `${Math.min((dailyStats.sessionsCompleted / 5) * 100, 100)}%`, 
                            backgroundColor: strokeColor 
                         }} 
                    />
                 </div>
                 
                 <div className="flex justify-between items-center w-full mt-4 p-4 rounded-[10px]" style={{ backgroundColor: `${strokeColor}10` }}>
                     <span className={`text-lg md:text-xl font-medium ${textMain} opacity-90 ${fontClass}`}>
                       {language === "en" ? "Total Dhikr Today" : "আজকের মোট জিকির"}
                     </span>
                     <span className={`text-3xl font-bold tracking-wider ${textMain} ${fontClass}`}>
                       {language === "en" ? dailyStats.totalCount : toBengaliNumber(dailyStats.totalCount)}
                     </span>
                 </div>
             </div>
             
             {/* Celebration Message */}
             {dailyStats.sessionsCompleted >= 5 && (
                <div className={`mt-8 text-center text-xl md:text-2xl font-bold text-green-500 ${fontClass}`} style={{ animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}>
                   {language === "en" ? "MashaAllah! You've accomplished your daily goal!" : "মাশাআল্লাহ্‌! আপনি আজকের লক্ষ্য পূরণ করেছেন!"}
                </div>
             )}

             {/* Reset Dashboard Button */}
             <button
                 onClick={() => {
                     const confirmMsg = language === "en" 
                         ? "Are you sure you want to reset all daily counts?" 
                         : "আপনি কি নিশ্চিত যে আপনি সমস্ত দৈনিক গণনা রিসেট করতে চান?";
                     if (window.confirm(confirmMsg)) {
                         setDailyStats({ date: new Date().toLocaleDateString(), sessionsCompleted: 0, totalCount: 0 });
                         localStorage.removeItem(DAILY_TRACKER_KEY);
                     }
                 }}
                 className={`mt-8 px-6 py-2 rounded-[12px] text-sm md:text-base font-bold cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white ${fontClass}`}
             >
                 {language === "en" ? "Reset Sessions & Counts" : "সেশন এবং গণনা রিসেট করুন"}
             </button>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default Tasbeeh;
