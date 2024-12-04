import React from 'react';
import umrah2gopng from "../assets/umrah2go_bg_removed.png.png";
import safarcompng from "../assets/safarcom_bg_removed.png.png";
import jeddahflightspng from "../assets/jeddahflights-removebg-preview.png";

const LogoBanner: React.FC = () => {
  return (
    <div className="w-full bg-transparent flex items-center justify-center space-x-5 py-4 md:py-4 overflow-hidden">
      <div className="flex animate-scroll whitespace-nowrap">
        {/* First set of logos */}
        <div className="flex min-w-max space-x-24 md:space-x-40 mx-12 md:mx-20">
          <div className="w-20 md:w-32 flex-shrink-0">
            <img src={umrah2gopng} alt="Umrah2Go" className="h-10 md:h-16 object-contain" />
          </div>
          <div className="w-20 md:w-32 flex-shrink-0">
            <img src={safarcompng} alt="Safarcom" className="h-10 md:h-16 object-contain" />
          </div>
          <div className="w-20 md:w-32 flex-shrink-0">
            <img src={jeddahflightspng} alt="Jeddah Flights" className="h-10 md:h-16 object-contain" />
          </div>
        </div>
        {/* Duplicate set for seamless loop */}
        <div className="flex min-w-max space-x-24 md:space-x-40 mx-12 md:mx-20">
          <div className="w-20 md:w-32 flex-shrink-0">
            <img src={umrah2gopng} alt="Umrah2Go" className="h-10 md:h-16 object-contain" />
          </div>
          <div className="w-20 md:w-32 flex-shrink-0">
            <img src={safarcompng} alt="Safarcom" className="h-10 md:h-16 object-contain" />
          </div>
          <div className="w-20 md:w-32 flex-shrink-0">
            <img src={jeddahflightspng} alt="Jeddah Flights" className="h-10 md:h-16 object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoBanner;
