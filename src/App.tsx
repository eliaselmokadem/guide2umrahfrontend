import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import WhatsAppButton from "./components/WhatsAppButton";
import Contact from "./pages/Contact";

// Main imports
import Home from "./pages/Home";
import Umrah from "./pages/Umrah";
import AboutUs from "./pages/Aboutus"; // Fix: import AboutUs from correct path
import UmrahPackage from "./pages/UmrahPackage";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import CustomPackage from "./pages/CustomPackage";

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          {/* Essential routes */}
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Main routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/umrah" element={<Umrah />} /> 
          <Route path="/umrah-package/:packageId" element={<UmrahPackage />} /> 
          <Route path="/services" element={<Services />} />
          <Route path="/services/:serviceId" element={<ServiceDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/custom-package" element={<CustomPackage />} /> 
          
          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <WhatsAppButton />
        <ToastContainer />
      </Router>
    </HelmetProvider>
  );
}

export default App;
