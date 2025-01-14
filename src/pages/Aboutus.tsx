import React from "react";
import Navbar from "../components/Navbar";
import Banner from "../assets/banner.jpg";
import Footer from "../components/Footer"; // Import de Footer
import SEO from "../components/SEO";

const AboutUs: React.FC = () => {
  return (
    <>
      <SEO 
        title="Guide2Umrah - Over Ons"
        description="Leer meer over Guide2Umrah, uw betrouwbare partner voor Umrah-reizen. Ontdek onze ervaring, expertise en toewijding aan kwaliteit en service."
      />
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Hero Sectie */}
        <div
          className="bg-cover bg-center relative mb-2"
          style={{
            backgroundImage: `url(${Banner})`,
            height: "400px",
            backgroundSize: "contain", // Veranderd naar contain
            backgroundPosition: "center", // Zorgt ervoor dat de afbeelding in het midden blijft
            backgroundRepeat: "no-repeat", // Herhaal de afbeelding niet
          }}
        ></div>

        {/* About Us Content */}
        <div className="container mx-auto px-4 py-2 flex-grow">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Wie zijn wij?</h2>
          <p className="text-gray-700 leading-relaxed">
            Bij Guide2Umrah streven we ernaar om unieke en spirituele ervaringen
            te bieden aan onze reizigers. Ons doel is om uw reis naar Mekka en
            Medina onvergetelijk te maken. Met onze jarenlange ervaring en
            toewijding zorgen we voor een zorgeloze en gedenkwaardige Umrah-reis.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Onze Missie
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Onze missie is om moslims in België de mogelijkheid te bieden om hun
            spirituele reis te maken met de beste ondersteuning en begeleiding.
            Wij zorgen voor comfort, veiligheid en een diepe verbinding met de
            islamitische waarden tijdens uw reis.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Waarom kiezen voor ons?
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Ervaren reisbegeleiding</li>
            <li>Comfortabele accommodaties</li>
            <li>Uitgebreide klantenservice</li>
          </ul>
        </div>

        {/* Footer - sticky and at the bottom */}
        <Footer />
      </div>
    </>
  );
};

export default AboutUs;
