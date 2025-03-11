// frontend/src/components/layout/Footer.js
import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-secondary-800 text-white py-4 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {year} Ticket Tracker. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;