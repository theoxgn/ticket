// frontend/src/pages/users/UserProfilePage.js
import React, { useContext, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { FaSave, FaUserEdit } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { updateUser } from '../../services/userService';

const UserProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <p className="text-secondary-600 mb-4">Silahkan login untuk melihat profil Anda</p>
      </div>
    );
  }

  const initialValues = {
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    username: user.username || '',
    email: user.email || '',
  };

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required('Nama depan wajib diisi'),
    lastName: Yup.string()
      .required('Nama belakang wajib diisi'),
    username: Yup.string()
      .required('Username wajib diisi')
      .min(3, 'Username minimal 3 karakter'),
    email: Yup.string()
      .required('Email wajib diisi')
      .email('Format email tidak valid'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      await updateUser(user.id, values);
      toast.success('Profil berhasil diperbarui. Silahkan login kembali untuk melihat perubahan.');
      
      // Logout after profile update to refresh user data
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memperbarui profil');
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-secondary-800">Profil Anda</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 text-center">
              <div className="h-24 w-24 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-3xl font-medium mx-auto mb-4">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
              <h2 className="text-xl font-semibold text-secondary-800">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-secondary-500 mb-3">@{user.username}</p>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full inline-block
                ${user.role === 'admin' ? 'bg-danger-100 text-danger-800' :
                  user.role === 'manager' ? 'bg-primary-100 text-primary-800' :
                  user.role === 'developer' ? 'bg-success-100 text-success-800' :
                  'bg-secondary-100 text-secondary-800'}`}
              >
                {user.role === 'admin' ? 'Admin' :
                  user.role === 'manager' ? 'Manager' :
                  user.role === 'developer' ? 'Developer' :
                  'User'}
              </span>
            </div>
            <div className="bg-secondary-50 px-6 py-4 border-t border-secondary-200">
              <div className="text-sm text-secondary-500">
                <p>Akun dibuat pada:</p>
                <p className="font-medium text-secondary-700">
                  {new Date(user.createdAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-secondary-200">
              <h3 className="text-lg font-semibold text-secondary-800 flex items-center">
                <FaUserEdit className="mr-2 text-primary-600" /> Edit Profil
              </h3>
            </div>
            <div className="p-6">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="form-label">
                          Nama Depan
                        </label>
                        <Field
                          type="text"
                          id="firstName"
                          name="firstName"
                          className="form-input"
                        />
                        <ErrorMessage name="firstName" component="div" className="form-error" />
                      </div>

                      <div>
                        <label htmlFor="lastName" className="form-label">
                          Nama Belakang
                        </label>
                        <Field
                          type="text"
                          id="lastName"
                          name="lastName"
                          className="form-input"
                        />
                        <ErrorMessage name="lastName" component="div" className="form-error" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="username" className="form-label">
                        Username
                      </label>
                      <Field
                        type="text"
                        id="username"
                        name="username"
                        className="form-input"
                      />
                      <ErrorMessage name="username" component="div" className="form-error" />
                    </div>

                    <div>
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <Field
                        type="email"
                        id="email"
                        name="email"
                        className="form-input"
                      />
                      <ErrorMessage name="email" component="div" className="form-error" />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="btn btn-primary flex items-center"
                        disabled={isSubmitting || loading}
                      >
                        <FaSave className="mr-2" />
                        {isSubmitting || loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;