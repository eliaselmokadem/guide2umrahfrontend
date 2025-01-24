import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import backgroundImage from "../assets/mekkahfullscreen.jpg";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import CopyableImage from '../components/CopyableImage';
import { BackgroundImage } from '../components/BackgroundImage';

interface RoomTypes {
  singleRoom: { available: boolean; quantity: number; price: number };
  doubleRoom: { available: boolean; quantity: number; price: number };
  tripleRoom: { available: boolean; quantity: number; price: number };
  quadRoom: { available: boolean; quantity: number; price: number };
  customRoom: { available: boolean; quantity: number; capacity: number; price: number };
}

interface Destination {
  location: string;
  startDate: string;
  endDate: string;
  photoPaths: string[];
  roomTypes: RoomTypes;
}

interface Package {
  _id: string;
  name: string;
  description: string;
  isFree: boolean;
  destinations: Destination[];
}

const getLowestPrice = (destinations: Destination[]): number => {
  if (!destinations || destinations.length === 0) return 0;
  
  return Math.min(
    ...destinations.map(destination => {
      const prices = [
        destination.roomTypes.singleRoom.available ? destination.roomTypes.singleRoom.price : Infinity,
        destination.roomTypes.doubleRoom.available ? destination.roomTypes.doubleRoom.price : Infinity,
        destination.roomTypes.tripleRoom.available ? destination.roomTypes.tripleRoom.price : Infinity,
        destination.roomTypes.quadRoom.available ? destination.roomTypes.quadRoom.price : Infinity,
        destination.roomTypes.customRoom.available ? destination.roomTypes.customRoom.price : Infinity,
      ];
      return Math.min(...prices);
    })
  );
};

const Umrah: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    date: '',
    sortBy: 'none'
  });

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
          setFilteredPackages(data);
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

  useEffect(() => {
    let result = [...packages];

    // Filter by price range
    if (filters.minPrice) {
      result = result.filter(pkg => {
        const lowestPrice = getLowestPrice(pkg.destinations);
        return !pkg.isFree && lowestPrice > 0 && lowestPrice >= Number(filters.minPrice);
      });
    }
    if (filters.maxPrice) {
      result = result.filter(pkg => {
        const lowestPrice = getLowestPrice(pkg.destinations);
        return !pkg.isFree && lowestPrice > 0 && lowestPrice <= Number(filters.maxPrice);
      });
    }

    // Filter by date
    if (filters.date) {
      const filterDate = new Date(filters.date);
      result = result.filter(pkg => 
        pkg.destinations.some(dest => new Date(dest.startDate) >= filterDate)
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'priceAsc':
        result.sort((a, b) => getLowestPrice(a.destinations) - getLowestPrice(b.destinations));
        break;
      case 'priceDesc':
        result.sort((a, b) => getLowestPrice(b.destinations) - getLowestPrice(a.destinations));
        break;
      case 'dateAsc':
        result.sort((a, b) => {
          const aDate = Math.min(...a.destinations.map(d => new Date(d.startDate).getTime()));
          const bDate = Math.min(...b.destinations.map(d => new Date(d.startDate).getTime()));
          return aDate - bDate;
        });
        break;
      case 'dateDesc':
        result.sort((a, b) => {
          const aDate = Math.min(...a.destinations.map(d => new Date(d.startDate).getTime()));
          const bDate = Math.min(...b.destinations.map(d => new Date(d.startDate).getTime()));
          return bDate - aDate;
        });
        break;
    }

    setFilteredPackages(result);
  }, [packages, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePackageClick = (pkg: Package) => {
    // implement handlePackageClick functionality here
  };

  return (
    <>
      <SEO 
        title="Guide2Umrah - Umrah Pakketten"
        description="Ontdek onze exclusieve Umrah-pakketten. Volledig verzorgde reizen naar Mekka en Medina met professionele begeleiding."
      />
      <Navbar />
      <BackgroundImage pageName="umrah" fallbackImage={backgroundImage} className="min-h-screen">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative container mx-auto px-4 py-32">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 text-white">
            Beschikbare Umrah Pakketten
          </h1>

          {/* Filter Section */}
          <div className="bg-white rounded-lg p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  name="date"
                  value={filters.date}
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
          ) : filteredPackages.length > 0 ? (
            <div className="bg-transparent p-6 rounded-lg shadow-lg space-y-8 mt-12 md:mt-16 lg:mt-24">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPackages.map((pkg) => (
                  <div
                    key={pkg._id}
                    className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                    onClick={() => handlePackageClick(pkg)}
                  >
                    {pkg.destinations && pkg.destinations.length > 0 && (
                      <div className="h-96">
                        <Swiper
                          modules={[Navigation, Pagination, Autoplay]}
                          navigation
                          pagination={{ clickable: true }}
                          autoplay={{ delay: 5000 }}
                          className="h-96"
                        >
                          {pkg.destinations.map((destination, destIndex) => 
                            destination.photoPaths.map((photo, photoIndex) => (
                              <SwiperSlide key={`${destIndex}-${photoIndex}`} className="h-96">
                                <CopyableImage
                                  src={photo}
                                  alt={`${pkg.name} - ${destination.location}`}
                                  className="w-full h-96 object-contain"
                                />
                              </SwiperSlide>
                            ))
                          )}
                        </Swiper>
                      </div>
                    )}

                    <div className="mt-4">
                      <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
                      <p className="text-gray-600 mb-4">{pkg.description}</p>
                      
                      {/* Destinations Section */}
                      <div className="space-y-4">
                        {pkg.destinations && pkg.destinations.map((destination, index) => (
                          <div key={index} className="border-t pt-4">
                            <h4 className="font-semibold text-lg mb-2">{destination.location}</h4>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600">
                                {new Date(destination.startDate).toLocaleDateString()} - {new Date(destination.endDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="space-y-1">
                              {destination.roomTypes.singleRoom.available && (
                                <p className="text-sm">
                                  Enkele kamer: €{destination.roomTypes.singleRoom.price}
                                </p>
                              )}
                              {destination.roomTypes.doubleRoom.available && (
                                <p className="text-sm">
                                  Dubbele kamer: €{destination.roomTypes.doubleRoom.price}
                                </p>
                              )}
                              {destination.roomTypes.tripleRoom.available && (
                                <p className="text-sm">
                                  Triple kamer: €{destination.roomTypes.tripleRoom.price}
                                </p>
                              )}
                              {destination.roomTypes.quadRoom.available && (
                                <p className="text-sm">
                                  Quad kamer: €{destination.roomTypes.quadRoom.price}
                                </p>
                              )}
                              {destination.roomTypes.customRoom.available && (
                                <p className="text-sm">
                                  Custom kamer ({destination.roomTypes.customRoom.capacity} personen): €{destination.roomTypes.customRoom.price}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-emerald-600 font-semibold">
                          {pkg.isFree ? (
                            "Gratis"
                          ) : (
                            `Vanaf €${getLowestPrice(pkg.destinations)}`
                          )}
                        </span>
                        <Link
                          to={`/umrah-package/${pkg._id}`}
                          className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
                        >
                          Bekijk Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-white text-center">Geen pakketten gevonden die aan de criteria voldoen.</p>
          )}
        </div>
      </BackgroundImage>
    </>
  );
};

export default Umrah;
