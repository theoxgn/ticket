// frontend/src/components/layout/Sidebar.js
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  FaTachometerAlt, 
  FaClipboardList, 
  FaProjectDiagram, 
  FaUsers, 
  FaUserCircle,
  FaCog,
  FaQuestionCircle,
  FaBell,
  FaStickyNote,
  FaInfoCircle
} from 'react-icons/fa';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Group navigation items
  const mainNavItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/projects', name: 'Projects', icon: <FaProjectDiagram /> },
    { path: '/tickets', name: 'Tickets', icon: <FaClipboardList /> },
  ];

  const adminNavItems = [
    { path: '/users', name: 'Users', icon: <FaUsers /> },
  ];

  const personalNavItems = [
    { path: '/profile', name: 'My Profile', icon: <FaUserCircle /> },
    // { path: '/settings', name: 'Settings', icon: <FaCog /> },
    // { path: '/notifications', name: 'Notifications', icon: <FaBell /> },
  ];

  const supportNavItems = [
    { path: '/help', name: 'Help & Support', icon: <FaQuestionCircle /> },
    { path: '/documentation', name: 'Documentation', icon: <FaStickyNote /> },
    { path: '/about', name: 'About', icon: <FaInfoCircle /> },
  ];

  const NavItem = ({ item }) => (
    <Link
      to={item.path}
      className={`flex items-center p-3 rounded-lg mb-1 transition-all duration-200 group ${
        isActive(item.path)
          ? 'bg-primary-100 text-primary-700 shadow-sm'
          : 'text-secondary-700 hover:bg-secondary-100'
      }`}
    >
      <div className={`mr-3 ${isActive(item.path) ? 'text-primary-600' : 'text-secondary-500 group-hover:text-primary-600'}`}>
        {item.icon}
      </div>
      <span className={isActive(item.path) ? 'font-medium' : ''}>{item.name}</span>
      {item.badge && (
        <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {item.badge}
        </span>
      )}
    </Link>
  );

  const NavSection = ({ title, items, condition = true }) => {
    if (!condition || !items.length) return null;
    
    return (
      <div className="mb-6">
        <h3 className="px-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-2">
          {title}
        </h3>
        <div>
          {items.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-white border-r border-secondary-200 shadow-md py-6">
      {/* User Profile Section */}
      <div className="px-4 mb-6">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-full bg-primary-200 text-primary-700 flex items-center justify-center mr-3 shadow-sm">
            {user && user.firstName ? user.firstName.charAt(0) : <FaUserCircle />}
          </div>
          <div>
            <div className="font-medium text-secondary-800">
              {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
            </div>
            <div className="text-xs text-secondary-500">
              {user && user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Not logged in'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="px-4">
        <NavSection title="Main Navigation" items={mainNavItems} />
        <NavSection 
          title="Administration" 
          items={adminNavItems} 
          condition={user && ['admin', 'manager'].includes(user.role)} 
        />
        <NavSection title="Personal" items={personalNavItems} condition={user} />
        {/* <NavSection title="Support" items={supportNavItems} /> */}
      </div>
    </div>
  );
};

export default Sidebar;