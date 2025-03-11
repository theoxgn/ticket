// frontend/src/components/layout/MainLayout.js
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { FaBars } from 'react-icons/fa';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary-50">
      <Header />
      
      <div className="flex flex-grow">
        {/* Sidebar for desktop */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <Sidebar />
        </div>

        {/* Sidebar for mobile */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            {/* Sidebar */}
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="h-full overflow-y-auto">
                <Sidebar />
              </div>
            </div>
            
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-secondary-800 bg-opacity-75"
              onClick={toggleSidebar}
            ></div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden">
          {/* Mobile sidebar toggle */}
          <div className="md:hidden p-4">
            <button
              className="text-secondary-700 hover:text-secondary-900 focus:outline-none"
              onClick={toggleSidebar}
            >
              <FaBars className="h-6 w-6" />
            </button>
          </div>

          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default MainLayout;