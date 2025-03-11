// frontend/src/components/layout/Header.js
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaTicketAlt, FaBars, FaSignOutAlt, FaUser, FaTimes } from 'react-icons/fa';

const Header = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <nav className="bg-primary-700 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-white font-bold text-xl"
          >
            <FaTicketAlt />
            <span>Ticket Tracker</span>
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className="text-white focus:outline-none"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-3 py-2 rounded-md hover:bg-primary-600 transition-all"
                >
                  Dashboard
                </Link>
                <Link
                  to="/projects"
                  className="px-3 py-2 rounded-md hover:bg-primary-600 transition-all"
                >
                  Projects
                </Link>
                <Link
                  to="/tickets"
                  className="px-3 py-2 rounded-md hover:bg-primary-600 transition-all"
                >
                  Tickets
                </Link>
                {user && ['admin', 'manager'].includes(user.role) && (
                  <Link
                    to="/users"
                    className="px-3 py-2 rounded-md hover:bg-primary-600 transition-all"
                  >
                    Users
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative ml-3">
                  <button
                    className="flex items-center text-sm rounded-full focus:outline-none"
                    onClick={toggleProfileMenu}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="flex items-center px-3 py-2 rounded-md hover:bg-primary-600 transition-all">
                      <FaUser className="mr-2" />
                      <span>{user && `${user.firstName} ${user.lastName}`}</span>
                    </div>
                  </button>

                  {isProfileMenuOpen && (
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                    >
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                        >
                          Your Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                        >
                          <FaSignOutAlt className="inline mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md hover:bg-primary-600 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="ml-2 px-3 py-2 bg-white text-primary-700 rounded-md hover:bg-secondary-100 transition-all"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden pb-3 px-4">
          {isAuthenticated ? (
            <div className="flex flex-col space-y-2">
              <Link
                to="/dashboard"
                className="px-3 py-2 rounded-md hover:bg-primary-600 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/projects"
                className="px-3 py-2 rounded-md hover:bg-primary-600 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Projects
              </Link>
              <Link
                to="/tickets"
                className="px-3 py-2 rounded-md hover:bg-primary-600 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Tickets
              </Link>
              {user && ['admin', 'manager'].includes(user.role) && (
                <Link
                  to="/users"
                  className="px-3 py-2 rounded-md hover:bg-primary-600 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Users
                </Link>
              )}
              <Link
                to="/profile"
                className="px-3 py-2 rounded-md hover:bg-primary-600 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center px-3 py-2 rounded-md hover:bg-primary-600 transition-all text-white"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <Link
                to="/login"
                className="px-3 py-2 rounded-md hover:bg-primary-600 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-2 bg-white text-primary-700 rounded-md hover:bg-secondary-100 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;