import React, { useState } from "react";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import backgroundImage from "../assets/mekkahfullscreen.jpg";
import { BackgroundImage } from '../components/BackgroundImage';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Er is iets misgegaan bij het verzenden van uw bericht.");
      }

      setStatus({
        type: "success",
        message: "Uw bericht is succesvol verzonden. We nemen zo snel mogelijk contact met u op.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: "Er is een fout opgetreden. Probeer het later opnieuw.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Guide2Umrah - Contact"
        description="Neem contact met ons op voor al uw vragen over Umrah reizen en diensten. Wij staan klaar om u te helpen."
      />
      <Navbar />
      <BackgroundImage pageName="contact" fallbackImage={backgroundImage} className="min-h-screen">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative container mx-auto px-4 py-32">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 text-white">
              Neem Contact Met Ons Op
            </h1>
            
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-lg text-white text-center">
                <svg className="w-8 h-8 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <h3 className="text-lg font-semibold mb-2">Telefoon</h3>
                <p>+32 465 34 97 79</p>
              </div>
              
              <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-lg text-white text-center">
                <svg className="w-8 h-8 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-semibold mb-2">E-mail</h3>
                <p>info@guide2umrah.com</p>
              </div>
              
              <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-lg text-white text-center">
                <svg className="w-8 h-8 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="text-lg font-semibold mb-2">Adres</h3>
                <p>Mechelen, Provincie Antwerpen</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-white text-sm font-medium mb-2">
                      Naam
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-white bg-opacity-20 border border-gray-300 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Uw naam"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-white bg-opacity-20 border border-gray-300 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="uw@email.nl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-white text-sm font-medium mb-2">
                      Telefoonnummer
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-white bg-opacity-20 border border-gray-300 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Uw telefoonnummer"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-white text-sm font-medium mb-2">
                      Onderwerp
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-white bg-opacity-20 border border-gray-300 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Onderwerp van uw bericht"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-white text-sm font-medium mb-2">
                    Bericht
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 bg-white bg-opacity-20 border border-gray-300 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Schrijf uw bericht hier..."
                  />
                </div>

                {status.message && (
                  <div
                    className={`p-4 rounded-md ${
                      status.type === "success"
                        ? "bg-green-500 bg-opacity-20 text-green-100"
                        : "bg-red-500 bg-opacity-20 text-red-100"
                    }`}
                  >
                    {status.message}
                  </div>
                )}

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-8 py-3 bg-green-500 text-black font-semibold rounded-full shadow-md hover:bg-green-600 active:bg-green-700 transition-all duration-200 ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Verzenden..." : "Verstuur Bericht"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </BackgroundImage>
    </>
  );
};

export default Contact;
