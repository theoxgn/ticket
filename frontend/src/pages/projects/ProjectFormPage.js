// frontend/src/pages/projects/ProjectFormPage.js
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { ProjectContext } from '../../context/ProjectContext';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

// Tambahkan inline styles
const styles = {
  formContainer: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    marginBottom: '2rem'
  },
  formTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '1.5rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #e2e8f0'
  },
  formGroup: {
    marginBottom: '1.5rem'
  },
  formLabel: {
    display: 'block',
    fontWeight: '500',
    marginBottom: '0.5rem',
    color: '#4a5568'
  },
  formInput: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.375rem',
    border: '1px solid #cbd5e0',
    backgroundColor: '#fff',
    color: '#2d3748',
    transition: 'border-color 0.2s, box-shadow 0.2s'
  },
  formTextarea: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.375rem',
    border: '1px solid #cbd5e0',
    backgroundColor: '#fff',
    color: '#2d3748',
    minHeight: '120px',
    resize: 'vertical',
    transition: 'border-color 0.2s, box-shadow 0.2s'
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    marginTop: '2rem'
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.625rem 1.25rem',
    backgroundColor: '#3182ce',
    color: 'white',
    borderRadius: '0.375rem',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  btnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.625rem 1.25rem',
    backgroundColor: '#e2e8f0',
    color: '#4a5568',
    borderRadius: '0.375rem',
    fontWeight: '500',
    border: '1px solid #cbd5e0',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  formError: {
    color: '#e53e3e',
    fontSize: '0.875rem',
    marginTop: '0.5rem'
  },
  uppercaseInput: {
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '500'
  },
  helpText: {
    fontSize: '0.875rem',
    color: '#718096',
    marginTop: '0.5rem'
  },
  backLink: {
    display: 'flex',
    alignItems: 'center',
    color: '#3182ce',
    fontWeight: '500',
    marginBottom: '1rem',
    textDecoration: 'none'
  },
  backIcon: {
    marginRight: '0.5rem'
  },
  requiredField: {
    position: 'relative'
  },
  requiredFieldLabel: {
    display: 'inline-block'
  },
  requiredFieldIndicator: {
    color: '#e53e3e',
    marginLeft: '0.25rem'
  }
};

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
    // Transform key to uppercase before submitting
    const formattedValues = {
      ...values,
      key: values.key.toUpperCase()
    };
    
    try {
      if (isEditMode) {
        await editProject(id, formattedValues);
        toast.success('Proyek berhasil diperbarui');
      } else {
        const newProject = await addProject(formattedValues);
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

  // Custom error component
  const ErrorMessageComponent = ({ name }) => (
    <ErrorMessage 
      name={name} 
      render={msg => <div style={styles.formError}>{msg}</div>}
    />
  );

  return (
    <div>
      <Link to="/projects" style={styles.backLink}>
        <FaArrowLeft style={styles.backIcon} /> Kembali ke Daftar Proyek
      </Link>

      <div style={styles.formContainer}>
        <h1 style={styles.formTitle}>
          {isEditMode ? 'Edit Proyek' : 'Buat Proyek Baru'}
        </h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, values, handleChange, setFieldValue }) => (
            <Form>
              <div style={styles.formGroup}>
                <div style={styles.requiredField}>
                  <label htmlFor="name" style={styles.formLabel}>
                    <span style={styles.requiredFieldLabel}>Nama Proyek</span>
                    <span style={styles.requiredFieldIndicator}>*</span>
                  </label>
                </div>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  style={styles.formInput}
                  placeholder="Masukkan nama proyek"
                />
                <ErrorMessageComponent name="name" />
              </div>

              <div style={styles.formGroup}>
                <div style={styles.requiredField}>
                  <label htmlFor="key" style={styles.formLabel}>
                    <span style={styles.requiredFieldLabel}>Kode Proyek</span>
                    <span style={styles.requiredFieldIndicator}>*</span>
                  </label>
                </div>
                <Field
                  type="text"
                  id="key"
                  name="key"
                  style={{...styles.formInput, ...styles.uppercaseInput}}
                  placeholder="CONTOH: PROJ, TRK, DEV"
                  disabled={isEditMode}
                  maxLength={10}
                  onChange={(e) => {
                    // Convert to uppercase on change
                    e.target.value = e.target.value.toUpperCase();
                    handleChange(e);
                  }}
                />
                {isEditMode && (
                  <p style={styles.helpText}>
                    Kode proyek tidak dapat diubah setelah dibuat.
                  </p>
                )}
                <ErrorMessageComponent name="key" />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="description" style={styles.formLabel}>
                  Deskripsi
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  style={styles.formTextarea}
                  placeholder="Masukkan deskripsi proyek"
                />
                <ErrorMessageComponent name="description" />
              </div>

              {isEditMode && (
                <div style={styles.formGroup}>
                  <label style={{...styles.formLabel, display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                    <Field
                      type="checkbox"
                      name="isActive"
                      style={{marginRight: '0.5rem'}}
                    />
                    <span>Proyek aktif</span>
                  </label>
                </div>
              )}

              <div style={styles.formActions}>
                <Link
                  to="/projects"
                  style={styles.btnSecondary}
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  style={styles.btnPrimary}
                  disabled={isSubmitting}
                >
                  <FaSave style={{marginRight: '0.5rem'}} />
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ProjectFormPage;