import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import LogoBanner from "../components/LogoBanner";

const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <LogoBanner />
      <Footer />
    </>
  );
};

export default Home;
