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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-sky-50">
      <Header />

      <main className="flex-grow">
        {/* Hero Section with Soft Blue Gradients */}
        <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-r from-blue-600 to-sky-500 text-white">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 right-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-10 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute top-40 left-40 w-80 h-80 bg-sky-300 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="flex flex-col md:flex-row items-center justify-between"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div 
                className="md:w-1/2 lg:w-5/12 md:pr-12 mb-12 md:mb-0"
                variants={fadeInUp}
              >
                <motion.h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                  variants={fadeInUp}
                >
                  Manajemen Tugas & Pelacakan Isu
                </motion.h1>
                <motion.p 
                  className="text-xl mb-10 opacity-90 leading-relaxed"
                  variants={fadeInUp}
                >
                  Platform manajemen tugas dan pelacakan isu yang memudahkan kolaborasi tim
                  dalam pengelolaan proyek, bug, dan permintaan fitur.
                </motion.p>

                <motion.div variants={fadeInUp} className="flex flex-wrap gap-5">
                  {isAuthenticated ? (
                    <Link 
                      to="/dashboard" 
                      className="btn btn-primary inline-block text-lg px-8 py-3 rounded-lg shadow-lg bg-white text-blue-600 hover:bg-blue-50 transform hover:scale-105 transition duration-300"
                    >
                      Menuju Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link 
                        to="/register" 
                        className="btn btn-primary text-lg px-8 py-3 rounded-lg shadow-lg bg-white text-blue-600 hover:bg-blue-50 transform hover:scale-105 transition duration-300"
                      >
                        Mulai Sekarang
                      </Link>
                      <Link 
                        to="/login" 
                        className="btn btn-outline-primary text-lg px-8 py-3 rounded-lg bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 transform hover:scale-105 transition duration-300"
                      >
                        Login
                      </Link>
                    </>
                  )}
                </motion.div>
              </motion.div>
              <motion.div 
                className="md:w-1/2 lg:w-6/12"
                variants={fadeInUp}
                whileHover={{ 
                  scale: 1.03,
                  transition: { duration: 0.3 }
                }}
              >
                {/* Dashboard Preview Illustration */}
                <div className="w-full h-72 md:h-96 bg-gradient-to-br from-blue-100 to-sky-50 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-300 opacity-20"></div>
                  <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-3/4 h-1/2 bg-white rounded-lg shadow-md opacity-90"></div>
                  <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-2/3 h-8 bg-blue-100 rounded-md"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-2/3 h-16 bg-blue-50 rounded-md"></div>
                  <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-2/3 h-8 bg-blue-100 rounded-md"></div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Animated Counter Section with Soft Blue Cards */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center" data-aos="fade-up">
              <div className="p-6 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl shadow-md text-blue-700 transform transition-all hover:shadow-lg hover:scale-105">
                <div className="text-3xl md:text-4xl font-bold mb-2 counter" data-aos="zoom-in" data-aos-delay="100">10K+</div>
                <p className="text-blue-600">Pengguna Aktif</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-sky-100 to-blue-50 rounded-2xl shadow-md text-blue-700 transform transition-all hover:shadow-lg hover:scale-105">
                <div className="text-3xl md:text-4xl font-bold mb-2 counter" data-aos="zoom-in" data-aos-delay="200">5M+</div>
                <p className="text-blue-600">Tiket Diselesaikan</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-blue-100 to-sky-50 rounded-2xl shadow-md text-blue-700 transform transition-all hover:shadow-lg hover:scale-105">
                <div className="text-3xl md:text-4xl font-bold mb-2 counter" data-aos="zoom-in" data-aos-delay="300">1K+</div>
                <p className="text-blue-600">Tim Menggunakan</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-sky-100 to-blue-50 rounded-2xl shadow-md text-blue-700 transform transition-all hover:shadow-lg hover:scale-105">
                <div className="text-3xl md:text-4xl font-bold mb-2 counter" data-aos="zoom-in" data-aos-delay="400">99%</div>
                <p className="text-blue-600">Kepuasan Pelanggan</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section with Improved Layout */}
        <section className="py-20 bg-gradient-to-b from-white to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-6 text-blue-700" data-aos="fade-up">Fitur Utama</h2>
              <p className="text-xl text-gray-600" data-aos="fade-up" data-aos-delay="100">
                Solusi komprehensif untuk kebutuhan manajemen proyek dan pelacakan isu Anda
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-xl shadow-md p-8 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-2 border border-blue-50" data-aos="fade-up" data-aos-delay="100">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-sky-400 text-white p-5 rounded-full">
                    <FaTicketAlt size={30} className="animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-center mb-4 text-blue-700">Manajemen Tiket</h3>
                <p className="text-gray-600 text-center">
                  Buat, tetapkan, dan lacak tiket untuk bug, fitur baru, dan permintaan perubahan
                  dengan mudah dan efisien.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-2 border border-blue-50" data-aos="fade-up" data-aos-delay="200">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-sky-400 text-white p-5 rounded-full">
                    <FaProjectDiagram size={30} className="animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-center mb-4 text-blue-700">Manajemen Proyek</h3>
                <p className="text-gray-600 text-center">
                  Kelola berbagai proyek, tetapkan tim, dan pantau kemajuan dengan tampilan
                  yang intuitif dan informatif.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-2 border border-blue-50" data-aos="fade-up" data-aos-delay="300">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-sky-400 text-white p-5 rounded-full">
                    <FaUsersCog size={30} className="animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-center mb-4 text-blue-700">Kolaborasi Tim</h3>
                <p className="text-gray-600 text-center">
                  Kerjasama tim yang efektif dengan fungsionalitas komentar, atribusi tugas,
                  dan notifikasi real-time.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-2 border border-blue-50" data-aos="fade-up" data-aos-delay="400">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-sky-400 text-white p-5 rounded-full">
                    <FaChartLine size={30} className="animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-center mb-4 text-blue-700">Analisis & Laporan</h3>
                <p className="text-gray-600 text-center">
                  Dapatkan wawasan mendalam melalui dasbor analitik dan laporan yang komprehensif 
                  untuk pengambilan keputusan yang lebih baik.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-2 border border-blue-50" data-aos="fade-up" data-aos-delay="500">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-sky-400 text-white p-5 rounded-full">
                    <FaComments size={30} className="animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-center mb-4 text-blue-700">Umpan Balik Cepat</h3>
                <p className="text-gray-600 text-center">
                  Tingkatkan komunikasi dengan sistem umpan balik terintegrasi yang memastikan 
                  semua pemangku kepentingan tetap terinformasi.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-2 border border-blue-50" data-aos="fade-up" data-aos-delay="600">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-sky-400 text-white p-5 rounded-full">
                    <FaMobileAlt size={30} className="animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-center mb-4 text-blue-700">Akses Mobile</h3>
                <p className="text-gray-600 text-center">
                  Kelola proyek dan tiket Anda di mana saja dengan aplikasi mobile responsif 
                  yang mudah digunakan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section (New) */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-blue-700" data-aos="fade-up">Apa Kata Pengguna Kami</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-aos="fade-up">
                <div className="bg-blue-50 p-6 rounded-xl shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl mr-4">
                      PT
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800">PT Maju Bersama</h4>
                      <p className="text-blue-600 text-sm">Perusahaan Teknologi</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"Platform ini telah membantu tim kami meningkatkan produktivitas dan komunikasi secara signifikan. Pelacakan tiket yang mudah dan intuitif."</p>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-xl shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl mr-4">
                      CV
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800">CV Digital Solusi</h4>
                      <p className="text-blue-600 text-sm">Agensi Digital</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"Sistem manajemen proyek yang komprehensif dengan antarmuka yang bersih. Memudahkan kami melacak perkembangan dan berkomunikasi dengan klien."</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section with Soft Blue Gradient */}
        <section className="py-16 bg-gradient-to-r from-blue-500 to-sky-400 text-white">
          <div className="container mx-auto px-4 text-center" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Siap untuk meningkatkan produktivitas tim Anda?</h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto">
              Bergabunglah dengan ribuan tim lainnya yang telah mentransformasi cara mereka mengelola proyek dan tiket.
            </p>
            <Link 
              to="/register" 
              className="btn inline-block text-lg px-8 py-4 rounded-lg shadow-lg bg-white text-blue-600 hover:bg-blue-50 transform hover:scale-105 transition duration-300"
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