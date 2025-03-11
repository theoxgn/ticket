// frontend/src/components/layout/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaEnvelope, FaTicketAlt, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-secondary-800 text-white py-4 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start mb-2">
            <FaTicketAlt className="text-primary-400 mr-2" />
            <span className="font-bold text-lg">Ticket Tracker</span>
          </div>
          <p className="text-sm text-secondary-400">
            &copy; {year} Ticket Tracker. All rights reserved.
          </p>
        </div>
        <p className="text-sm">
        <p>Made with <FaHeart className="inline text-red-500 mx-1" /> by theoxgn</p>
        </p>
      </div>
    </footer>
  );
};

export default Footer;