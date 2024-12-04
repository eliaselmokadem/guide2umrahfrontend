import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Umrah from "./pages/Umrah";
import AboutUs from "./pages/Aboutus";
import UmrahPackage from "./pages/UmrahPackage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

//
function App() {
  return (
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
      </Routes>
    </Router>
  );
}

export default App;
