// frontend/src/components/layout/Sidebar.js
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  FaTachometerAlt, 
  FaClipboardList, 
  FaProjectDiagram, 
  FaUsers, 
  FaUserCircle 
} from 'react-icons/fa';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path 
      ? 'bg-primary-100 text-primary-700 border-r-4 border-primary-500'
      : 'text-secondary-700 hover:bg-secondary-100';
  };

  return (
    <div className="h-full bg-white border-r border-secondary-200 overflow-y-auto">
      <div className="p-4">
        <Link
          to="/dashboard"
          className={`flex items-center p-3 rounded-md mb-2 ${isActive('/dashboard')}`}
        >
          <FaTachometerAlt className="mr-3" />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/projects"
          className={`flex items-center p-3 rounded-md mb-2 ${isActive('/projects')}`}
        >
          <FaProjectDiagram className="mr-3" />
          <span>Projects</span>
        </Link>
        <Link
          to="/tickets"
          className={`flex items-center p-3 rounded-md mb-2 ${isActive('/tickets')}`}
        >
          <FaClipboardList className="mr-3" />
          <span>Tickets</span>
        </Link>
        {user && ['admin', 'manager'].includes(user.role) && (
          <Link
            to="/users"
            className={`flex items-center p-3 rounded-md mb-2 ${isActive('/users')}`}
          >
            <FaUsers className="mr-3" />
            <span>Users</span>
          </Link>
        )}
        <Link
          to="/profile"
          className={`flex items-center p-3 rounded-md mb-2 ${isActive('/profile')}`}
        >
          <FaUserCircle className="mr-3" />
          <span>My Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;