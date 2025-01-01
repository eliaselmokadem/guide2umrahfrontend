import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ComingSoon: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage('Voer een geldig e-mailadres in.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Er is iets misgegaan.');
      }

      // Clear the form and show success message
      setEmail('');
      setMessage(data.message || 'Bedankt! We houden je op de hoogte.');
      
    } catch (error) {
      console.error('Subscription error:', error);
      setMessage(error instanceof Error ? error.message : 'Er is iets misgegaan. Probeer het later opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Coming Soon - Guide2Umrah</title>
        <meta name="description" content="Something amazing is coming soon to Guide2Umrah. Stay tuned for updates!" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow flex items-center justify-center bg-gradient-to-b from-white to-gray-100">
          <div className="container mx-auto px-4 py-16 text-center">
            <div className={`space-y-8 transform transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              {/* Decorative element */}
              <div className="w-24 h-24 mx-auto mb-8">
                <div className="w-full h-full rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
              </div>
              
              {/* Main text */}
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 animate-slide-up">
                Coming Soon
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-8 animate-slide-up">
                We zijn volop bezig met de ontwikkeling van onze website. 
              </p>
              
              <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 animate-slide-up">
                <p className="text-gray-700 mb-4">
                  Wil je op de hoogte blijven van het process?
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <input
                      type="email"
                      placeholder="Voer je email in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      disabled={isSubmitting}
                    />
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className={`bg-emerald-500 text-white px-6 py-2 rounded-md transition-colors ${
                        isSubmitting 
                          ? 'opacity-75 cursor-not-allowed' 
                          : 'hover:bg-emerald-600'
                      }`}
                    >
                      {isSubmitting ? 'Bezig...' : 'Laat me weten!'}
                    </button>
                  </div>
                  {message && (
                    <p className={`text-sm ${
                      message.includes('Bedankt') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {message}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default ComingSoon;
