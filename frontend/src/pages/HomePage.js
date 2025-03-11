// frontend/src/pages/HomePage.js
import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaTicketAlt, FaProjectDiagram, FaUsersCog, FaChartLine, FaComments, FaMobileAlt } from 'react-icons/fa';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

const HomePage = () => {
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    // Inisialisasi AOS untuk animasi scroll
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: false,
    });
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow">
        {/* Hero Section with Parallax Effect */}
        <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-r from-primary-700 to-primary-900 text-white">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 right-10 w-64 h-64 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-10 left-20 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute top-40 left-40 w-80 h-80 bg-secondary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="flex flex-col md:flex-row items-center"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div 
                className="md:w-1/2 md:pr-8 mb-8 md:mb-0"
                variants={fadeInUp}
              >
                <motion.h1 
                  className="text-4xl md:text-6xl font-bold mb-4 leading-tight"
                  variants={fadeInUp}
                >
                  Manajemen Tugas & Pelacakan Isu
                </motion.h1>
                <motion.p 
                  className="text-xl mb-8 opacity-90 leading-relaxed"
                  variants={fadeInUp}
                >
                  Platform manajemen tugas dan pelacakan isu yang memudahkan kolaborasi tim
                  dalam pengelolaan proyek, bug, dan permintaan fitur.
                </motion.p>

                <motion.div variants={fadeInUp}>
                  {isAuthenticated ? (
                    <Link 
                      to="/dashboard" 
                      className="btn btn-primary inline-block text-lg px-8 py-3 rounded-lg shadow-lg bg-white text-primary-600 hover:bg-gray-100 transform hover:scale-105 transition duration-300"
                    >
                      Menuju Dashboard
                    </Link>
                  ) : (
                    <div className="flex flex-wrap gap-4">
                      <Link 
                        to="/register" 
                        className="btn btn-primary text-lg px-8 py-3 rounded-lg shadow-lg bg-white text-primary-600 hover:bg-gray-100 transform hover:scale-105 transition duration-300"
                      >
                        Mulai Sekarang
                      </Link>
                      <Link 
                        to="/login" 
                        className="btn btn-outline-primary text-lg px-8 py-3 rounded-lg bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 transform hover:scale-105 transition duration-300"
                      >
                        Login
                      </Link>
                    </div>
                  )}
                </motion.div>
              </motion.div>
              <motion.div 
                className="md:w-1/2"
                variants={fadeInUp}
                whileHover={{ 
                  scale: 1.03,
                  transition: { duration: 0.3 }
                }}
              >
                
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Animated Counter Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center" data-aos="fade-up">
              <div className="p-4">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2 counter" data-aos="zoom-in" data-aos-delay="100">10K+</div>
                <p className="text-gray-600">Pengguna Aktif</p>
              </div>
              <div className="p-4">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2 counter" data-aos="zoom-in" data-aos-delay="200">5M+</div>
                <p className="text-gray-600">Tiket Diselesaikan</p>
              </div>
              <div className="p-4">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2 counter" data-aos="zoom-in" data-aos-delay="300">1K+</div>
                <p className="text-gray-600">Tim Menggunakan</p>
              </div>
              <div className="p-4">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2 counter" data-aos="zoom-in" data-aos-delay="400">99%</div>
                <p className="text-gray-600">Kepuasan Pelanggan</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section with Animation */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4" data-aos="fade-up">Fitur Utama</h2>
            <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
              Solusi komprehensif untuk kebutuhan manajemen proyek dan pelacakan isu Anda
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2" data-aos="fade-up" data-aos-delay="100">
                <div className="flex justify-center mb-6">
                  <div className="bg-primary-100 text-primary-600 p-4 rounded-full">
                    <FaTicketAlt size={30} className="animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-center mb-4">Manajemen Tiket</h3>
                <p className="text-gray-600 text-center">
                  Buat, tetapkan, dan lacak tiket untuk bug, fitur baru, dan permintaan perubahan
                  dengan mudah dan efisien.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2" data-aos="fade-up" data-aos-delay="200">
                <div className="flex justify-center mb-6">
                  <div className="bg-primary-100 text-primary-600 p-4 rounded-full">
                    <FaProjectDiagram size={30} className="animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-center mb-4">Manajemen Proyek</h3>
                <p className="text-gray-600 text-center">
                  Kelola berbagai proyek, tetapkan tim, dan pantau kemajuan dengan tampilan
                  yang intuitif dan informatif.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2" data-aos="fade-up" data-aos-delay="300">
                <div className="flex justify-center mb-6">
                  <div className="bg-primary-100 text-primary-600 p-4 rounded-full">
                    <FaUsersCog size={30} className="animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-center mb-4">Kolaborasi Tim</h3>
                <p className="text-gray-600 text-center">
                  Kerjasama tim yang efektif dengan fungsionalitas komentar, atribusi tugas,
                  dan notifikasi real-time.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="bg-white rounded-xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2" data-aos="fade-up" data-aos-delay="400">
                <div className="flex justify-center mb-6">
                  <div className="bg-primary-100 text-primary-600 p-4 rounded-full">
                    <FaChartLine size={30} className="animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-center mb-4">Analisis & Laporan</h3>
                <p className="text-gray-600 text-center">
                  Dapatkan wawasan mendalam melalui dasbor analitik dan laporan yang komprehensif 
                  untuk pengambilan keputusan yang lebih baik.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2" data-aos="fade-up" data-aos-delay="500">
                <div className="flex justify-center mb-6">
                  <div className="bg-primary-100 text-primary-600 p-4 rounded-full">
                    <FaComments size={30} className="animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-center mb-4">Umpan Balik Cepat</h3>
                <p className="text-gray-600 text-center">
                  Tingkatkan komunikasi dengan sistem umpan balik terintegrasi yang memastikan 
                  semua pemangku kepentingan tetap terinformasi.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2" data-aos="fade-up" data-aos-delay="600">
                <div className="flex justify-center mb-6">
                  <div className="bg-primary-100 text-primary-600 p-4 rounded-full">
                    <FaMobileAlt size={30} className="animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-center mb-4">Akses Mobile</h3>
                <p className="text-gray-600 text-center">
                  Kelola proyek dan tiket Anda di mana saja dengan aplikasi mobile responsif 
                  yang mudah digunakan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="container mx-auto px-4 text-center" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Siap untuk meningkatkan produktivitas tim Anda?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Bergabunglah dengan ribuan tim lainnya yang telah mentransformasi cara mereka mengelola proyek dan tiket.
            </p>
            <Link 
              to="/register" 
              className="btn inline-block text-lg px-8 py-4 rounded-lg shadow-lg bg-white text-primary-600 hover:bg-gray-100 transform hover:scale-105 transition duration-300"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              Mulai Perjalanan Anda Sekarang
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;