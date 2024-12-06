import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import backgroundImage from "../assets/mekkahfullscreen.jpg";
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

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            Onze Services
          </h1>

          {loading ? (
            <p className="text-white">Laden...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : services.length > 0 ? (
            <div className="bg-transparent p-6 rounded-lg shadow-lg space-y-8 mt-12 md:mt-16 lg:mt-24">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service) => (
                  <div
                    key={service._id}
                    className="bg-gray-100 p-4 rounded-lg shadow-md"
                  >
                    <div className="h-48 mb-4">
                      <Swiper
                        modules={[Navigation, Pagination]}
                        navigation
                        pagination={{ clickable: true }}
                        className="h-full rounded-lg"
                      >
                        {service.photoPaths.map((path, index) => (
                          <SwiperSlide key={index}>
                            <img
                              src={path}
                              alt={`${service.name} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                    <h4 className="text-xl font-bold">{service.name}</h4>
                    <p className="text-sm text-gray-500">{service.description}</p>
                    <p className="text-xl font-bold text-green-600 mt-4">
                      Vanaf €{service.price}
                    </p>
                    <Link to={`/services/${service._id}`}>
                      <button className="mt-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
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
      </div>
    </div>
  );
};

export default Services;
