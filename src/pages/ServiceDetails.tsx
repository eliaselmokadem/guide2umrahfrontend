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

interface IUserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  comments?: string;
}

const ServiceDetails: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [serviceData, setServiceData] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

    try {
      const response = await fetch('https://guide2umrah.onrender.com/api/service-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId,
          serviceName: serviceData?.name,
          price: serviceData?.price,
          userInfo,
        }),
      });

      if (!response.ok) {
        throw new Error('Er is iets misgegaan bij het versturen van je aanvraag.');
      }

      setSubmitSuccess(true);
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
    <div className="min-h-screen bg-gray-100">
      <SEO title={serviceData?.name || 'Service Details'} description={serviceData?.description || ''} />
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : serviceData ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Image Slider */}
            <div className="relative">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                className="h-96"
              >
                {serviceData.photoPaths.map((photo, index) => (
                  <SwiperSlide key={index}>
                    <CopyableImage 
                      src={photo} 
                      alt={`${serviceData.name} - Photo ${index + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Service Details */}
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{serviceData.name}</h1>
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-semibold text-gray-900">
                  {serviceData.isFree ? (
                    <span className="text-green-600">Gratis</span>
                  ) : (
                    <span>€{serviceData.price}</span>
                  )}
                </div>
                <div className="text-gray-600">
                  {serviceData.location}
                </div>
              </div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Beschrijving</h2>
                <p className="text-gray-700 whitespace-pre-line">{serviceData.description}</p>
              </div>
              <div className="flex flex-wrap gap-4 text-gray-600">
                <div>
                  <span className="font-semibold">Start datum:</span> {new Date(serviceData.startDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-semibold">Eind datum:</span> {new Date(serviceData.endDate).toLocaleDateString()}
                </div>
              </div>

              {/* Contact Form */}
              <div className="p-6">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mt-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Interesse in deze dienst?</h2>
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
                    disabled={isSubmitting}
                    className={`mt-6 w-full py-3 px-6 rounded-lg text-white font-semibold ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {isSubmitting ? 'Bezig met verzenden...' : 'Verstuur Aanvraag'}
                  </button>
                </form>
              </div>

              {/* Contact Button */}
              <div className="mt-8">
                <a
                  href={`https://wa.me/+32465349779?text=Ik%20ben%20ge%C3%AFnteresseerd%20in%20de%20service%20${serviceData.name}%20en%20wil%20meer%20informatie%20ontvangen.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Contact via WhatsApp
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">Service not found</div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetails;
