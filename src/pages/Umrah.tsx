import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import backgroundImage from "../assets/mekkahfullscreen.jpg";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Package {
  _id: string;
  name: string;
  date: string;
  description: string;
  price: number;
  photoPaths: string[];
}

const Umrah: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/packages`
        );

        if (!response.ok) {
          throw new Error("Kan de pakketten niet ophalen.");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setPackages(data);
        } else {
          throw new Error("Ongeldige data ontvangen van de server.");
        }
      } catch (err) {
        setError("Er is een fout opgetreden bij het ophalen van de pakketten.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return (
    <div>
      <Navbar />

      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 0,
          }}
        ></div>

        <div className="container mx-auto px-4 py-10 relative z-10 flex flex-col justify-center items-center min-h-screen">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 text-white">
            Beschikbare Umrah Pakketten
          </h1>

          {loading ? (
            <p className="text-white">Laden...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : packages.length > 0 ? (
            <div className="bg-transparent p-6 rounded-lg shadow-lg space-y-8 mt-12 md:mt-16 lg:mt-24">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {packages.map((pkg) => (
                  <div
                    key={pkg._id}
                    className="bg-gray-100 p-4 rounded-lg shadow-md"
                  >
                    <div className="h-48 mb-4">
                      <Swiper
                        modules={[Navigation, Pagination]}
                        navigation
                        pagination={{ clickable: true }}
                        className="h-full rounded-lg"
                      >
                        {pkg.photoPaths.map((path, index) => (
                          <SwiperSlide key={index}>
                            <img
                              src={path}
                              alt={`${pkg.name} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                    <h2 className="text-lg font-bold">{pkg.name}</h2>
                    <p className="text-sm text-gray-500">{pkg.date}</p>
                    <p className="text-sm text-gray-500">{pkg.description}</p>
                    <p className="text-xl font-bold text-green-600 mt-4">
                      Vanaf €{pkg.price}
                    </p>
                    <Link to={`/umrah/package/${pkg._id}`}>
                      <button className="mt-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
                        Meer Info
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-white">Geen pakketten beschikbaar.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Umrah;
