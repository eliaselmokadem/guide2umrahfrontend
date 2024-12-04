import React from 'react';
import umrah2gopng from "../assets/umrah2go_bg_removed.png.png";
import safarcompng from "../assets/safarcom_bg_removed.png.png";
import jeddahflightspng from "../assets/jeddahflights-removebg-preview.png";
import flynaspng from "../assets/flynas-removebg-preview.png";

const LogoBanner: React.FC = () => {
  return (
    <div className="w-full bg-white py-4 md:py-8 overflow-hidden">
      <div className="flex animate-scroll whitespace-nowrap">
        {/* First set of logos */}
        <div className="flex min-w-max space-x-12 md:space-x-20 mx-12 md:mx-20">
          <div className="w-28 md:w-48 flex-shrink-0">
            <img src={umrah2gopng} alt="Umrah2Go" className="h-20 md:h-24 object-contain" />
          </div>
          <div className="w-28 md:w-48 flex-shrink-0">
            <img src={safarcompng} alt="Safarcom" className="h-20 md:h-24 object-contain" />
          </div>
          <div className="w-28 md:w-48 flex-shrink-0">
            <img src={jeddahflightspng} alt="Jeddah Flights" className="h-20 md:h-24 object-contain" />
          </div>
          <div className="w-28 md:w-48 flex-shrink-0">
            <img src={flynaspng} alt="Flynas" className="h-20 md:h-24 object-contain"  />
          </div>
          <div className="w-28 md:w-48 flex-shrink-0">
            <img src={umrah2gopng} alt="Umrah2Go" className="h-20 md:h-24 object-contain" />
          </div>
          <div className="w-28 md:w-48 flex-shrink-0">
            <img src={safarcompng} alt="Safarcom" className="h-20 md:h-24 object-contain" />
          </div>
          <div className="w-28 md:w-48 flex-shrink-0">
            <img src={jeddahflightspng} alt="Jeddah Flights" className="h-20 md:h-24 object-contain" />
          </div>
          <div className="w-28 md:w-48 flex-shrink-0">
            <img src={flynaspng} alt="Flynas" className="h-20 md:h-24 object-contain"  />
          </div>
        </div>
          
       
        {/* Duplicate set for seamless loop */}
        <div className="flex min-w-max space-x-12 md:space-x-20 mx-12 md:mx-20">
          <div className="w-28 md:w-48 flex-shrink-0">
            <img src={umrah2gopng} alt="Umrah2Go" className="h-20 md:h-24 object-contain" />
          </div>
          <div className="w-28 md:w-48 flex-shrink-0">
            <img src={safarcompng} alt="Safarcom" className="h-20 md:h-24 object-contain" />
          </div>
          <div className="w-28 md:w-48 flex-shrink-0">
            <img src={jeddahflightspng} alt="Jeddah Flights" className="h-20 md:h-24 object-contain" />
          </div>
          <div className="w-28 md:w-48 flex-shrink-0">
            <img src={flynaspng}  className="h-20 md:h-24 object-contain" alt="Flynas" />
          </div>
          <div className="w-28 md:w-48 flex-shrink-0">
            <img src={umrah2gopng} alt="Umrah2Go" className="h-20 md:h-24 object-contain" />
          </div>
          <div className="w-28 md:w-48 flex-shrink-0">
            <img src={safarcompng} alt="Safarcom" className="h-20 md:h-24 object-contain" />
          </div>
          <div className="w-28 md:w-48 flex-shrink-0">
            <img src={jeddahflightspng} alt="Jeddah Flights" className="h-20 md:h-24 object-contain" />
          </div>
          <div className="w-28 md:w-48 flex-shrink-0">
            <img src={flynaspng}  className="h-20 md:h-24 object-contain" alt="Flynas" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoBanner;
