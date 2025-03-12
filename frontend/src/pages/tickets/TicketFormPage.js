// frontend/src/pages/tickets/TicketFormPage.js
import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { TicketContext } from '../../context/TicketContext';
import { ProjectContext } from '../../context/ProjectContext';
import { UserContext } from '../../context/UserContext';
import { AuthContext } from '../../context/AuthContext';
import { FaSave, FaArrowLeft, FaUpload, FaVideo, FaImage, FaTimesCircle } from 'react-icons/fa';

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
  formSelect: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.375rem',
    border: '1px solid #cbd5e0',
    backgroundColor: '#fff',
    color: '#2d3748',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234a5568'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.75rem center',
    backgroundSize: '1.5em 1.5em',
    paddingRight: '2.5rem'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem'
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
  },
  fileUploadContainer: {
    marginBottom: '1.5rem',
    border: '2px dashed #cbd5e0',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    textAlign: 'center',
    transition: 'all 0.2s',
    backgroundColor: '#f7fafc'
  },
  fileUploadContainerActive: {
    borderColor: '#3182ce',
    backgroundColor: '#ebf8ff'
  },
  fileUploadInput: {
    display: 'none'
  },
  fileUploadButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem 1rem',
    backgroundColor: '#3182ce',
    color: 'white',
    borderRadius: '0.375rem',
    fontWeight: '500',
    margin: '1rem 0',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  previewContainer: {
    marginTop: '1rem',
    position: 'relative',
    display: 'inline-block'
  },
  previewImage: {
    maxWidth: '200px',
    maxHeight: '200px',
    borderRadius: '0.25rem',
    border: '1px solid #e2e8f0'
  },
  removeButton: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '50%',
    padding: '0.25rem',
    cursor: 'pointer',
    color: '#e53e3e'
  },
  videoLinkPreview: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem',
    backgroundColor: '#f7fafc',
    borderRadius: '0.375rem',
    marginTop: '0.5rem'
  },
  videoLinkIcon: {
    marginRight: '0.5rem',
    color: '#3182ce'
  }
};

const TicketFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const { user } = useContext(AuthContext);
  const { projects, getProjects } = useContext(ProjectContext);
  const { users, getUsers } = useContext(UserContext);
  const { currentTicket, loading, getTicket, addTicket, editTicket, clearCurrentTicket } = useContext(TicketContext);
  
  const [projectMembers, setProjectMembers] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [initialValues, setInitialValues] = useState({
    title: '',
    description: '',
    projectId: location.state?.projectId || '',
    type: 'task',
    priority: 'medium',
    assigneeId: '',
    photoUrl: '',
    videoLink: ''
  });
  
  const isEditMode = !!id;

  // Fetch projects and users on component mount
  useEffect(() => {
    getProjects();
    getUsers();
    
    if (isEditMode) {
      getTicket(id);
    } else {
      clearCurrentTicket();
    }
  }, []);

  // Set initial values from currentTicket when editing
  useEffect(() => {
    if (isEditMode && currentTicket) {
      setInitialValues({
        title: currentTicket.title || '',
        description: currentTicket.description || '',
        projectId: currentTicket.projectId || '',
        type: currentTicket.type || 'task',
        priority: currentTicket.priority || 'medium',
        assigneeId: currentTicket.assigneeId || '',
        photoUrl: currentTicket.photoUrl || '',
        videoLink: currentTicket.videoLink || ''
      });

      // Set photo preview if exists
      if (currentTicket.photoUrl) {
        setPhotoPreview(currentTicket.photoUrl);
      }
    }
  }, [currentTicket, isEditMode]);

  // Filter project members when project changes
  useEffect(() => {
    if (initialValues.projectId) {
      const selectedProject = projects.find(p => p.id === initialValues.projectId);
      if (selectedProject && selectedProject.members) {
        setProjectMembers(selectedProject.members);
      } else {
        setProjectMembers([]);
      }
    } else {
      setProjectMembers([]);
    }
  }, [initialValues.projectId, projects]);

  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Judul tiket wajib diisi')
      .min(2, 'Minimal 2 karakter')
      .max(100, 'Maksimal 100 karakter'),
    projectId: Yup.string()
      .required('Proyek wajib dipilih'),
    type: Yup.string()
      .required('Tipe tugas wajib dipilih'),
    priority: Yup.string()
      .required('Prioritas wajib dipilih'),
    description: Yup.string(),
    assigneeId: Yup.string(),
    videoLink: Yup.string()
      .url('Masukkan URL yang valid')
      .nullable()
  });

  const handlePhotoUpload = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      toast.error('File harus berupa gambar');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
      setFieldValue('photoUrl', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e, setFieldValue) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
      toast.error('File harus berupa gambar');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
      setFieldValue('photoUrl', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (setFieldValue) => {
    setPhotoPreview(null);
    setFieldValue('photoUrl', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEditMode) {
        await editTicket(id, values);
        toast.success('Tiket berhasil diperbarui');
        navigate(`/tickets/${id}`);
      } else {
        const newTicket = await addTicket(values);
        toast.success('Tiket berhasil dibuat');
        navigate(`/tickets/${newTicket.id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
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
      <Link to="/tickets" style={styles.backLink}>
        <FaArrowLeft style={styles.backIcon} /> Kembali ke Daftar Tiket
      </Link>

      <div style={styles.formContainer}>
        <h1 style={styles.formTitle}>
          {isEditMode ? 'Edit Tiket' : 'Buat Tiket Baru'}
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
                  <label htmlFor="title" style={styles.formLabel}>
                    <span style={styles.requiredFieldLabel}>Judul Tiket</span>
                    <span style={styles.requiredFieldIndicator}>*</span>
                  </label>
                </div>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  style={styles.formInput}
                  placeholder="Masukkan judul tiket"
                />
                <ErrorMessageComponent name="title" />
              </div>

              <div style={styles.formGroup}>
                <div style={styles.requiredField}>
                  <label htmlFor="projectId" style={styles.formLabel}>
                    <span style={styles.requiredFieldLabel}>Proyek</span>
                    <span style={styles.requiredFieldIndicator}>*</span>
                  </label>
                </div>
                <Field
                  as="select"
                  id="projectId"
                  name="projectId"
                  style={styles.formSelect}
                  onChange={(e) => {
                    setFieldValue('projectId', e.target.value);
                    setFieldValue('assigneeId', ''); // Reset assignee when project changes
                  }}
                  disabled={isEditMode} // Project cannot be changed in edit mode
                >
                  <option value="">Pilih Proyek</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </Field>
                {isEditMode && (
                  <p style={styles.helpText}>
                    Proyek tidak dapat diubah setelah tiket dibuat.
                  </p>
                )}
                <ErrorMessageComponent name="projectId" />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <div style={styles.requiredField}>
                    <label htmlFor="type" style={styles.formLabel}>
                      <span style={styles.requiredFieldLabel}>Tipe Tugas</span>
                      <span style={styles.requiredFieldIndicator}>*</span>
                    </label>
                  </div>
                  <Field
                    as="select"
                    id="type"
                    name="type"
                    style={styles.formSelect}
                  >
                    <option value="task">Tugas</option>
                    <option value="bug">Bug</option>
                    <option value="feature">Fitur</option>
                    <option value="improvement">Peningkatan</option>
                  </Field>
                  <ErrorMessageComponent name="type" />
                </div>

                <div style={styles.formGroup}>
                  <div style={styles.requiredField}>
                    <label htmlFor="priority" style={styles.formLabel}>
                      <span style={styles.requiredFieldLabel}>Prioritas</span>
                      <span style={styles.requiredFieldIndicator}>*</span>
                    </label>
                  </div>
                  <Field
                    as="select"
                    id="priority"
                    name="priority"
                    style={styles.formSelect}
                  >
                    <option value="lowest">Sangat Rendah</option>
                    <option value="low">Rendah</option>
                    <option value="medium">Sedang</option>
                    <option value="high">Tinggi</option>
                    <option value="highest">Sangat Tinggi</option>
                  </Field>
                  <ErrorMessageComponent name="priority" />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="assigneeId" style={styles.formLabel}>
                  Ditugaskan Kepada
                </label>
                <Field
                  as="select"
                  id="assigneeId"
                  name="assigneeId"
                  style={styles.formSelect}
                  disabled={!values.projectId}
                >
                  <option value="">Pilih anggota tim</option>
                  {projectMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.firstName} {member.lastName}
                    </option>
                  ))}
                </Field>
                {!values.projectId && (
                  <p style={styles.helpText}>
                    Pilih proyek terlebih dahulu untuk melihat daftar anggota tim
                  </p>
                )}
                <ErrorMessageComponent name="assigneeId" />
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
                  placeholder="Masukkan deskripsi tiket"
                />
                <ErrorMessageComponent name="description" />
              </div>

              {/* Photo Upload Section */}
              <div 
                style={{
                  ...styles.fileUploadContainer,
                  ...(isDragging ? styles.fileUploadContainerActive : {})
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, setFieldValue)}
              >
                <label htmlFor="photoUpload" style={styles.formLabel}>
                  <FaImage style={{ marginRight: '0.5rem', display: 'inline' }} />
                  Upload Foto
                </label>

                <p style={styles.helpText}>
                  Seret dan lepas foto di sini, atau
                </p>

                <label htmlFor="photoUpload" style={styles.fileUploadButton}>
                  <FaUpload style={{ marginRight: '0.5rem' }} />
                  Pilih File
                </label>

                <input
                  type="file"
                  id="photoUpload"
                  style={styles.fileUploadInput}
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => handlePhotoUpload(e, setFieldValue)}
                />

                {photoPreview && (
                  <div style={styles.previewContainer}>
                    <img 
                      src={photoPreview} 
                      alt="Preview" 
                      style={styles.previewImage}
                    />
                    <div 
                      style={styles.removeButton}
                      onClick={() => removePhoto(setFieldValue)}
                    >
                      <FaTimesCircle />
                    </div>
                  </div>
                )}
              </div>

              {/* Video Link Section */}
              <div style={styles.formGroup}>
                <label htmlFor="videoLink" style={styles.formLabel}>
                  <FaVideo style={{ marginRight: '0.5rem', display: 'inline' }} />
                  Link Video (YouTube, Vimeo, dll)
                </label>
                <Field
                  type="url"
                  id="videoLink"
                  name="videoLink"
                  style={styles.formInput}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <ErrorMessageComponent name="videoLink" />
                
                {values.videoLink && (
                  <div style={styles.videoLinkPreview}>
                    <FaVideo style={styles.videoLinkIcon} />
                    <a 
                      href={values.videoLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 hover:underline"
                    >
                      {values.videoLink}
                    </a>
                  </div>
                )}
              </div>

              <div style={styles.formActions}>
                <Link
                  to="/tickets"
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

export default TicketFormPage;