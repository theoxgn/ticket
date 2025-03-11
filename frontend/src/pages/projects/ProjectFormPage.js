// frontend/src/pages/projects/ProjectFormPage.js
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { ProjectContext } from '../../context/ProjectContext';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const ProjectFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProject, loading, getProject, addProject, editProject, clearCurrentProject } = useContext(ProjectContext);
  const [initialValues, setInitialValues] = useState({
    name: '',
    key: '',
    description: '',
    isActive: true
  });
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      getProject(id);
    } else {
      clearCurrentProject();
    }
  }, [id]);

  useEffect(() => {
    if (isEditMode && currentProject) {
      setInitialValues({
        name: currentProject.name || '',
        key: currentProject.key || '',
        description: currentProject.description || '',
        isActive: currentProject.isActive !== undefined ? currentProject.isActive : true
      });
    }
  }, [currentProject, isEditMode]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Nama proyek wajib diisi')
      .min(2, 'Minimal 2 karakter')
      .max(100, 'Maksimal 100 karakter'),
    key: Yup.string()
      .required('Kode proyek wajib diisi')
      .min(2, 'Minimal 2 karakter')
      .max(10, 'Maksimal 10 karakter')
      .matches(/^[A-Za-z0-9]+$/, 'Hanya karakter alfanumerik tanpa spasi'),
    description: Yup.string(),
    isActive: Yup.boolean()
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEditMode) {
        await editProject(id, values);
        toast.success('Proyek berhasil diperbarui');
      } else {
        const newProject = await addProject(values);
        toast.success('Proyek berhasil dibuat');
        navigate(`/projects/${newProject.id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  };

  if (isEditMode && loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link to="/projects" className="text-primary-600 hover:text-primary-700 flex items-center">
          <FaArrowLeft className="mr-2" /> Kembali ke Daftar Proyek
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-secondary-800 mb-6">
            {isEditMode ? 'Edit Proyek' : 'Buat Proyek Baru'}
          </h1>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, values }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="name" className="form-label">
                    Nama Proyek
                  </label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    placeholder="Masukkan nama proyek"
                  />
                  <ErrorMessage name="name" component="div" className="form-error" />
                </div>

                <div>
                  <label htmlFor="key" className="form-label">
                    Kode Proyek
                  </label>
                  <Field
                    type="text"
                    id="key"
                    name="key"
                    className="form-input uppercase"
                    placeholder="Contoh: PROJ, TRK, DEV"
                    disabled={isEditMode} // Kode proyek tidak dapat diubah pada mode edit
                    maxLength={10}
                  />
                  {isEditMode && (
                    <p className="text-sm text-secondary-500 mt-1">
                      Kode proyek tidak dapat diubah setelah dibuat.
                    </p>
                  )}
                  <ErrorMessage name="key" component="div" className="form-error" />
                </div>

                <div>
                  <label htmlFor="description" className="form-label">
                    Deskripsi
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    className="form-input min-h-[120px]"
                    placeholder="Masukkan deskripsi proyek"
                  />
                  <ErrorMessage name="description" component="div" className="form-error" />
                </div>

                {isEditMode && (
                  <div>
                    <label className="flex items-center cursor-pointer">
                      <Field
                        type="checkbox"
                        name="isActive"
                        className="h-4 w-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                      />
                      <span className="ml-2 text-secondary-700">
                        Proyek aktif
                      </span>
                    </label>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <Link
                    to="/projects"
                    className="btn btn-secondary"
                  >
                    Batal
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary flex items-center"
                    disabled={isSubmitting}
                  >
                    <FaSave className="mr-2" />
                    {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ProjectFormPage;