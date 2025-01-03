import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../assets/mekkahfullscreen.jpg";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import CopyableImage from '../components/CopyableImage';
import { BackgroundImage } from '../components/BackgroundImage';

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

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/services`);
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const data = await response.json();
        setServices(data);
      } catch (err) {
        setError("Error loading services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleServiceClick = (service: Service) => {
    navigate(`/services/${service._id}`);
  };

  return (
    <>
      <SEO 
        title="Guide2Umrah - Onze Diensten"
        description="Ontdek onze uitgebreide diensten voor uw Umrah-reis. Van visa-aanvragen tot private accommodatie en vervoer, wij regelen alles voor u."
      />
      <Navbar />
      <BackgroundImage pageName="services" fallbackImage={backgroundImage} className="min-h-screen">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative container mx-auto px-4 py-32">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 text-white">
            Onze Services
          </h1>

          {loading ? (
            <p className="text-white">Laden...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : services.length > 0 ? (
            <div className="bg-transparent p-6 rounded-lg shadow-lg space-y-8 mt-12 md:mt-16 lg:mt-24">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                  <div
                    key={service._id}
                    className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                    onClick={() => handleServiceClick(service)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="h-48 mb-4">
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
                        {service.photoPaths.map((path, index) => (
                          <SwiperSlide key={index}>
                            <CopyableImage
                              src={path}
                              alt={`${service.name} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                    <h4 className="text-xl font-bold">{service.name}</h4>
                    <p className="text-sm text-gray-500 mb-2">{service.description}</p>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        {service.location}
                      </p>
                      <p className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        {new Date(service.startDate).toLocaleDateString()} - {new Date(service.endDate).toLocaleDateString()}
                      </p>
                      <p className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                        </svg>
                        {service.numberOfRooms} kamers
                      </p>
                    </div>
                    <div className="mt-4">
                      {service.isFree ? (
                        <p className="text-xl font-bold text-green-600">Gratis</p>
                      ) : (
                        <p className="text-xl font-bold text-green-600">
                          {service.price ? `Vanaf €${service.price}` : 'Prijs op aanvraag'}
                        </p>
                      )}
                    </div>
                    <Link to={`/services/${service._id}`}>
                      <button className="mt-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition w-full">
                        Meer Info
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-white">Geen services beschikbaar.</p>
          )}
        </div>
      </BackgroundImage>
    </>
  );
};

export default Services;
