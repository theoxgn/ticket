// frontend/src/pages/auth/LoginPage.js
import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { FaUser, FaLock } from 'react-icons/fa';
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
    <div className="flex flex-col min-h-screen bg-secondary-50">
      <Header />

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-center text-primary-700 mb-6">Login</h2>
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
                  <div className="mb-4">
                    <label 
                      htmlFor="email" 
                      className="form-label flex items-center"
                    >
                      <FaUser className="mr-2 text-primary-600" />
                      Email
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className="form-input"
                      placeholder="Masukkan email Anda"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="form-error"
                    />
                  </div>

                  <div className="mb-6">
                    <label 
                      htmlFor="password" 
                      className="form-label flex items-center"
                    >
                      <FaLock className="mr-2 text-primary-600" />
                      Password
                    </label>
                    <Field
                      type="password"
                      name="password"
                      className="form-input"
                      placeholder="Masukkan password Anda"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="form-error"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Memproses...
                      </span>
                    ) : 'Login'}
                  </button>
                </Form>
              )}
            </Formik>

            <div className="mt-4 text-center">
              <p className="text-secondary-600">
                Belum punya akun?{' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-700">
                  Daftar di sini
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;