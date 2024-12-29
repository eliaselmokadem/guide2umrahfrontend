import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Home from "./pages/Home";
import Umrah from "./pages/Umrah";
import AboutUs from "./pages/Aboutus";
import UmrahPackage from "./pages/UmrahPackage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import WhatsAppButton from "./components/WhatsAppButton";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import ComingSoon from "./pages/ComingSoon";

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/umrah" element={<Umrah />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/aboutus" element={<AboutUs />}></Route>
          <Route path="/umrah/package/:packageId" element={<UmrahPackage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:serviceId" element={<ServiceDetails />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
        </Routes>
        <WhatsAppButton />
      </Router>
    </HelmetProvider>
  );
}

export default App;
