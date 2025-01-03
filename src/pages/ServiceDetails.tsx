import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import CopyableImage from '../components/CopyableImage';

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number | null;
  isFree: boolean;
  location: string;
  startDate: string;
  endDate: string;
  numberOfRooms: number;
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
    <>
      <SEO 
        title={`Guide2Umrah - ${serviceData?.name || 'Service Details'}`}
        description={serviceData?.description || 'Bekijk de details van onze service voor uw Umrah-reis. Professionele begeleiding en ondersteuning voor een zorgeloze reis.'}
      />
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
            
            <div className="h-96 mb-8">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                className="h-full rounded-lg"
              >
                {serviceData.photoPaths.map((path, index) => (
                  <SwiperSlide key={index}>
                    <CopyableImage
                      src={path}
                      alt={`${serviceData.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">Locatie</h2>
                  <p className="text-gray-600 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    {serviceData.location}
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">Periode</h2>
                  <p className="text-gray-600 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    {new Date(serviceData.startDate).toLocaleDateString()} - {new Date(serviceData.endDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">Accommodatie</h2>
                  <p className="text-gray-600 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                    {serviceData.numberOfRooms} kamers beschikbaar
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">Prijs</h2>
                  {serviceData.isFree ? (
                    <p className="text-3xl font-bold text-green-600">Gratis</p>
                  ) : (
                    <p className="text-3xl font-bold text-green-600">
                      {serviceData.price ? `Vanaf €${serviceData.price}` : 'Prijs op aanvraag'}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Beschrijving</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {serviceData.description}
                </p>
              </div>
            </div>

            <div className="flex justify-center space-x-4 mb-8">
              <a
                href={`https://wa.me/+32465349779?text=Ik%20ben%20ge%C3%AFnteresseerd%20in%20de%20service%20${serviceData.name}%20en%20wil%20meer%20informatie%20ontvangen.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full max-w-md"
              >
                <button className="w-full bg-green-500 text-white px-8 py-4 rounded-full hover:bg-green-600 transition-all duration-300 shadow-lg transform hover:scale-105">
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
    </>
  );
};

export default ServiceDetails;
