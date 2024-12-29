import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import ComingSoon from "./pages/ComingSoon";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import WhatsAppButton from "./components/WhatsAppButton";

// Temporarily unused imports
// import Home from "./pages/Home";
// import Umrah from "./pages/Umrah";
// import AboutUs from "./pages/Aboutus";
// import UmrahPackage from "./pages/UmrahPackage";
// import Services from "./pages/Services";
// import ServiceDetails from "./pages/ServiceDetails";

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          {/* Essential routes that should remain accessible */}
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Coming soon page */}
          <Route path="/coming-soon" element={<ComingSoon />} />
          
          {/* Redirect all other routes to coming-soon */}
          <Route path="*" element={<Navigate to="/coming-soon" replace />} />
        </Routes>
        <WhatsAppButton />
      </Router>
    </HelmetProvider>
  );
}

export default App;
