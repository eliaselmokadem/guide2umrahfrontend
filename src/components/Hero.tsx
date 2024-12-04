import React from "react";
import { Link } from "react-router-dom";
import foto5 from "../assets/fotorecht3.jpg";
import safarcom from "../assets/safarcom.png";
import umrah2go from "../assets/umrah2go.png";
import jeddahflights from "../assets/jeddahflights.png";

const Hero: React.FC = () => {
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
      <div className="absolute w-full min-h-[50vh] sm:min-h-[40vh] bg-gradient-to-t from-black/60 text-white flex flex-col md:flex-row items-start md:items-center justify-between px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-16 bottom-0 gap-6 md:gap-8">
        {/* Text section */}
        <div className="w-full md:w-1/2 space-y-4 md:space-y-6">
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
