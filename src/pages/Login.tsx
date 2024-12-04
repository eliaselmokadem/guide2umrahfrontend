import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Logo from "../assets/logotransparent.png";

const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    const apiUrl = process.env.REACT_APP_API_URL;

    try {
      const response = await fetch(`${apiUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Ingelogd:", data.token);
        localStorage.setItem("token", data.token);
        setError(null);
        window.location.href = "/dashboard";
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Fout bij inloggen:", err);
      setError("Er is iets mis gegaan. Probeer het opnieuw.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6">
        <div className="w-full max-w-md space-y-6 bg-white shadow-lg rounded-xl p-6 sm:p-8">
          <div className="flex justify-center">
            <img 
              src={Logo} 
              alt="Guide2Umrah Logo" 
              className="w-auto h-20 sm:h-24 object-contain"
            />
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
            Dashboard Login
          </h2>
          
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                E-mailadres
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
                placeholder="naam@voorbeeld.nl"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Wachtwoord
              </label>
              <input
                id="password"
                type="password"
                required
                className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 text-base font-semibold text-white bg-green-500 rounded-lg shadow-sm hover:bg-green-600 active:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Inloggen
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
