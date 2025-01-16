import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { BackgroundImage } from '../components/BackgroundImage';
import Footer from "../components/Footer"; // Import de Footer

interface AboutUsContent {
  content: string;
  updatedAt: string;
}

const Aboutus: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('https://guide2umrah.onrender.com/api/about-us');
        if (!response.ok) {
          throw new Error('Failed to fetch about us content');
        }
        const data: AboutUsContent = await response.json();
        setContent(data.content);
      } catch (err) {
        console.error('Error fetching about us content:', err);
        setError('Er is een fout opgetreden bij het laden van de content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <BackgroundImage pageName="aboutus" className="min-h-screen bg-cover bg-center">
      <SEO
        title="Over Ons | Guide2Umrah"
        description="Leer meer over Guide2Umrah en onze missie om u te helpen bij uw spirituele reis."
      />
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 sm:p-8 md:p-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-8">
            Over Ons
          </h1>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center py-8">{error}</div>
          ) : (
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>
      </div>
      <Footer />
    </BackgroundImage>
  );
};

export default Aboutus;
