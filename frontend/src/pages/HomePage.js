// frontend/src/pages/HomePage.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaTicketAlt, FaProjectDiagram, FaUsersCog } from 'react-icons/fa';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const HomePage = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Manajemen Tugas & Pelacakan Isu
                </h1>
                <p className="text-xl mb-6 opacity-90">
                  Platform manajemen tugas dan pelacakan isu yang memudahkan kolaborasi tim
                  dalam pengelolaan proyek, bug, dan permintaan fitur.
                </p>

                {isAuthenticated ? (
                  <Link 
                    to="/dashboard" 
                    className="btn btn-primary inline-block"
                  >
                    Menuju Dashboard
                  </Link>
                ) : (
                  <div className="flex flex-wrap gap-4">
                    <Link 
                      to="/register" 
                      className="btn btn-primary"
                    >
                      Mulai Sekarang
                    </Link>
                    <Link 
                      to="/login" 
                      className="btn btn-outline-primary bg-transparent border border-white text-white hover:bg-white hover:text-primary-600"
                    >
                      Login
                    </Link>
                  </div>
                )}
              </div>
              <div className="md:w-1/2">
                <img 
                  src="/api/placeholder/600/400" 
                  alt="Ticket Tracker" 
                  className="rounded-lg shadow-xl w-full" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Fitur Utama</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-6 transition-transform hover:scale-105">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary-100 text-primary-600 p-3 rounded-full">
                    <FaTicketAlt size={24} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">Manajemen Tiket</h3>
                <p className="text-secondary-600 text-center">
                  Buat, tetapkan, dan lacak tiket untuk bug, fitur baru, dan permintaan perubahan
                  dengan mudah.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 transition-transform hover:scale-105">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary-100 text-primary-600 p-3 rounded-full">
                    <FaProjectDiagram size={24} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">Manajemen Proyek</h3>
                <p className="text-secondary-600 text-center">
                  Kelola berbagai proyek, tetapkan tim, dan pantau kemajuan dengan tampilan
                  yang intuitif.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 transition-transform hover:scale-105">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary-100 text-primary-600 p-3 rounded-full">
                    <FaUsersCog size={24} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">Kolaborasi Tim</h3>
                <p className="text-secondary-600 text-center">
                  Kerjasama tim yang efektif dengan fungsionalitas komentar, atribusi tugas,
                  dan notifikasi.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;