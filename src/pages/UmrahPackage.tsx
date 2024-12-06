import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import backgroundImage from "../assets/mekkahfullscreen.jpg";
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

const UmrahPackage: React.FC = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/packages/${packageId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch package details");
        }
        const data = await response.json();
        setPackageData(data);
      } catch (err) {
        setError("Error fetching package");
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [packageId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Occurred</h2>
        <p className="text-lg text-gray-700 mb-4">{error}</p>
        <Link
          to="/umrah"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Back to Packages
        </Link>
      </div>
    );
  }

  if (!packageData) {
    return <p>No package found.</p>;
  }

  return (
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
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: 0,
        }}
      ></div>

      <Navbar />

      <div className="container mx-auto px-4 py-10 relative z-10">
        <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
            {packageData.name}
          </h1>

          <div className="h-96 mb-8">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              className="h-full rounded-lg"
            >
              {packageData.photoPaths.map((path, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={path}
                    alt={`${packageData.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Datum
              </h2>
              <p className="text-gray-600">{packageData.date}</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Beschrijving
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {packageData.description}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Prijs
              </h2>
              <p className="text-3xl font-bold text-green-600">
                Vanaf €{packageData.price}
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4 mt-8">
              <a
                href={`https://wa.me/+32465349779?text=Ik%20ben%20ge%C3%AFnteresseerd%20in%20het%20Umrah%20pakket%20${packageData.name}%20en%20wil%20meer%20informatie%20ontvangen.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full max-w-md"
              >
                <button className="w-full bg-green-500 text-white px-8 py-4 rounded-full hover:bg-green-600 transition-all duration-300 shadow-lg transform hover:scale-105">
                  Contact via WhatsApp
                </button>
              </a>

              <Link
                to="/umrah"
                className="text-green-500 hover:text-green-600 text-lg font-semibold"
              >
                Terug naar pakketten
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UmrahPackage;
