import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import backgroundImage from "../assets/mekkahfullscreen.jpg";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import CopyableImage from '../components/CopyableImage';

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

interface IUserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  comments?: string;
}

interface ISelectedRoom {
  destinationIndex: number;
  roomType: string;
  quantity: number;
  price: number;
}

const UmrahPackage: React.FC = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<number>(0);
  const [selectedRooms, setSelectedRooms] = useState<ISelectedRoom[]>([]);
  const [userInfo, setUserInfo] = useState<IUserInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    comments: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
        console.log("Package data:", data);
        
        if (!data.destinations || !Array.isArray(data.destinations)) {
          throw new Error("Invalid package data format");
        }

        // Ensure roomTypes is properly structured for each destination
        const processedData = {
          ...data,
          destinations: data.destinations.map((dest: any) => ({
            ...dest,
            roomTypes: {
              singleRoom: dest.roomTypes?.singleRoom || { available: false, quantity: 0, price: 0 },
              doubleRoom: dest.roomTypes?.doubleRoom || { available: false, quantity: 0, price: 0 },
              tripleRoom: dest.roomTypes?.tripleRoom || { available: false, quantity: 0, price: 0 },
              quadRoom: dest.roomTypes?.quadRoom || { available: false, quantity: 0, price: 0 },
              customRoom: dest.roomTypes?.customRoom || { available: false, quantity: 0, capacity: 0, price: 0 },
            }
          }))
        };
        
        setPackageData(processedData);
      } catch (err) {
        console.error("Error:", err);
        setError(err instanceof Error ? err.message : "Error fetching package");
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [packageId]);

  const handleRoomSelection = (roomType: string, price: number) => {
    const existingRoomIndex = selectedRooms.findIndex(
      room => room.destinationIndex === selectedDestination && room.roomType === roomType
    );

    if (existingRoomIndex !== -1) {
      // Remove the room if it's already selected
      setSelectedRooms(selectedRooms.filter((_, index) => index !== existingRoomIndex));
    } else {
      // Add the new room selection
      setSelectedRooms([
        ...selectedRooms,
        {
          destinationIndex: selectedDestination,
          roomType,
          quantity: 1,
          price
        }
      ]);
    }
  };

  const isRoomSelected = (roomType: string): boolean => {
    return selectedRooms.some(
      room => room.destinationIndex === selectedDestination && room.roomType === roomType
    );
  };

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    if (selectedRooms.length === 0) {
      setSubmitError('Selecteer minimaal één kamer per locatie.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('https://guide2umrah.onrender.com/api/booking-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId,
          packageName: packageData?.name,
          selectedRooms,
          userInfo,
        }),
      });

      if (!response.ok) {
        throw new Error('Er is iets misgegaan bij het versturen van je aanvraag.');
      }

      setSubmitSuccess(true);
      setSelectedRooms([]);
      setUserInfo({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        comments: ''
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Er is iets misgegaan.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (!packageData || !packageData.destinations || packageData.destinations.length === 0) {
    return <p>No package found.</p>;
  }

  const currentDestination = packageData.destinations[selectedDestination];

  return (
    <>
      <SEO 
        title={`Guide2Umrah - ${packageData.name || 'Umrah Pakket'}`}
        description={packageData.description || 'Bekijk de details van ons Umrah pakket met accommodatie, vervoer en begeleiding inbegrepen.'}
      />
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

            <p className="text-gray-600 mb-8 text-center">{packageData.description}</p>

            {/* Destination selector if multiple destinations */}
            {packageData.destinations.length > 1 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bestemmingen</h2>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {packageData.destinations.map((dest, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDestination(index)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedDestination === index
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {dest.location}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                {currentDestination.photoPaths.map((path, index) => (
                  <SwiperSlide key={index}>
                    <CopyableImage
                      src={path}
                      alt={`${packageData.name} - ${currentDestination.location} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Locatie</h2>
                  <p className="text-gray-600 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    {currentDestination.location}
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Periode</h2>
                  <p className="text-gray-600 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    {new Date(currentDestination.startDate).toLocaleDateString()} - {new Date(currentDestination.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Beschikbare Kamers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentDestination.roomTypes.singleRoom.available && (
                    <div 
                      className={`bg-white shadow-lg rounded-lg p-6 border-l-4 cursor-pointer transition-all duration-200 ${
                        isRoomSelected('singleRoom') ? 'border-blue-500 ring-2 ring-blue-200' : 'border-green-500 hover:shadow-xl'
                      }`}
                      onClick={() => handleRoomSelection('singleRoom', currentDestination.roomTypes.singleRoom.price)}
                    >
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">1-persoonskamer</h3>
                      <div className="space-y-3">
                        <p className="text-gray-600">
                          <span className="font-medium">Beschikbaar:</span> {currentDestination.roomTypes.singleRoom.quantity} kamers
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {packageData.isFree ? 'Gratis' : `€${currentDestination.roomTypes.singleRoom.price}`}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {currentDestination.roomTypes.doubleRoom.available && (
                    <div 
                      className={`bg-white shadow-lg rounded-lg p-6 border-l-4 cursor-pointer transition-all duration-200 ${
                        isRoomSelected('doubleRoom') ? 'border-blue-500 ring-2 ring-blue-200' : 'border-green-500 hover:shadow-xl'
                      }`}
                      onClick={() => handleRoomSelection('doubleRoom', currentDestination.roomTypes.doubleRoom.price)}
                    >
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">2-persoonskamer</h3>
                      <div className="space-y-3">
                        <p className="text-gray-600">
                          <span className="font-medium">Beschikbaar:</span> {currentDestination.roomTypes.doubleRoom.quantity} kamers
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {packageData.isFree ? 'Gratis' : `€${currentDestination.roomTypes.doubleRoom.price}`}
                        </p>
                      </div>
                    </div>
                  )}

                  {currentDestination.roomTypes.tripleRoom.available && (
                    <div 
                      className={`bg-white shadow-lg rounded-lg p-6 border-l-4 cursor-pointer transition-all duration-200 ${
                        isRoomSelected('tripleRoom') ? 'border-blue-500 ring-2 ring-blue-200' : 'border-green-500 hover:shadow-xl'
                      }`}
                      onClick={() => handleRoomSelection('tripleRoom', currentDestination.roomTypes.tripleRoom.price)}
                    >
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">3-persoonskamer</h3>
                      <div className="space-y-3">
                        <p className="text-gray-600">
                          <span className="font-medium">Beschikbaar:</span> {currentDestination.roomTypes.tripleRoom.quantity} kamers
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {packageData.isFree ? 'Gratis' : `€${currentDestination.roomTypes.tripleRoom.price}`}
                        </p>
                      </div>
                    </div>
                  )}

                  {currentDestination.roomTypes.quadRoom.available && (
                    <div 
                      className={`bg-white shadow-lg rounded-lg p-6 border-l-4 cursor-pointer transition-all duration-200 ${
                        isRoomSelected('quadRoom') ? 'border-blue-500 ring-2 ring-blue-200' : 'border-green-500 hover:shadow-xl'
                      }`}
                      onClick={() => handleRoomSelection('quadRoom', currentDestination.roomTypes.quadRoom.price)}
                    >
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">4-persoonskamer</h3>
                      <div className="space-y-3">
                        <p className="text-gray-600">
                          <span className="font-medium">Beschikbaar:</span> {currentDestination.roomTypes.quadRoom.quantity} kamers
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {packageData.isFree ? 'Gratis' : `€${currentDestination.roomTypes.quadRoom.price}`}
                        </p>
                      </div>
                    </div>
                  )}

                  {currentDestination.roomTypes.customRoom.available && (
                    <div 
                      className={`bg-white shadow-lg rounded-lg p-6 border-l-4 cursor-pointer transition-all duration-200 ${
                        isRoomSelected('customRoom') ? 'border-blue-500 ring-2 ring-blue-200' : 'border-green-500 hover:shadow-xl'
                      }`}
                      onClick={() => handleRoomSelection('customRoom', currentDestination.roomTypes.customRoom.price)}
                    >
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        {currentDestination.roomTypes.customRoom.capacity}-persoonskamer
                      </h3>
                      <div className="space-y-3">
                        <p className="text-gray-600">
                          <span className="font-medium">Beschikbaar:</span> {currentDestination.roomTypes.customRoom.quantity} kamers
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {packageData.isFree ? 'Gratis' : `€${currentDestination.roomTypes.customRoom.price}`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Rooms Summary */}
              {selectedRooms.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Geselecteerde Kamers</h2>
                  {selectedRooms.map((room, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium">{packageData?.destinations[room.destinationIndex].location}</p>
                        <p className="text-gray-600">{room.roomType.replace('Room', '-persoonskamer')}</p>
                      </div>
                      <p className="font-bold">€{room.price}</p>
                    </div>
                  ))}
                  <div className="mt-4 text-right">
                    <p className="text-xl font-bold">
                      Totaal: €{selectedRooms.reduce((sum, room) => sum + room.price, 0)}
                    </p>
                  </div>
                </div>
              )}

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mt-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Persoonlijke Informatie</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-gray-700 mb-2">Voornaam *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={userInfo.firstName}
                      onChange={handleUserInfoChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-gray-700 mb-2">Achternaam *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={userInfo.lastName}
                      onChange={handleUserInfoChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-2">E-mail *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userInfo.email}
                      onChange={handleUserInfoChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 mb-2">Telefoonnummer *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={userInfo.phone}
                      onChange={handleUserInfoChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label htmlFor="comments" className="block text-gray-700 mb-2">Opmerkingen</label>
                  <textarea
                    id="comments"
                    name="comments"
                    value={userInfo.comments}
                    onChange={handleUserInfoChange}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                {submitError && (
                  <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {submitError}
                  </div>
                )}

                {submitSuccess && (
                  <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
                    Je aanvraag is succesvol verzonden! We nemen zo spoedig mogelijk contact met je op.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || selectedRooms.length === 0}
                  className={`mt-6 w-full py-3 px-6 rounded-lg text-white font-semibold ${
                    isSubmitting || selectedRooms.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isSubmitting ? 'Bezig met verzenden...' : 'Verzend Aanvraag'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UmrahPackage;
