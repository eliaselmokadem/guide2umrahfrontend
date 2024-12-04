import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import foto5 from "../assets/fotorecht3.jpg";

const Hero: React.FC = () => {
  const [isHadithVisible, setIsHadithVisible] = useState(false);
  const [isVerseVisible, setIsVerseVisible] = useState(false);
  
  const hadithRef = useRef<HTMLDivElement>(null);
  const verseRef = useRef<HTMLDivElement>(null);
  const verse2Ref = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const scrollTargetRef = useRef<HTMLDivElement>(null);

  const scrollToQuotes = () => {
    scrollTargetRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const createObserver = (setVisible: (visible: boolean) => void) => {
      return new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisible(true);
            entry.target.getAnimations().forEach(animation => animation.play());
          }
        });
      }, observerOptions);
    };

    const observers = [
      { ref: hadithRef, setVisible: setIsHadithVisible },
      { ref: verseRef, setVisible: setIsVerseVisible },
    ].map(({ ref, setVisible }) => {
      const observer = createObserver(setVisible);
      if (ref.current) observer.observe(ref.current);
      return observer;
    });

    return () => {
      observers.forEach((observer, index) => {
        if ([hadithRef, verseRef, verse2Ref, quoteRef][index].current) {
          observer.disconnect();
        }
      });
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen font-tajawal overflow-x-hidden">
      {/* Background image with overlay */}
      <div
        className="fixed inset-0 z-[-1]"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${foto5})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* Content container */}
      <div className="relative w-full text-white flex flex-col md:flex-row items-start md:items-center justify-between px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-16 gap-6 md:gap-8 bg-gradient-to-t from-black/60">
        {/* Text section */}
        <div className="w-full md:w-1/2 space-y-4 md:space-y-6 mt-[30vh] md:mt-0">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-wide leading-tight">
            Welkom bij Guide2Umrah
          </h1>
          <p className="text-sm sm:text-base md:text-xl leading-relaxed opacity-90">
            Uw partner voor een spirituele en onvergetelijke reis naar Mekka en
            Medina. Boek nu uw exclusieve Umrah-pakket en ervaar comfort en
            kwaliteit.
          </p>
          <Link to="/umrah" className="block w-full md:w-auto">
            <button className="w-full md:w-auto bg-green-500 px-4 sm:px-6 md:px-8 py-2.5 md:py-3 text-black font-semibold text-base sm:text-lg md:text-xl rounded-full shadow-md hover:bg-green-600 active:bg-green-700 transition-all duration-200">
              Bekijk pakketten
            </button>
          </Link>

          <div className="mt-24 flex justify-center">
            <button 
              onClick={scrollToQuotes}
              className="text-white/80 hover:text-white flex flex-col items-center transition-all duration-300 group cursor-pointer"
            >
              <span className="mb-2">Zie meer</span>
              <svg 
                className="w-6 h-6 animate-bounce group-hover:translate-y-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                />
              </svg>
            </button>
          </div>

          {/* Invisible spacer container */}
          <div className="h-[45vh]"></div>

          <div ref={scrollTargetRef} className="mt-16 border-t border-white/20 pt-6">
            <div 
              ref={hadithRef}
              className={`transform transition-all duration-1000 ${
                isHadithVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-full opacity-0'
              }`}
            >
              <p className="text-xs sm:text-sm md:text-base leading-relaxed">
                <span className="block font-semibold text-emerald-400 mb-2">De Profeet ﷺ heeft gezegd:</span>
                <span className="block italic font-arabic text-right"> 
                "قال رسول الله صلى الله عليه وسلم: "تابِعوا بينَ الحجِّ والعمرةِ فإنَّهما ينفيانِ الفقرَ والذُّنوبَ كما ينفي الكِيرُ خبَثَ الحديدِ."  </span>
                <span className="block italic">
                  "Verricht geregeld de Hadj en Oemrah, aangezien deze armoede en zonden teniet doen. Net zoals een blaasbalg afkomt van het vuil van ijzer."
                </span>
                <span className="block text-xs mt-1 text-emerald-400">(an-Nasaa'ie, at-Tabaraanie; Sahieh verklaard door Sheikh al-Albaanie)</span>
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-white/20 pt-4">
            <div 
              ref={verseRef}
              className={`transform transition-all duration-1000 delay-300 ${
                isVerseVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-full opacity-0'
              }`}
            >
              <p className="text-xs sm:text-sm md:text-base leading-relaxed">
                <span className="block font-semibold text-emerald-400 mb-2">Allaah ﷻ zegt in de Quran:</span>
                <span className="block text-xl md:text-2xl mb-2 font-arabic text-right">
                  وَأَتِمُّوا۟ ٱلْحَجَّ وَٱلْعُمْرَةَ لِلَّهِ
                </span>
                <span className="block italic">
                  "En verricht de hadj en de umrah zuiver voor Allaah"
                </span>
                <span className="block text-xs mt-1 text-emerald-400">[Surah al-Baqarah : 196]</span>
              </p>
            </div>
          </div>

          {/* Second invisible spacer container */}
          <div className="h-[10vh]"></div>

        </div>

        {/* Partners section */}
        <div className="w-full md:w-1/2 flex flex-col items-center space-y-4 md:space-y-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-center">
            Hier zijn onze betrouwbare partners:
          </h2>
          
        </div>
      </div>
    </div>
  );
};

export default Hero;
