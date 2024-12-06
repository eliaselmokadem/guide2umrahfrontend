import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  photoPaths: string[];
}

const ServiceDetails: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [serviceData, setServiceData] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`https://guide2umrah.onrender.com/api/services/${serviceId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch service details");
        }
        const data = await response.json();
        setServiceData(data);
      } catch (err) {
        setError("Error fetching service");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Occurred</h2>
        <p className="text-lg text-gray-700 mb-4">{error}</p>
        <Link
          to="/services"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Back to Services
        </Link>
      </div>
    );
  }

  if (!serviceData) {
    return <p>No service found.</p>;
  }

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        color: "#f0f0f0",
      }}
    >
      <Navbar />
      <div className="container mx-auto px-4 py-10 flex flex-col items-center">
        <div className="bg-white p-10 rounded-lg shadow-2xl max-w-3xl w-full">
          <h1 className="text-5xl font-bold text-gray-800 mb-6 text-center">
            {serviceData.name}
          </h1>
          
          <div className="h-96 mb-6">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              className="h-full rounded-lg"
            >
              {serviceData.photoPaths.map((path, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={path}
                    alt={`${serviceData.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <p className="text-3xl font-bold text-green-600 mb-4">
            Vanaf €{serviceData.price}
          </p>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            {serviceData.description}
          </p>

          <div className="flex justify-center mb-8">
            <a
              href={`https://wa.me/+32465349779?text=Ik%20ben%20ge%C3%AFnteresseerd%20in%20de%20service%20${serviceData.name}%20en%20wil%20meer%20informatie%20ontvangen.`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-green-500 text-white px-8 py-4 rounded-full hover:bg-green-600 transition-all duration-300 shadow-lg transform hover:scale-105">
                Contact via WhatsApp
              </button>
            </a>
          </div>

          <div className="flex justify-center">
            <Link
              to="/services"
              className="text-green-500 hover:text-green-600 text-lg font-semibold"
            >
              Terug naar services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
