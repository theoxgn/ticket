// frontend/src/components/layout/Header.js
import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  FaTicketAlt, 
  FaBars, 
  FaSignOutAlt, 
  FaUser, 
  FaTimes, 
  FaBell, 
  FaSearch 
} from 'react-icons/fa';

const Header = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    // Close other menus when profile is opened
    if (!isProfileMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  // Check if the path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`${isScrolled ? 'bg-blue-700' : 'bg-gradient-to-r from-blue-600 to-sky-500'} text-white shadow-lg transition-all duration-300`}>
        <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-white font-bold text-xl group"
          >
            <div className="bg-white p-2 rounded-full text-primary-700 transform group-hover:rotate-12 transition-all duration-300">
              <FaTicketAlt />
            </div>
            <span className="group-hover:text-primary-200 transition-all">Ticket Tracker</span>
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
                  className={`px-3 py-2 rounded-md hover:bg-primary-600 transition-all ${
                    isActive('/dashboard') ? 'bg-primary-600 font-medium' : ''
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/projects"
                  className={`px-3 py-2 rounded-md hover:bg-primary-600 transition-all ${
                    isActive('/projects') ? 'bg-primary-600 font-medium' : ''
                  }`}
                >
                  Projects
                </Link>
                <Link
                  to="/tickets"
                  className={`px-3 py-2 rounded-md hover:bg-primary-600 transition-all ${
                    isActive('/tickets') ? 'bg-primary-600 font-medium' : ''
                  }`}
                >
                  Tickets
                </Link>
                {user && ['admin', 'manager'].includes(user.role) && (
                  <Link
                    to="/users"
                    className={`px-3 py-2 rounded-md hover:bg-primary-600 transition-all ${
                      isActive('/users') ? 'bg-primary-600 font-medium' : ''
                    }`}
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
                      <div className="h-8 w-8 rounded-full bg-primary-200 text-primary-800 flex items-center justify-center mr-2">
                        {user && user.firstName ? user.firstName.charAt(0) : <FaUser />}
                      </div>
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
                        <Link
                          to="/settings"
                          className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                        >
                          Settings
                        </Link>
                        <div className="border-t border-secondary-200"></div>
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
                  className="ml-2 px-4 py-2 bg-white text-primary-700 rounded-md hover:bg-secondary-100 transition-all font-medium shadow-sm hover:shadow"
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
        <div className="md:hidden pb-3 px-4 pt-2 border-t border-primary-600">
          {/* Mobile Search */}
          <div className="relative mb-3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-primary-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 rounded-full border-0 bg-primary-600 placeholder-primary-300 text-white focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Search..."
            />
          </div>
          
          {isAuthenticated ? (
            <div className="flex flex-col space-y-1">
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md hover:bg-primary-600 transition-all ${
                  isActive('/dashboard') ? 'bg-primary-600 font-medium' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/projects"
                className={`px-3 py-2 rounded-md hover:bg-primary-600 transition-all ${
                  isActive('/projects') ? 'bg-primary-600 font-medium' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Projects
              </Link>
              <Link
                to="/tickets"
                className={`px-3 py-2 rounded-md hover:bg-primary-600 transition-all ${
                  isActive('/tickets') ? 'bg-primary-600 font-medium' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Tickets
              </Link>
              {user && ['admin', 'manager'].includes(user.role) && (
                <Link
                  to="/users"
                  className={`px-3 py-2 rounded-md hover:bg-primary-600 transition-all ${
                    isActive('/users') ? 'bg-primary-600 font-medium' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Users
                </Link>
              )}
              <Link
                to="/profile"
                className={`px-3 py-2 rounded-md hover:bg-primary-600 transition-all ${
                  isActive('/profile') ? 'bg-primary-600 font-medium' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/settings"
                className={`px-3 py-2 rounded-md hover:bg-primary-600 transition-all ${
                  isActive('/settings') ? 'bg-primary-600 font-medium' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Settings
              </Link>
              <div className="border-t border-primary-600 my-2"></div>
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
                className="px-3 py-2 bg-white text-primary-700 rounded-md hover:bg-secondary-100 transition-all font-medium"
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