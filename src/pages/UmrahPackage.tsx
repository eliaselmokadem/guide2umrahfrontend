import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import backgroundImage from "../assets/mekkahfullscreen.jpg";

interface Package {
  _id: string;
  name: string;
  date: string;
  duration: string;
  price: number;
  description: string;
  photoPath: string;
}

const UmrahPackage: React.FC = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        console.log('Fetching package with ID:', packageId);
        const response = await fetch(`https://guide2umrah.onrender.com/api/packages/${packageId}`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Fetched package data:', data);
        
        if (!data) {
          throw new Error('No package data received');
        }
        
        setPackageData(data);
      } catch (err) {
        console.error('Error fetching package:', err);
        setError('error fetching package');
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
        <p className="text-lg text-gray-700 mb-4">Package ID: {packageId}</p>
        <Link 
          to="/umrah" 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Back to Umrah Packages
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
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
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
            {packageData.name}
          </h1>
          <div className="flex flex-col md:flex-row md:justify-between mb-6">
            <p className="text-xl text-gray-600 mb-2 md:mb-0">{packageData.date}</p>
            <p className="text-lg text-gray-500">{packageData.duration}</p>
          </div>
          <p className="text-3xl font-bold text-green-600 mb-4">
            Vanaf €{packageData.price}
          </p>
          <img src={packageData.photoPath} alt="" />
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            {packageData.description}
          </p>

          <div className="flex justify-center mb-8">
            <a
              href={`https://wa.me/+32465349779?text=Ik%20ben%20ge%C3%AFnteresseerd%20in%20het%20Umrah-pakket%20${packageData.name}%20en%20wil%20meer%20informatie%20ontvangen.`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-green-500 text-white px-8 py-4 rounded-full hover:bg-green-600 transition-all duration-300 shadow-lg transform hover:scale-105">
                Boek nu via WhatsApp
              </button>
            </a>
          </div>

          <div className="flex justify-center">
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
  );
};

export default UmrahPackage;
