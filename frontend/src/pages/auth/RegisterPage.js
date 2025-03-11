// frontend/src/pages/auth/RegisterPage.js
import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaIdCard } from 'react-icons/fa';
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
    <div className="flex flex-col min-h-screen bg-secondary-50">
      <Header />

      <main className="flex-grow flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-lg">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-center text-primary-700 mb-6">Daftar Akun</h2>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label 
                        htmlFor="firstName" 
                        className="form-label flex items-center"
                      >
                        <FaIdCard className="mr-2 text-primary-600" />
                        Nama Depan
                      </label>
                      <Field
                        type="text"
                        name="firstName"
                        className="form-input"
                        placeholder="Masukkan nama depan"
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="form-error"
                      />
                    </div>

                    <div>
                      <label 
                        htmlFor="lastName" 
                        className="form-label flex items-center"
                      >
                        <FaIdCard className="mr-2 text-primary-600" />
                        Nama Belakang
                      </label>
                      <Field
                        type="text"
                        name="lastName"
                        className="form-input"
                        placeholder="Masukkan nama belakang"
                      />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="form-error"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label 
                      htmlFor="username" 
                      className="form-label flex items-center"
                    >
                      <FaUser className="mr-2 text-primary-600" />
                      Username
                    </label>
                    <Field
                      type="text"
                      name="username"
                      className="form-input"
                      placeholder="Pilih username"
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="form-error"
                    />
                  </div>

                  <div className="mb-4">
                    <label 
                      htmlFor="email" 
                      className="form-label flex items-center"
                    >
                      <FaEnvelope className="mr-2 text-primary-600" />
                      Email
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className="form-input"
                      placeholder="Masukkan email"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="form-error"
                    />
                  </div>

                  <div className="mb-4">
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
                      placeholder="Buat password"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="form-error"
                    />
                  </div>

                  <div className="mb-6">
                    <label 
                      htmlFor="confirmPassword" 
                      className="form-label flex items-center"
                    >
                      <FaLock className="mr-2 text-primary-600" />
                      Konfirmasi Password
                    </label>
                    <Field
                      type="password"
                      name="confirmPassword"
                      className="form-input"
                      placeholder="Konfirmasi password"
                    />
                    <ErrorMessage
                      name="confirmPassword"
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
                        Mendaftar...
                      </span>
                    ) : 'Daftar'}
                  </button>

                  <div className="mt-4 text-center">
                    <p className="text-secondary-600">
                      Sudah punya akun?{' '}
                      <Link to="/login" className="text-primary-600 hover:text-primary-700">
                        Login di sini
                      </Link>
                    </p>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterPage;