import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logotransparent.png";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`bg-gradient-to-b from-black/40 to-transparent backdrop-blur-[0px] text-black sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'from-black/60 backdrop-blur-[px] shadow-md py-0' : 'py-1'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link to="/" className="flex-shrink-0">
            <img 
              src={logo} 
              className={`h-[40px] sm:h-[50px] md:h-[60px] transition-all duration-300 ${
                scrolled ? 'scale-95' : 'scale-100'
              }`} 
              alt="Guide2Umrah Logo" 
            />
          </Link>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop menu */}
          <ul className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <li>
              <Link to="/" className="px-2 py-2 text-base lg:text-lg hover:text-green-500 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/umrah" className="px-2 py-2 text-base lg:text-lg hover:text-green-500 transition-colors">
                Umrah
              </Link>
            </li>
            <li>
              <Link to="/aboutus" className="px-2 py-2 text-base lg:text-lg hover:text-green-500 transition-colors">
                Over ons
              </Link>
            </li>
            <li>
              <Link to="/login">
                <button className="ml-2 bg-green-500 px-4 lg:px-6 py-2 rounded-lg text-black font-bold hover:bg-green-600 active:bg-green-700 transition-all duration-200">
                  Login
                </button>
              </Link>
            </li>
          </ul>
        </div>

        {/* Mobile menu */}
        <div
          className={`${
            isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          } md:hidden overflow-hidden transition-all duration-300 ease-in-out`}
        >
          <ul className="flex flex-col space-y-2 pb-3 bg-gradient-to-b from-black/40 to-transparent w-screen -mx-3 px-3">
            <li>
              <Link
                to="/"
                className="block px-3 py-2 text-base text-white hover:text-green-500 transition-colors rounded-lg hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/umrah"
                className="block px-3 py-2 text-base text-white hover:text-green-500 transition-colors rounded-lg hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                Umrah
              </Link>
            </li>
            <li>
              <Link
                to="/aboutus"
                className="block px-3 py-2 text-base text-white hover:text-green-500 transition-colors rounded-lg hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                Over ons
              </Link>
            </li>
            <li className="px-3 pt-1">
              <Link
                to="/login"
                className="block"
                onClick={() => setIsOpen(false)}
              >
                <button className="w-full bg-green-500 px-4 py-2 rounded-lg text-black font-bold hover:bg-green-600 active:bg-green-700 transition-all duration-200">
                  Login
                </button>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
