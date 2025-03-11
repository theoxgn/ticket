// frontend/src/pages/tickets/TicketFormPage.js
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { TicketContext } from '../../context/TicketContext';
import { ProjectContext } from '../../context/ProjectContext';
import { AuthContext } from '../../context/AuthContext';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const TicketFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { projects, getProjects } = useContext(ProjectContext);
  const { 
    currentTicket, 
    loading, 
    getTicket, 
    addTicket, 
    editTicket, 
    clearCurrentTicket 
  } = useContext(TicketContext);
  const [initialValues, setInitialValues] = useState({
    title: '',
    description: '',
    type: 'task',
    priority: 'medium',
    status: 'open',
    projectId: '',
    assigneeId: ''
  });
  const [projectMembers, setProjectMembers] = useState([]);
  const isEditMode = !!id;

  useEffect(() => {
    getProjects();
    
    if (isEditMode) {
      getTicket(id);
    } else {
      clearCurrentTicket();
      // If navigated from project detail with state
      if (location.state?.projectId) {
        setInitialValues(prev => ({
          ...prev,
          projectId: location.state.projectId
        }));
      }
    }
  }, [id]);

  useEffect(() => {
    if (isEditMode && currentTicket) {
      setInitialValues({
        title: currentTicket.title || '',
        description: currentTicket.description || '',
        type: currentTicket.type || 'task',
        priority: currentTicket.priority || 'medium',
        status: currentTicket.status || 'open',
        projectId: currentTicket.projectId || '',
        assigneeId: currentTicket.assigneeId || ''
      });
    }
  }, [currentTicket, isEditMode]);

  // Update available assignees when project changes
  useEffect(() => {
    if (initialValues.projectId && projects.length > 0) {
      const selectedProject = projects.find(p => p.id === parseInt(initialValues.projectId));
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
      .min(3, 'Minimal 3 karakter')
      .max(150, 'Maksimal 150 karakter'),
    description: Yup.string(),
    type: Yup.string().required('Tipe tiket wajib diisi'),
    priority: Yup.string().required('Prioritas tiket wajib diisi'),
    status: Yup.string().required('Status tiket wajib diisi'),
    projectId: Yup.string().required('Proyek wajib dipilih'),
    assigneeId: Yup.string()
  });

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
        <Link to="/tickets" className="text-primary-600 hover:text-primary-700 flex items-center">
          <FaArrowLeft className="mr-2" /> Kembali ke Daftar Tiket
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-secondary-800 mb-6">
            {isEditMode ? 'Edit Tiket' : 'Buat Tiket Baru'}
          </h1>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="title" className="form-label">
                    Judul Tiket
                  </label>
                  <Field
                    type="text"
                    id="title"
                    name="title"
                    className="form-input"
                    placeholder="Masukkan judul tiket"
                  />
                  <ErrorMessage name="title" component="div" className="form-error" />
                </div>

                <div>
                  <label htmlFor="projectId" className="form-label">
                    Proyek
                  </label>
                  <Field
                    as="select"
                    id="projectId"
                    name="projectId"
                    className="form-input"
                    onChange={(e) => {
                      setFieldValue('projectId', e.target.value);
                      // Reset assignee when project changes
                      setFieldValue('assigneeId', '');
                    }}
                  >
                    <option value="">Pilih Proyek</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="projectId" component="div" className="form-error" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="type" className="form-label">
                      Tipe
                    </label>
                    <Field
                      as="select"
                      id="type"
                      name="type"
                      className="form-input"
                    >
                      <option value="bug">Bug</option>
                      <option value="feature">Fitur</option>
                      <option value="improvement">Perbaikan</option>
                      <option value="task">Tugas</option>
                    </Field>
                    <ErrorMessage name="type" component="div" className="form-error" />
                  </div>

                  <div>
                    <label htmlFor="priority" className="form-label">
                      Prioritas
                    </label>
                    <Field
                      as="select"
                      id="priority"
                      name="priority"
                      className="form-input"
                    >
                      <option value="lowest">Terendah</option>
                      <option value="low">Rendah</option>
                      <option value="medium">Sedang</option>
                      <option value="high">Tinggi</option>
                      <option value="highest">Tertinggi</option>
                    </Field>
                    <ErrorMessage name="priority" component="div" className="form-error" />
                  </div>
                </div>

                {isEditMode && (
                  <div>
                    <label htmlFor="status" className="form-label">
                      Status
                    </label>
                    <Field
                      as="select"
                      id="status"
                      name="status"
                      className="form-input"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="code_review">Code Review</option>
                      <option value="testing">Testing</option>
                      <option value="closed">Closed</option>
                    </Field>
                    <ErrorMessage name="status" component="div" className="form-error" />
                  </div>
                )}

                <div>
                  <label htmlFor="assigneeId" className="form-label">
                    Ditugaskan Kepada
                  </label>
                  <Field
                    as="select"
                    id="assigneeId"
                    name="assigneeId"
                    className="form-input"
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
                    <p className="text-sm text-secondary-500 mt-1">
                      Pilih proyek terlebih dahulu untuk melihat daftar anggota tim
                    </p>
                  )}
                  <ErrorMessage name="assigneeId" component="div" className="form-error" />
                </div>

                <div>
                  <label htmlFor="description" className="form-label">
                    Deskripsi
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    className="form-input min-h-[150px]"
                    placeholder="Masukkan deskripsi tiket"
                  />
                  <ErrorMessage name="description" component="div" className="form-error" />
                </div>

                <div className="flex justify-end space-x-3">
                  <Link
                    to="/tickets"
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

export default TicketFormPage;