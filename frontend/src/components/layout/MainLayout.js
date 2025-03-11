// frontend/src/components/layout/MainLayout.js
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { FaBars, FaTimes } from 'react-icons/fa';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary-50">
      <Header />
      
      <div className="flex flex-grow">
        {/* Sidebar for desktop */}
        <div className="hidden md:block w-64 flex-shrink-0 transition-all duration-300">
          <Sidebar />
        </div>

        {/* Sidebar for mobile */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-secondary-800 bg-opacity-75 transition-opacity duration-300"
              onClick={toggleSidebar}
            ></div>
            
            {/* Sidebar */}
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition-transform duration-300 ease-in-out">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={toggleSidebar}
                >
                  <span className="sr-only">Close sidebar</span>
                  <FaTimes className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="h-full overflow-y-auto">
                <Sidebar />
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden">
          {/* Mobile sidebar toggle */}
          <div className="md:hidden p-4 flex items-center">
            <button
              className="text-secondary-700 hover:text-secondary-900 focus:outline-none p-2 rounded-md hover:bg-secondary-200 transition-all"
              onClick={toggleSidebar}
            >
              <FaBars className="h-6 w-6" />
            </button>
            <div className="ml-4 text-lg font-medium text-secondary-800">
              Ticket Tracker
            </div>
          </div>

          <div className="p-4 md:p-6">
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default MainLayout;