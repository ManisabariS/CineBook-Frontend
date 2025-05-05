import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaHome, FaCalendarAlt, FaFilm, FaTicketAlt, FaChartBar, FaCog } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaTicketAlt className="text-blue-400 text-2xl" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
              CineBook
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <NavLink to="/" icon={<FaHome />} text="Home" />
              <NavLink to="/theater-schedule" icon={<FaFilm />} text="Theaters" />
              <NavLink to="/calendar" icon={<FaCalendarAlt />} text="Calendar" />
              {user && (
                <NavLink to="/booking-management" icon={<FaTicketAlt />} text="My Bookings" />
              )}
              {user?.role === 'admin' && (
                <>
                  <NavLink to="/admin" icon={<FaCog />} text="Admin" />
                  <NavLink to="/admin-dashboard" icon={<FaChartBar />} text="Reports" />
                </>
              )}
            </div>

            <div className="ml-4 flex items-center space-x-2">
              {user ? (
                <>
                  <div className="flex items-center space-x-2">
                    <span className="hidden lg:inline-flex items-center text-sm">
                      <FaUser className="mr-1 text-blue-300" /> {user.name}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/profile')}
                      className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-500 rounded-full transition-colors"
                    >
                      Profile
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="px-3 py-1 text-sm bg-red-600 hover:bg-red-500 rounded-full transition-colors"
                    >
                      <FaSignOutAlt className="inline mr-1" /> Logout
                    </motion.button>
                  </div>
                </>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/login')}
                    className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-500 rounded-full transition-colors"
                  >
                    <FaSignInAlt className="inline mr-1" /> Login
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/register')}
                    className="px-3 py-1 text-sm bg-green-600 hover:bg-green-500 rounded-full transition-colors"
                  >
                    <FaUserPlus className="inline mr-1" /> Register
                  </motion.button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800">
          <MobileNavLink to="/" icon={<FaHome />} text="Home" onClick={() => setIsMobileMenuOpen(false)} />
          <MobileNavLink to="/theater-schedule" icon={<FaFilm />} text="Theaters" onClick={() => setIsMobileMenuOpen(false)} />
          <MobileNavLink to="/calendar" icon={<FaCalendarAlt />} text="Calendar" onClick={() => setIsMobileMenuOpen(false)} />
          {user && (
            <MobileNavLink to="/booking-management" icon={<FaTicketAlt />} text="My Bookings" onClick={() => setIsMobileMenuOpen(false)} />
          )}
          {user?.role === 'admin' && (
            <>
              <MobileNavLink to="/admin" icon={<FaCog />} text="Admin" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileNavLink to="/admin-dashboard" icon={<FaChartBar />} text="Reports" onClick={() => setIsMobileMenuOpen(false)} />
            </>
          )}

          <div className="pt-4 border-t border-gray-700">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center px-3 py-2 text-sm font-medium text-blue-300">
                  <FaUser className="mr-2" /> {user.name}
                </div>
                <button
                  onClick={() => {
                    navigate('/profile');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 rounded-md"
                >
                  <FaUser className="mr-2" /> Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 rounded-md"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    navigate('/login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 rounded-md"
                >
                  <FaSignInAlt className="mr-2" /> Login
                </button>
                <button
                  onClick={() => {
                    navigate('/register');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 rounded-md"
                >
                  <FaUserPlus className="mr-2" /> Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// Reusable NavLink component for desktop
const NavLink = ({ to, icon, text }) => (
  <Link
    to={to}
    className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-700 transition-colors"
  >
    <span className="mr-1">{icon}</span>
    {text}
  </Link>
);

// Reusable MobileNavLink component
const MobileNavLink = ({ to, icon, text, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 rounded-md"
  >
    <span className="mr-2">{icon}</span>
    {text}
  </Link>
);

export default Navbar;