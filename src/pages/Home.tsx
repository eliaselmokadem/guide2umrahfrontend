import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import LogoBanner from "../components/LogoBanner";
import SEO from "../components/SEO";

const Home: React.FC = () => {
  return (
    <>
      <SEO 
        title="Guide2Umrah - Jouw perfecte Umrah-reis"
        description="Plan je perfecte Umrah-reis met onze umrahplanner. Bekijk onze reisadvies en plan je reis naar Mekka en Medina."
      />
      <Navbar />
      <Hero />
      <LogoBanner />
      <Footer />
    </>
  );
};

export default Home;
