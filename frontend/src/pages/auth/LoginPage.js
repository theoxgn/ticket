// frontend/src/pages/auth/LoginPage.js
import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const LoginPage = () => {
  const { login, isAuthenticated, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if logged in
    if (isAuthenticated) {
      navigate('/dashboard');
    }

    // Show error toast if login fails
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [isAuthenticated, error, navigate, clearError]);

  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Email tidak valid')
      .required('Email wajib diisi'),
    password: Yup.string()
      .required('Password wajib diisi')
  });

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-secondary-50 to-secondary-100">
      <Header />

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md transition-all duration-300 hover:scale-[1.01]">
          <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="inline-block p-3 rounded-full bg-primary-100 mb-4">
                <FaSignInAlt className="text-primary-600 text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-primary-700">Masuk ke Akun Anda</h2>
              <p className="text-gray-500 mt-2">Silakan masuk untuk melanjutkan</p>
            </div>
            
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  await login(values);
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
                  <div className="mb-5">
                    <label 
                      htmlFor="email" 
                      className="block text-gray-700 font-medium mb-2 flex items-center"
                    >
                      <FaUser className="mr-2 text-primary-600" />
                      Email
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors outline-none"
                      placeholder="Masukkan email Anda"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="mt-1 text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <label 
                        htmlFor="password" 
                        className="text-gray-700 font-medium flex items-center"
                      >
                        <FaLock className="mr-2 text-primary-600" />
                        Password
                      </label>
                      
                    </div>
                    <Field
                      type="password"
                      name="password"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors outline-none"
                      placeholder="Masukkan password Anda"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="mt-1 text-red-500 text-sm"
                    />
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
                        Memproses...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <FaSignInAlt className="mr-2" />
                        Masuk
                      </span>
                    )}
                  </button>
                </Form>
              )}
            </Formik>

            <div className="mt-6 text-center">
              <div className="text-gray-600">
                Belum punya akun?{' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-800 font-medium hover:underline">
                  Daftar di sini
                </Link>
              </div>
            </div>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;