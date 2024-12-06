import React from 'react';
import umrah2gopng from "../assets/umrah2go_bg_removed.png.png";
import safarcompng from "../assets/safarcom_bg_removed.png.png";
import jeddahflightspng from "../assets/jeddahflights-removebg-preview.png";
import flynaspng from "../assets/flynas-removebg-preview.png";
import nusuk from "../assets/nusuk-removebg-preview.png";

const LogoBanner: React.FC = () => {
  return (
    <div className="w-full bg-white py-2 md:py-6 overflow-hidden">
      <div className="flex animate-scroll whitespace-nowrap">
        {/* First set of logos */}
        <div className="flex min-w-max space-x-8 md:space-x-66 mx-6 md:mx-30">
          <div className="w-24 md:w-48 flex-shrink-0">
            <img loading="lazy" src={umrah2gopng} alt="Umrah2Go" className="h-16 md:h-24 object-contain" />
          </div>
          <div className="w-24 md:w-48 flex-shrink-0">
            <img loading="lazy" src={safarcompng} alt="Safarcom" className="h-16 md:h-24 object-contain" />
          </div>
          <div className="w-24 md:w-48 flex-shrink-0">
            <img loading="lazy" src={jeddahflightspng} alt="Jeddah Flights" className="h-16 md:h-24 object-contain" />
          </div>
          <div className="w-24 md:w-48 flex-shrink-0">
            <img loading="lazy" src={flynaspng} alt="Flynas" className="h-16 md:h-24 object-contain" />
          </div>
          <div className="w-24 md:w-48 flex-shrink-0">
            <img loading="lazy" src={nusuk} alt="Nusuk" className="h-16 md:h-24 object-contain" />
          </div>
        </div>

        {/* Duplicate set for seamless loop */}
        <div className="flex min-w-max space-x-8 md:space-x-66 mx-6 md:mx-30">
          <div className="w-24 md:w-48 flex-shrink-0">
            <img loading="lazy" src={umrah2gopng} alt="Umrah2Go" className="h-16 md:h-24 object-contain" />
          </div>
          <div className="w-24 md:w-48 flex-shrink-0">
            <img loading="lazy" src={safarcompng} alt="Safarcom" className="h-16 md:h-24 object-contain" />
          </div>
          <div className="w-24 md:w-48 flex-shrink-0">
            <img loading="lazy" src={jeddahflightspng} alt="Jeddah Flights" className="h-16 md:h-24 object-contain" />
          </div>
          <div className="w-24 md:w-48 flex-shrink-0">
            <img loading="lazy" src={flynaspng} alt="Flynas" className="h-16 md:h-24 object-contain" />
          </div>
          <div className="w-24 md:w-48 flex-shrink-0">
            <img loading="lazy" src={nusuk} alt="Nusuk" className="h-16 md:h-24 object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoBanner;
