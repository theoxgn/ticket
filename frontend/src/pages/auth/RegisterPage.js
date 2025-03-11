// frontend/src/pages/auth/RegisterPage.js
import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaUserPlus } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const RegisterPage = () => {
  const { register, isAuthenticated, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if logged in
    if (isAuthenticated) {
      navigate('/dashboard');
    }

    // Show error toast if registration fails
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [isAuthenticated, error, navigate, clearError]);

  // Validation schema
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required('Nama depan wajib diisi'),
    lastName: Yup.string()
      .required('Nama belakang wajib diisi'),
    username: Yup.string()
      .min(3, 'Username minimal 3 karakter')
      .required('Username wajib diisi'),
    email: Yup.string()
      .email('Email tidak valid')
      .required('Email wajib diisi'),
    password: Yup.string()
      .min(6, 'Password minimal 6 karakter')
      .required('Password wajib diisi'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Password harus sama')
      .required('Konfirmasi password wajib diisi')
  });

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-secondary-50 to-secondary-100">
      <Header />

      <main className="flex-grow flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-2xl transition-all duration-300 hover:scale-[1.01]">
          <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="inline-block p-3 rounded-full bg-primary-100 mb-4">
                <FaUserPlus className="text-primary-600 text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-primary-700">Buat Akun Baru</h2>
              <p className="text-gray-500 mt-2">Isi formulir di bawah untuk mendaftar</p>
            </div>
            
            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                username: '',
                email: '',
                password: '',
                confirmPassword: ''
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  // Remove confirmPassword before sending
                  const { confirmPassword, ...userData } = values;
                  await register(userData);
                  // Redirect happens in useEffect
                } catch (err) {
                  // Error handling in useEffect
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label 
                        htmlFor="firstName" 
                        className="block text-gray-700 font-medium mb-2 flex items-center"
                      >
                        <FaIdCard className="mr-2 text-primary-600" />
                        Nama Depan
                      </label>
                      <Field
                        type="text"
                        name="firstName"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors outline-none"
                        placeholder="Masukkan nama depan"
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="mt-1 text-red-500 text-sm"
                      />
                    </div>

                    <div>
                      <label 
                        htmlFor="lastName" 
                        className="block text-gray-700 font-medium mb-2 flex items-center"
                      >
                        <FaIdCard className="mr-2 text-primary-600" />
                        Nama Belakang
                      </label>
                      <Field
                        type="text"
                        name="lastName"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors outline-none"
                        placeholder="Masukkan nama belakang"
                      />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="mt-1 text-red-500 text-sm"
                      />
                    </div>
                  </div>

                  <div className="mb-5">
                    <label 
                      htmlFor="username" 
                      className="block text-gray-700 font-medium mb-2 flex items-center"
                    >
                      <FaUser className="mr-2 text-primary-600" />
                      Username
                    </label>
                    <Field
                      type="text"
                      name="username"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors outline-none"
                      placeholder="Pilih username"
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="mt-1 text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-5">
                    <label 
                      htmlFor="email" 
                      className="block text-gray-700 font-medium mb-2 flex items-center"
                    >
                      <FaEnvelope className="mr-2 text-primary-600" />
                      Email
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors outline-none"
                      placeholder="Masukkan email"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="mt-1 text-red-500 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    <div>
                      <label 
                        htmlFor="password" 
                        className="block text-gray-700 font-medium mb-2 flex items-center"
                      >
                        <FaLock className="mr-2 text-primary-600" />
                        Password
                      </label>
                      <Field
                        type="password"
                        name="password"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors outline-none"
                        placeholder="Buat password"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="mt-1 text-red-500 text-sm"
                      />
                    </div>

                    <div>
                      <label 
                        htmlFor="confirmPassword" 
                        className="block text-gray-700 font-medium mb-2 flex items-center"
                      >
                        <FaLock className="mr-2 text-primary-600" />
                        Konfirmasi Password
                      </label>
                      <Field
                        type="password"
                        name="confirmPassword"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors outline-none"
                        placeholder="Konfirmasi password"
                      />
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="mt-1 text-red-500 text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mendaftar...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <FaUserPlus className="mr-2" />
                        Daftar
                      </span>
                    )}
                  </button>

                  <div className="mt-6 text-center">
                    <p className="text-gray-600">
                      Sudah punya akun?{' '}
                      <Link to="/login" className="text-primary-600 hover:text-primary-800 font-medium hover:underline">
                        Login di sini
                      </Link>
                    </p>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>© 2025 Nama Aplikasi. Seluruh hak cipta dilindungi.</p>
            <p className="mt-1">Dengan mendaftar, Anda menyetujui <Link to="/terms" className="text-primary-600 hover:underline">Syarat & Ketentuan</Link> dan <Link to="/privacy" className="text-primary-600 hover:underline">Kebijakan Privasi</Link> kami.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterPage;