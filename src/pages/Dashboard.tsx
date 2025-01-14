import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { BackgroundImageManager } from "../components/admin/BackgroundImageManager";

interface RoomTypes {
  singleRoom: { available: boolean; quantity: number; price: number };
  doubleRoom: { available: boolean; quantity: number; price: number };
  tripleRoom: { available: boolean; quantity: number; price: number };
  quadRoom: { available: boolean; quantity: number; price: number };
  customRoom: { available: boolean; quantity: number; capacity: number; price: number };
}

// Interface for the API response
interface Destination {
  location: string;
  startDate: string;
  endDate: string;
  photoPaths: string[];
  roomTypes: RoomTypes;
}

// Interface for the form state
interface DestinationFormData {
  location: string;
  startDate: string;
  endDate: string;
  photos: File[];
  roomTypes: RoomTypes;
}

interface Package {
  _id: string;
  name: string;
  description: string;
  isFree: boolean;
  destinations: Destination[];
}

interface PackageFormData {
  name: string;
  description: string;
  isFree: boolean;
  destinations: DestinationFormData[];
}

interface Service {
  _id: string;
  name: string;
  description: string;
  isFree: boolean;
  location: string;
  startDate: string;
  endDate: string;
  photoPaths: string[];
  price: number;
}

const Dashboard: React.FC = () => {
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [packageData, setPackageData] = useState<PackageFormData>({
    name: "",
    description: "",
    isFree: false,
    destinations: [{
      location: "",
      startDate: "",
      endDate: "",
      photos: [] as File[],
      roomTypes: {
        singleRoom: { available: false, quantity: 0, price: 0 },
        doubleRoom: { available: false, quantity: 0, price: 0 },
        tripleRoom: { available: false, quantity: 0, price: 0 },
        quadRoom: { available: false, quantity: 0, price: 0 },
        customRoom: { available: false, quantity: 0, capacity: 0, price: 0 }
      }
    }]
  });
  const [serviceData, setServiceData] = useState({
    name: "",
    description: "",
    isFree: false,
    location: "",
    startDate: "",
    endDate: "",
    photos: [] as File[],
    price: 0
  });
  const [packages, setPackages] = useState<Package[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [editPackageId, setEditPackageId] = useState<string | null>(null);
  const [editServiceId, setEditServiceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPackages, setShowPackages] = useState(true);
  const [showServices, setShowServices] = useState(true);
  const [showBackgrounds, setShowBackgrounds] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchData = async () => {
      try {
        const [packagesResponse, servicesResponse] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/api/packages`),
          fetch(`${process.env.REACT_APP_API_URL}/api/services`)
        ]);

        if (!packagesResponse.ok || !servicesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [packagesData, servicesData] = await Promise.all([
          packagesResponse.json(),
          servicesResponse.json()
        ]);

        setPackages(packagesData);
        setServices(servicesData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching data");
      }
    };

    fetchData();
  }, []);

  const handlePackageInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    destinationIndex?: number
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (destinationIndex === undefined) {
      // Handle package-level fields
      if (type === "checkbox") {
        const checked = (e.target as HTMLInputElement).checked;
        setPackageData(prev => ({
          ...prev,
          [name]: checked
        }));
      } else {
        setPackageData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      // Handle destination-level fields
      setPackageData(prev => {
        const newDestinations = [...prev.destinations];
        if (name.startsWith('roomTypes.')) {
          const [, roomType, field] = name.split('.');
          if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            newDestinations[destinationIndex] = {
              ...newDestinations[destinationIndex],
              roomTypes: {
                ...newDestinations[destinationIndex].roomTypes,
                [roomType]: {
                  ...newDestinations[destinationIndex].roomTypes[roomType as keyof RoomTypes],
                  [field]: checked,
                  price: checked ? newDestinations[destinationIndex].roomTypes[roomType as keyof RoomTypes].price : 0
                }
              }
            };
          } else {
            newDestinations[destinationIndex] = {
              ...newDestinations[destinationIndex],
              roomTypes: {
                ...newDestinations[destinationIndex].roomTypes,
                [roomType]: {
                  ...newDestinations[destinationIndex].roomTypes[roomType as keyof RoomTypes],
                  [field]: type === "number" ? Number(value) : value
                }
              }
            };
          }
        } else {
          newDestinations[destinationIndex] = {
            ...newDestinations[destinationIndex],
            [name]: value
          };
        }
        return { ...prev, destinations: newDestinations };
      });
    }
  };

  const handleAddDestination = () => {
    setPackageData(prev => ({
      ...prev,
      destinations: [
        ...prev.destinations,
        {
          location: "",
          startDate: "",
          endDate: "",
          photos: [],
          roomTypes: {
            singleRoom: { available: false, quantity: 0, price: 0 },
            doubleRoom: { available: false, quantity: 0, price: 0 },
            tripleRoom: { available: false, quantity: 0, price: 0 },
            quadRoom: { available: false, quantity: 0, price: 0 },
            customRoom: { available: false, quantity: 0, capacity: 0, price: 0 }
          }
        }
      ]
    }));
  };

  const handleRemoveDestination = (index: number) => {
    setPackageData(prev => ({
      ...prev,
      destinations: prev.destinations.filter((_, i) => i !== index)
    }));
  };

  const handlePackageFileChange = (e: React.ChangeEvent<HTMLInputElement>, destinationIndex: number) => {
    const files = Array.from(e.target.files || []);
    setPackageData(prev => {
      const newDestinations = [...prev.destinations];
      newDestinations[destinationIndex] = {
        ...newDestinations[destinationIndex],
        photos: [...newDestinations[destinationIndex].photos, ...files]
      };
      return { ...prev, destinations: newDestinations };
    });
  };

  const handleRemovePackagePhoto = (destinationIndex: number, photoIndex: number) => {
    setPackageData(prev => {
      const newDestinations = [...prev.destinations];
      newDestinations[destinationIndex] = {
        ...newDestinations[destinationIndex],
        photos: newDestinations[destinationIndex].photos.filter((_, i) => i !== photoIndex)
      };
      return { ...prev, destinations: newDestinations };
    });
  };

  const handlePackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", packageData.name);
      formData.append("description", packageData.description);
      formData.append("isFree", String(packageData.isFree));
      
      // Prepare destinations data with photo counts
      const destinationsWithPhotoCounts = packageData.destinations.map(dest => ({
        location: dest.location,
        startDate: dest.startDate,
        endDate: dest.endDate,
        roomTypes: JSON.stringify(dest.roomTypes), // Stringify the roomTypes object
        photoCount: dest.photos.length
      }));
      
      // Append destinations data
      formData.append("destinations", JSON.stringify(destinationsWithPhotoCounts));

      // Append all photos in sequence
      packageData.destinations.forEach(destination => {
        destination.photos.forEach(photo => {
          formData.append("photos", photo);
        });
      });

      const response = editPackageId
        ? await fetch(
            `${process.env.REACT_APP_API_URL}/api/packages/${editPackageId}`,
            {
              method: "PUT",
              body: formData,
            }
          )
        : await fetch(`${process.env.REACT_APP_API_URL}/api/packages`, {
            method: "POST",
            body: formData,
          });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error saving package");
      }

      const result = await response.json();
      console.log("Server response:", result);

      alert(
        editPackageId
          ? "Package updated successfully!"
          : "Package added successfully!"
      );

      setShowPackageModal(false);
      setPackageData({
        name: "",
        description: "",
        isFree: false,
        destinations: [{
          location: "",
          startDate: "",
          endDate: "",
          photos: [],
          roomTypes: {
            singleRoom: { available: false, quantity: 0, price: 0 },
            doubleRoom: { available: false, quantity: 0, price: 0 },
            tripleRoom: { available: false, quantity: 0, price: 0 },
            quadRoom: { available: false, quantity: 0, price: 0 },
            customRoom: { available: false, quantity: 0, capacity: 0, price: 0 }
          }
        }]
      });
      setEditPackageId(null);

      const updatedPackages = await fetch(
        `${process.env.REACT_APP_API_URL}/api/packages`
      ).then((res) => res.json());
      setPackages(updatedPackages);
    } catch (err) {
      console.error("Error saving package:", err);
      alert(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleServiceInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setServiceData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setServiceData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleServiceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setServiceData((prevData) => ({ ...prevData, photos: [...prevData.photos, ...files] }));
  };

  const handleRemoveServicePhoto = (index: number) => {
    setServiceData((prevData) => ({
      ...prevData,
      photos: prevData.photos.filter((_, i) => i !== index),
    }));
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", serviceData.name);
      formData.append("description", serviceData.description);
      formData.append("isFree", String(serviceData.isFree));
      formData.append("location", serviceData.location);
      formData.append("startDate", serviceData.startDate);
      formData.append("endDate", serviceData.endDate);
      formData.append("price", String(serviceData.isFree ? 0 : serviceData.price));
      serviceData.photos.forEach((photo) => {
        formData.append(`photos`, photo);
      });

      const response = editServiceId
        ? await fetch(
            `${process.env.REACT_APP_API_URL}/api/services/${editServiceId}`,
            {
              method: "PUT",
              body: formData,
            }
          )
        : await fetch(`${process.env.REACT_APP_API_URL}/api/services`, {
            method: "POST",
            body: formData,
          });

      if (!response.ok) {
        throw new Error("Error saving service");
      }

      alert(
        editServiceId
          ? "Service updated successfully!"
          : "Service added successfully!"
      );

      setShowServiceModal(false);
      setServiceData({
        name: "",
        description: "",
        isFree: false,
        location: "",
        startDate: "",
        endDate: "",
        photos: [],
        price: 0
      });
      setEditServiceId(null);

      const updatedServices = await fetch(
        `${process.env.REACT_APP_API_URL}/api/services`
      ).then((res) => res.json());
      setServices(updatedServices);
    } catch (err) {
      console.error("Error saving service:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPackage = (pkg: Package) => {
    setEditPackageId(pkg._id);
    setPackageData({
      name: pkg.name,
      description: pkg.description,
      isFree: pkg.isFree,
      destinations: pkg.destinations.map(dest => ({
        location: dest.location,
        startDate: dest.startDate,
        endDate: dest.endDate,
        photos: [], // Initialize with empty array since we can't get the Files back from API
        roomTypes: dest.roomTypes
      }))
    });
    setShowPackageModal(true);
  };

  const handleEditService = (service: any) => {
    setEditServiceId(service._id);
    setServiceData({
      name: service.name,
      description: service.description,
      isFree: service.isFree,
      location: service.location,
      startDate: service.startDate,
      endDate: service.endDate,
      photos: [],
      price: service.price
    });
    setShowServiceModal(true);
  };

  const handleDeletePackage = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this package?")) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/packages/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Error deleting package");
      }

      alert("Package deleted successfully!");
      setPackages(packages.filter((pkg) => pkg._id !== id));
    } catch (err) {
      console.error("Error deleting package:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/services/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Error deleting service");
      }

      alert("Service deleted successfully!");
      setServices(services.filter((service) => service._id !== id));
    } catch (err) {
      console.error("Error deleting service:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-start justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-7xl p-8 space-y-6 bg-white shadow-lg rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-4xl font-bold text-gray-800">
              Welkom op het Dashboard
            </h2>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Uitloggen
            </button>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Background Images Section */}
          <div className="mb-12">
            <div 
              className="flex justify-between items-center mb-6 cursor-pointer bg-gray-50 p-4 rounded-lg hover:bg-gray-100"
              onClick={() => setShowBackgrounds(!showBackgrounds)}
            >
              <h3 className="text-2xl font-bold text-gray-700 flex items-center gap-2">
                Achtergrondafbeeldingen beheren
                <svg
                  className={`w-6 h-6 transform transition-transform ${showBackgrounds ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </h3>
            </div>

            {showBackgrounds && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <BackgroundImageManager pageName="home" className="mb-4" />
                <BackgroundImageManager pageName="umrah" className="mb-4" />
                <BackgroundImageManager pageName="services" className="mb-4" />
                <BackgroundImageManager pageName="about" className="mb-4" />
                <BackgroundImageManager pageName="contact" className="mb-4" />
              </div>
            )}
          </div>

          {/* Packages Section */}
          <div className="mb-12">
            <div 
              className="flex justify-between items-center mb-6 cursor-pointer bg-gray-50 p-4 rounded-lg hover:bg-gray-100"
              onClick={() => setShowPackages(!showPackages)}
            >
              <h3 className="text-2xl font-bold text-gray-700 flex items-center gap-2">
                Beheer Pakketten
                <svg
                  className={`w-6 h-6 transform transition-transform ${showPackages ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </h3>
              {showPackages && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPackageModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Nieuw Pakket Toevoegen
                </button>
              )}
            </div>

            {showPackages && (
              <div>
                {loading ? (
                  <p className="text-center mt-4">Laden...</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages.map((pkg) => (
                      <div
                        key={pkg._id}
                        className="p-4 bg-gray-100 rounded-lg shadow-lg"
                      >
                        <div className="grid grid-cols-2 gap-2">
                          {pkg.destinations.map((destination, index) => (
                            <div key={index}>
                              <h4 className="text-lg font-bold mb-2">{destination.location}</h4>
                              <p className="text-gray-500">{destination.startDate} - {destination.endDate}</p>
                            </div>
                          ))}
                        </div>
                        <h4 className="text-xl font-bold mt-4">{pkg.name}</h4>
                        <p className="text-gray-500">{pkg.description}</p>
                        <p className="text-gray-700 mt-2">
                          {pkg.isFree ? (
                            'Gratis'
                          ) : (
                            'Prijs op aanvraag'
                          )}
                        </p>
                        
                        {/* Display Room Types */}
                        <div className="mt-4">
                          <h5 className="font-semibold text-gray-700 mb-2">Beschikbare Kamers:</h5>
                          <div className="space-y-2">
                            {pkg.destinations.map((destination, index) => (
                              <div key={index}>
                                <h6 className="text-md font-bold">{destination.location}</h6>
                                {Object.entries(destination.roomTypes).map(([roomType, data]) => (
                                  <p key={roomType} className="text-sm text-gray-600">
                                    {roomType === 'singleRoom' && '1-persoonskamer'}
                                    {roomType === 'doubleRoom' && '2-persoonskamer'}
                                    {roomType === 'tripleRoom' && '3-persoonskamer'}
                                    {roomType === 'quadRoom' && '4-persoonskamer'}
                                    {roomType === 'customRoom' && 'Custom kamer'}
                                    : {data.quantity}x ({pkg.isFree ? 'Gratis' : `€${data.price}`})
                                  </p>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between mt-4">
                          <button
                            onClick={() => handleEditPackage(pkg)}
                            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          >
                            Bewerken
                          </button>
                          <button
                            onClick={() => handleDeletePackage(pkg._id)}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Verwijderen
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Services Section */}
          <div className="mb-12">
            <div 
              className="flex justify-between items-center mb-6 cursor-pointer bg-gray-50 p-4 rounded-lg hover:bg-gray-100"
              onClick={() => setShowServices(!showServices)}
            >
              <h3 className="text-2xl font-bold text-gray-700 flex items-center gap-2">
                Beheer Services
                <svg
                  className={`w-6 h-6 transform transition-transform ${showServices ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </h3>
              {showServices && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowServiceModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Nieuwe Service Toevoegen
                </button>
              )}
            </div>

            {showServices && (
              <div>
                {loading ? (
                  <p className="text-center mt-4">Laden...</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                      <div
                        key={service._id}
                        className="p-4 bg-gray-100 rounded-lg shadow-lg"
                      >
                        <div className="grid grid-cols-2 gap-2">
                          {service.photoPaths.map((path, index) => (
                            <img
                              key={index}
                              src={path}
                              alt={`${service.name} ${index + 1}`}
                              className="w-full h-40 object-cover rounded"
                            />
                          ))}
                        </div>
                        <h4 className="text-xl font-bold mt-4">{service.name}</h4>
                        <p className="text-gray-500">{service.description}</p>
                        <p className="text-gray-700 mt-2">
                          {service.isFree ? (
                            'Gratis'
                          ) : (
                            `€${service.price}`
                          )}
                        </p>
                        <p className="text-gray-500 mt-1">Datum: {service.startDate} - {service.endDate}</p>
                        <p className="text-gray-500 mt-1">Locatie: {service.location}</p>
                        <div className="flex justify-between mt-4">
                          <button
                            onClick={() => handleEditService(service)}
                            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          >
                            Bewerken
                          </button>
                          <button
                            onClick={() => handleDeleteService(service._id)}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Verwijderen
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Package Modal */}
          {showPackageModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
              <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg my-8 mx-4 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {editPackageId ? "Pakket Bewerken" : "Nieuw Pakket"}
                </h2>
                <form className="space-y-4" onSubmit={handlePackageSubmit}>
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Naam
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={packageData.name}
                      onChange={handlePackageInputChange}
                      required
                      className="w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Omschrijving
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={packageData.description}
                      onChange={handlePackageInputChange}
                      required
                      className="w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                  <div>
                    <label
                      htmlFor="isFree"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Gratis
                    </label>
                    <input
                      type="checkbox"
                      id="isFree"
                      name="isFree"
                      checked={packageData.isFree}
                      onChange={handlePackageInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  {/* Destinations */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">Bestemmingen</h3>
                      <button
                        type="button"
                        onClick={handleAddDestination}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
                      >
                        Bestemming Toevoegen
                      </button>
                    </div>

                    {packageData.destinations.map((destination, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-md font-medium text-gray-900">Bestemming {index + 1}</h4>
                          {packageData.destinations.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveDestination(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Verwijderen
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Locatie</label>
                            <input
                              type="text"
                              name="location"
                              value={destination.location}
                              onChange={(e) => handlePackageInputChange(e, index)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Start Datum</label>
                              <input
                                type="date"
                                name="startDate"
                                value={destination.startDate}
                                onChange={(e) => handlePackageInputChange(e, index)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Eind Datum</label>
                              <input
                                type="date"
                                name="endDate"
                                value={destination.endDate}
                                onChange={(e) => handlePackageInputChange(e, index)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Foto's</label>
                            <input
                              type="file"
                              multiple
                              onChange={(e) => handlePackageFileChange(e, index)}
                              className="mt-1 block w-full"
                            />
                            {destination.photos.length > 0 && (
                              <div className="mt-2 grid grid-cols-3 gap-2">
                                {destination.photos.map((photo, photoIndex) => (
                                  <div key={photoIndex} className="relative">
                                    <img
                                      src={URL.createObjectURL(photo)}
                                      alt={`Preview ${photoIndex + 1}`}
                                      className="w-full h-20 object-cover rounded"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleRemovePackagePhoto(index, photoIndex)}
                                      className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full transform translate-x-1/2 -translate-y-1/2"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Room Types */}
                          <div className="space-y-4">
                            <h5 className="text-sm font-medium text-gray-900">Kamer Types</h5>
                            {Object.entries(destination.roomTypes).map(([roomType, data]) => (
                              <div key={roomType} className="space-y-2">
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    name={`roomTypes.${roomType}.available`}
                                    checked={data.available}
                                    onChange={(e) => handlePackageInputChange(e, index)}
                                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">
                                    {roomType === 'singleRoom' && 'Enkele Kamer'}
                                    {roomType === 'doubleRoom' && 'Dubbele Kamer'}
                                    {roomType === 'tripleRoom' && 'Triple Kamer'}
                                    {roomType === 'quadRoom' && 'Quad Kamer'}
                                    {roomType === 'customRoom' && 'Custom Kamer'}
                                  </span>
                                </label>

                                {data.available && (
                                  <div className="grid grid-cols-2 gap-2 ml-6">
                                    <div>
                                      <label className="block text-xs text-gray-700">Aantal</label>
                                      <input
                                        type="number"
                                        name={`roomTypes.${roomType}.quantity`}
                                        value={data.quantity}
                                        onChange={(e) => handlePackageInputChange(e, index)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-700">Prijs (€)</label>
                                      <input
                                        type="number"
                                        name={`roomTypes.${roomType}.price`}
                                        value={data.price}
                                        onChange={(e) => handlePackageInputChange(e, index)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                      />
                                    </div>
                                    {roomType === 'customRoom' && (
                                      <div>
                                        <label className="block text-xs text-gray-700">Capaciteit</label>
                                        <input
                                          type="number"
                                          name={`roomTypes.${roomType}.capacity`}
                                          value={data.capacity}
                                          onChange={(e) => handlePackageInputChange(e, index)}
                                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPackageModal(false);
                        setEditPackageId(null);
                      }}
                      className="px-4 py-2 text-gray-500 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300"
                    >
                      Annuleren
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
                    >
                      Opslaan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Service Modal */}
          {showServiceModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
              <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg my-8 mx-4 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {editServiceId ? "Service Bewerken" : "Nieuwe Service"}
                </h2>
                <form className="space-y-4" onSubmit={handleServiceSubmit}>
                  <div>
                    <label
                      htmlFor="serviceName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Naam
                    </label>
                    <input
                      id="serviceName"
                      name="name"
                      type="text"
                      value={serviceData.name}
                      onChange={handleServiceInputChange}
                      required
                      className="w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="serviceDescription"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Omschrijving
                    </label>
                    <textarea
                      id="serviceDescription"
                      name="description"
                      value={serviceData.description}
                      onChange={handleServiceInputChange}
                      required
                      className="w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                  <div>
                    <label
                      htmlFor="serviceIsFree"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Gratis
                    </label>
                    <input
                      type="checkbox"
                      id="serviceIsFree"
                      name="isFree"
                      checked={serviceData.isFree}
                      onChange={handleServiceInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="serviceLocation"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Locatie
                    </label>
                    <input
                      id="serviceLocation"
                      name="location"
                      type="text"
                      value={serviceData.location}
                      onChange={handleServiceInputChange}
                      required
                      className="w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="serviceStartDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Startdatum
                    </label>
                    <input
                      id="serviceStartDate"
                      name="startDate"
                      type="date"
                      value={serviceData.startDate}
                      onChange={handleServiceInputChange}
                      required
                      className="w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="serviceEndDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Einddatum
                    </label>
                    <input
                      id="serviceEndDate"
                      name="endDate"
                      type="date"
                      value={serviceData.endDate}
                      onChange={handleServiceInputChange}
                      required
                      className="w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={serviceData.isFree}
                        onChange={(e) =>
                          setServiceData({ ...serviceData, isFree: e.target.checked })
                        }
                        className="mr-2"
                      />
                      <span className="text-gray-700 text-sm font-bold">Gratis</span>
                    </label>
                  </div>
                  {!serviceData.isFree && (
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Prijs
                      </label>
                      <input
                        type="number"
                        value={serviceData.price}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value >= 0) {
                            setServiceData({ ...serviceData, price: value });
                          }
                        }}
                        min="0"
                        className="w-full px-3 py-2 border rounded"
                        required={!serviceData.isFree}
                      />
                    </div>
                  )}
                  <div>
                    <label
                      htmlFor="servicePhoto"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Foto's Uploaden
                    </label>
                    <input
                      id="servicePhoto"
                      name="photo"
                      type="file"
                      accept="image/*"
                      onChange={handleServiceFileChange}
                      multiple
                      className="w-full px-4 py-2 mt-1"
                    />
                    {serviceData.photos.length > 0 && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {serviceData.photos.map((photo, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(photo)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveServicePhoto(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowServiceModal(false);
                        setEditServiceId(null);
                      }}
                      className="px-4 py-2 text-gray-500 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300"
                    >
                      Annuleren
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
                    >
                      Opslaan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
