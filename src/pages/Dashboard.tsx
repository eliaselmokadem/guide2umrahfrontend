import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

interface Package {
  _id: string;
  name: string;
  date: string;
  description: string;
  price: number;
  photoPaths: string[];
}

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  photoPaths: string[];
}

const Dashboard: React.FC = () => {
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [packageData, setPackageData] = useState({
    name: "",
    date: "",
    description: "",
    price: "",
    photos: [] as File[],
  });
  const [serviceData, setServiceData] = useState({
    name: "",
    description: "",
    price: "",
    photos: [] as File[],
  });
  const [packages, setPackages] = useState<Package[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [editPackageId, setEditPackageId] = useState<string | null>(null);
  const [editServiceId, setEditServiceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPackageData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleServiceInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setServiceData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePackageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPackageData((prevData) => ({ ...prevData, photos: [...prevData.photos, ...files] }));
  };

  const handleServiceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setServiceData((prevData) => ({ ...prevData, photos: [...prevData.photos, ...files] }));
  };

  const handleRemovePackagePhoto = (index: number) => {
    setPackageData((prevData) => ({
      ...prevData,
      photos: prevData.photos.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveServicePhoto = (index: number) => {
    setServiceData((prevData) => ({
      ...prevData,
      photos: prevData.photos.filter((_, i) => i !== index),
    }));
  };

  const handlePackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", packageData.name);
    formData.append("date", packageData.date);
    formData.append("description", packageData.description);
    formData.append("price", packageData.price);
    packageData.photos.forEach((photo, index) => {
      formData.append(`photos`, photo);
    });

    try {
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
        throw new Error("Error saving package");
      }

      alert(
        editPackageId
          ? "Package updated successfully!"
          : "Package added successfully!"
      );

      setShowPackageModal(false);
      setPackageData({
        name: "",
        date: "",
        description: "",
        price: "",
        photos: [],
      });
      setEditPackageId(null);

      const updatedPackages = await fetch(
        `${process.env.REACT_APP_API_URL}/api/packages`
      ).then((res) => res.json());
      setPackages(updatedPackages);
    } catch (err) {
      console.error("Error saving package:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", serviceData.name);
    formData.append("description", serviceData.description);
    formData.append("price", serviceData.price);
    serviceData.photos.forEach((photo, index) => {
      formData.append(`photos`, photo);
    });

    try {
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
        price: "",
        photos: [],
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
      date: pkg.date,
      description: pkg.description,
      price: pkg.price.toString(),
      photos: [],
    });
    setShowPackageModal(true);
  };

  const handleEditService = (service: Service) => {
    setEditServiceId(service._id);
    setServiceData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      photos: [],
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
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Welkom op het Dashboard
          </h2>

          <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Uitloggen
          </button>

          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Packages Section */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-700">
                Beheer Pakketten
              </h3>
              <button
                onClick={() => setShowPackageModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Nieuw Pakket Toevoegen
              </button>
            </div>

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
                        {pkg.photoPaths.map((path, index) => (
                          <img
                            key={index}
                            src={path}
                            alt={`${pkg.name} ${index + 1}`}
                            className="w-full h-40 object-cover rounded"
                          />
                        ))}
                      </div>
                      <h4 className="text-xl font-bold mt-4">{pkg.name}</h4>
                      <p className="text-gray-500">{pkg.description}</p>
                      <p className="text-gray-700 mt-2">Prijs: €{pkg.price}</p>
                      <p className="text-gray-500 mt-1">Datum: {pkg.date}</p>
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
          </div>

          {/* Services Section */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-700">
                Beheer Services
              </h3>
              <div className="space-x-4">
                <button
                  onClick={() => setShowServiceModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Nieuwe Service Toevoegen
                </button>
                
              </div>
            </div>

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
                      <p className="text-gray-700 mt-2">Prijs: €{service.price}</p>
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
          </div>

          {/* Package Modal */}
          {showPackageModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
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
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Datum
                    </label>
                    <input
                      id="date"
                      name="date"
                      type="date"
                      value={packageData.date}
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
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Prijs
                    </label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={packageData.price}
                      onChange={handlePackageInputChange}
                      required
                      className="w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="photo"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Foto's Uploaden
                    </label>
                    <input
                      id="photo"
                      name="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePackageFileChange}
                      multiple
                      className="w-full px-4 py-2 mt-1"
                    />
                    {packageData.photos.length > 0 && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {packageData.photos.map((photo, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(photo)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemovePackagePhoto(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
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
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
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
                      htmlFor="servicePrice"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Prijs
                    </label>
                    <input
                      id="servicePrice"
                      name="price"
                      type="number"
                      step="0.01"
                      value={serviceData.price}
                      onChange={handleServiceInputChange}
                      required
                      className="w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
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
