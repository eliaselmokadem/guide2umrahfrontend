import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { useNavigate } from "react-router-dom";
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
  startDate?: string;
  endDate?: string;
  numberOfRooms: number;
  photoPaths: string[];
}

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    startDate: '',
    sortBy: 'none' // 'none', 'priceAsc', 'priceDesc', 'dateAsc', 'dateDesc'
  });
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
        setFilteredServices(data);
        
        // Extract unique locations with proper typing
        const uniqueLocations = Array.from(
          new Set(data.map((service: Service) => service.location))
        ).sort() as string[];
        setLocations(uniqueLocations);
      } catch (err) {
        setError("Error loading services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    let result = [...services];

    // Filter by location
    if (filters.location) {
      result = result.filter(service => 
        service.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Filter by price range
    if (filters.minPrice) {
      result = result.filter(service => 
        !service.isFree && service.price && service.price >= Number(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      result = result.filter(service => 
        !service.isFree && service.price && service.price <= Number(filters.maxPrice)
      );
    }

    // Filter by start date
    if (filters.startDate) {
      const filterDate = new Date(filters.startDate);
      result = result.filter(service => 
        service.startDate && new Date(service.startDate) >= filterDate
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'priceAsc':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'priceDesc':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'dateAsc':
        result.sort((a, b) => new Date(a.startDate || '9999-12-31').getTime() - new Date(b.startDate || '9999-12-31').getTime());
        break;
      case 'dateDesc':
        result.sort((a, b) => new Date(b.startDate || '9999-12-31').getTime() - new Date(a.startDate || '9999-12-31').getTime());
        break;
    }

    setFilteredServices(result);
  }, [services, filters]);

  const handleServiceClick = (service: Service) => {
    navigate(`/services/${service._id}`);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
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

          {/* Filter Section */}
          <div className="bg-white rounded-lg p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Locatie
                </label>
                <select
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Alle locaties</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min. Prijs (€)
                </label>
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Min prijs"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max. Prijs (€)
                </label>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Max prijs"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vanaf Datum
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sorteer op
                </label>
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="none">Geen sortering</option>
                  <option value="priceAsc">Prijs (laag naar hoog)</option>
                  <option value="priceDesc">Prijs (hoog naar laag)</option>
                  <option value="dateAsc">Datum (vroeg naar laat)</option>
                  <option value="dateDesc">Datum (laat naar vroeg)</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <p className="text-white">Laden...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredServices.length > 0 ? (
            <div className="bg-transparent p-6 rounded-lg shadow-lg space-y-8 mt-12 md:mt-16 lg:mt-24">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.map((service, index) => (
                  <div
                    key={service._id}
                    className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
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
                      {service.startDate && service.endDate && (
                        <p className="text-gray-600 mb-2">
                          <span className="font-semibold">Datum: </span>
                          {new Date(service.startDate).toLocaleDateString()} - {new Date(service.endDate).toLocaleDateString()}
                        </p>
                      )}
                      
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
                    <button 
                      onClick={() => handleServiceClick(service)}
                      className="mt-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition w-full"
                    >
                      Meer Info
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-white text-center">Geen services gevonden die aan de criteria voldoen.</p>
          )}
        </div>
      </BackgroundImage>
    </>
  );
};

export default Services;
