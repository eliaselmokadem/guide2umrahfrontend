import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

interface CustomPackageForm {
  departureLocation: string;
  destination: string;
  additionalStops: string[];
  startDate: string;
  endDate: string;
  numberOfPeople: number;
  hotelPreference: 'budget' | 'comfort' | 'luxury';
  transportPreference: 'basic' | 'comfort' | 'vip';
  additionalServices: string[];
  specialRequests: string;
  name: string;
  email: string;
  phone: string;
}

const CustomPackage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [newStop, setNewStop] = useState('');
  const [formData, setFormData] = useState<CustomPackageForm>({
    departureLocation: '',
    destination: '',
    additionalStops: [],
    startDate: '',
    endDate: '',
    numberOfPeople: 1,
    hotelPreference: 'comfort',
    transportPreference: 'comfort',
    additionalServices: [],
    specialRequests: '',
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const additionalServicesOptions = [
    { id: 'guide', label: 'Persoonlijke gids' },
    { id: 'meals', label: 'Maaltijden inbegrepen' },
    { id: 'activities', label: 'Extra activiteiten' },
    { id: 'insurance', label: 'Reisverzekering' },
    { id: 'visa', label: 'Visum service' },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      additionalServices: prev.additionalServices.includes(service)
        ? prev.additionalServices.filter((s) => s !== service)
        : [...prev.additionalServices, service],
    }));
  };

  const handleAddStop = () => {
    if (newStop.trim()) {
      setFormData((prev) => ({
        ...prev,
        additionalStops: [...prev.additionalStops, newStop.trim()],
      }));
      setNewStop('');
    }
  };

  const handleRemoveStop = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      additionalStops: prev.additionalStops.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.departureLocation || !formData.destination || !formData.startDate || 
        !formData.endDate || !formData.name || !formData.email || !formData.phone) {
      setError('Vul alstublieft alle verplichte velden in.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Vul alstublieft een geldig e-mailadres in.');
      return;
    }

    // Phone validation
    const phoneRegex = /^[0-9+\-\s()]*$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Vul alstublieft een geldig telefoonnummer in.');
      return;
    }

    // Date validation
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (end < start) {
      setError('De einddatum moet na de startdatum liggen.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/custom-package`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Er is iets misgegaan bij het versturen van je aanvraag.');
      }

      setSuccess('Je aanvraag is succesvol verzonden! We nemen zo snel mogelijk contact met je op.');
      
      // Wacht 3 seconden voordat we doorsturen naar de homepagina
      setTimeout(() => {
        navigate('/', {
          state: {
            message: 'Je aanvraag is succesvol verzonden! We nemen zo snel mogelijk contact met je op.',
          },
        });
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden.');
      console.error('Error submitting custom package:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="departureLocation" className="block text-sm font-medium text-gray-700">
          Vertreklocatie
        </label>
        <input
          type="text"
          id="departureLocation"
          name="departureLocation"
          value={formData.departureLocation}
          onChange={handleInputChange}
          placeholder="Bijv. Amsterdam, Brussel"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        />
      </div>

      <div>
        <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
          Hoofdbestemming
        </label>
        <input
          type="text"
          id="destination"
          name="destination"
          value={formData.destination}
          onChange={handleInputChange}
          placeholder="Bijv. Mekka"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Extra bestemmingen (optioneel)
        </label>
        <div className="mt-2 space-y-3">
          {formData.additionalStops.map((stop, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="flex-1 px-3 py-2 bg-gray-50 rounded-md">
                {stop}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveStop(index)}
                className="p-1 text-red-600 hover:text-red-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              type="text"
              value={newStop}
              onChange={(e) => setNewStop(e.target.value)}
              placeholder="Voeg een extra bestemming toe"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={handleAddStop}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Toevoegen
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Vertrekdatum
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            Retourdatum
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor="numberOfPeople" className="block text-sm font-medium text-gray-700">
          Aantal personen
        </label>
        <input
          type="number"
          id="numberOfPeople"
          name="numberOfPeople"
          min="1"
          value={formData.numberOfPeople}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="hotelPreference" className="block text-sm font-medium text-gray-700">
          Hotel voorkeur
        </label>
        <select
          id="hotelPreference"
          name="hotelPreference"
          value={formData.hotelPreference}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        >
          <option value="budget">Budget (3-sterren)</option>
          <option value="comfort">Comfort (4-sterren)</option>
          <option value="luxury">Luxe (5-sterren)</option>
        </select>
      </div>
      <div>
        <label htmlFor="transportPreference" className="block text-sm font-medium text-gray-700">
          Transport voorkeur
        </label>
        <select
          id="transportPreference"
          name="transportPreference"
          value={formData.transportPreference}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        >
          <option value="basic">Basis</option>
          <option value="comfort">Comfort</option>
          <option value="vip">VIP</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Extra services
        </label>
        <div className="space-y-2">
          {additionalServicesOptions.map((service) => (
            <div key={service.id} className="flex items-center">
              <input
                type="checkbox"
                id={service.id}
                checked={formData.additionalServices.includes(service.id)}
                onChange={() => handleCheckboxChange(service.id)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor={service.id} className="ml-2 block text-sm text-gray-700">
                {service.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Naam
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          E-mail
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Telefoonnummer
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        />
      </div>
      <div>
        <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700">
          Speciale verzoeken of opmerkingen
        </label>
        <textarea
          id="specialRequests"
          name="specialRequests"
          value={formData.specialRequests}
          onChange={handleInputChange}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Stel je eigen Umrah pakket samen
            </h1>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 relative ${
                      step < 3 ? 'after:content-[""] after:h-1 after:w-full after:bg-gray-200 after:absolute after:top-1/2 after:-translate-y-1/2 after:left-1/2' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${
                        step <= currentStep
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-sm text-gray-600">Reisdetails</span>
                <span className="text-sm text-gray-600">Voorkeuren</span>
                <span className="text-sm text-gray-600">Contactgegevens</span>
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}

              <div className="mt-8 flex justify-between">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Vorige
                  </button>
                )}
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="ml-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Volgende
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="ml-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Verzenden...' : 'Verstuur aanvraag'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPackage;
