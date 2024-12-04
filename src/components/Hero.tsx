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
        className="absolute inset-0 z-[-1]"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${foto5})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* Content container */}
      <div className="absolute w-full min-h-screen md:min-h-[40vh] bg-gradient-to-t from-black/60 text-white flex flex-col md:flex-row items-start md:items-center justify-between px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-16 bottom-0 gap-6 md:gap-8">
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

          <div className="mt-32 border-t border-white/20 pt-6">
            <div 
              ref={hadithRef}
              className={`transform transition-all duration-1000 ${
                isHadithVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-full opacity-0'
              }`}
            >
              <p className="text-sm sm:text-base md:text-xl leading-relaxed">
                <span className="block font-semibold text-emerald-400 mb-3">De Profeet ﷺ heeft gezegd:</span>
                <span className="block italic">
                  "Verricht geregeld de Hadj en Oemrah, aangezien deze armoede en zonden teniet doen. Net zoals een blaasbalg afkomt van het vuil van ijzer."
                </span>
                <span className="block text-sm mt-2 text-emerald-400">(an-Nasaa'ie, at-Tabaraanie; Sahieh verklaard door Sheikh al-Albaanie)</span>
              </p>
            </div>
          </div>

          <div className="mt-16 border-t border-white/20 pt-6">
            <div 
              ref={verseRef}
              className={`transform transition-all duration-1000 delay-300 ${
                isVerseVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-full opacity-0'
              }`}
            >
              <p className="text-sm sm:text-base md:text-xl leading-relaxed">
                <span className="block font-semibold text-emerald-400 mb-3">Allaah ﷻ zegt in de Quran:</span>
                <span className="block text-2xl md:text-3xl mb-3 font-arabic text-right">
                  وَأَتِمُّوا۟ ٱلْحَجَّ وَٱلْعُمْرَةَ لِلَّهِ
                </span>
                <span className="block italic">
                  "En verricht de hadj en de umrah zuiver voor Allaah"
                </span>
                <span className="block text-sm mt-2 text-emerald-400">[Surah al-Baqarah : 196]</span>
              </p>
            </div>
          </div>

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
