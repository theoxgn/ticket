// frontend/src/pages/tickets/TicketDetailsPage.js
import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { TicketContext } from '../../context/TicketContext';
import { AuthContext } from '../../context/AuthContext';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaTrash, 
  FaUser, 
  FaClock, 
  FaPaperclip,
  FaComment
} from 'react-icons/fa';

const TicketDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { 
    currentTicket, 
    loading, 
    getTicket, 
    editTicket,
    clearCurrentTicket, 
    addTicketComment,
    editComment,
    removeComment
  } = useContext(TicketContext);
  const [canEdit, setCanEdit] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);

  useEffect(() => {
    getTicket(id);

    return () => {
      clearCurrentTicket();
    };
  }, [id]);

  useEffect(() => {
    if (currentTicket && user) {
      // Check if user can edit this ticket
      const isCreator = currentTicket.reporterId === user.id;
      const isAssignee = currentTicket.assigneeId === user.id;
      const isAdmin = user.role === 'admin';
      
      setCanEdit(isCreator || isAssignee || isAdmin);
    }
  }, [currentTicket, user]);

  const handleStatusChange = async (newStatus) => {
    try {
      await editTicket(id, { status: newStatus });
      toast.success('Status tiket berhasil diperbarui');
    } catch (error) {
      toast.error('Gagal memperbarui status tiket');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus komentar ini?')) {
      try {
        await removeComment(commentId);
        toast.success('Komentar berhasil dihapus');
      } catch (error) {
        toast.error('Gagal menghapus komentar');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!currentTicket) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <p className="text-secondary-600 mb-4">Tiket tidak ditemukan.</p>
        <Link to="/tickets" className="btn btn-primary">
          Kembali ke Daftar Tiket
        </Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div>
      <div className="mb-4">
        <Link to="/tickets" className="text-primary-600 hover:text-primary-700 flex items-center">
          <FaArrowLeft className="mr-2" /> Kembali ke Daftar Tiket
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="border-b border-secondary-200 px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-secondary-800">
                  {currentTicket.ticketKey}: {currentTicket.title}
                </h1>
              </div>
              <div className="mt-1 flex flex-wrap gap-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full
                  ${currentTicket.status === 'open' ? 'bg-warning-100 text-warning-800' :
                    currentTicket.status === 'in_progress' ? 'bg-primary-100 text-primary-800' :
                    currentTicket.status === 'code_review' ? 'bg-info-100 text-info-800' :
                    currentTicket.status === 'testing' ? 'bg-success-100 text-success-800' :
                    'bg-secondary-100 text-secondary-800'}`}
                >
                  {currentTicket.status === 'open' ? 'Open' :
                    currentTicket.status === 'in_progress' ? 'In Progress' :
                    currentTicket.status === 'code_review' ? 'Code Review' :
                    currentTicket.status === 'testing' ? 'Testing' :
                    'Closed'}
                </span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full
                  ${currentTicket.priority === 'highest' ? 'bg-danger-100 text-danger-800' :
                    currentTicket.priority === 'high' ? 'bg-warning-100 text-warning-800' :
                    currentTicket.priority === 'medium' ? 'bg-primary-100 text-primary-800' :
                    currentTicket.priority === 'low' ? 'bg-success-100 text-success-800' :
                    'bg-info-100 text-info-800'}`}
                >
                  {currentTicket.priority === 'highest' ? 'Tertinggi' :
                    currentTicket.priority === 'high' ? 'Tinggi' :
                    currentTicket.priority === 'medium' ? 'Sedang' :
                    currentTicket.priority === 'low' ? 'Rendah' :
                    'Terendah'}
                </span>
                <span className="px-2 py-1 text-xs font-semibold bg-secondary-100 text-secondary-800 rounded-full">
                  {currentTicket.type === 'bug' ? 'Bug' :
                    currentTicket.type === 'feature' ? 'Fitur' :
                    currentTicket.type === 'improvement' ? 'Perbaikan' :
                    'Tugas'}
                </span>
                {currentTicket.project && (
                  <Link 
                    to={`/projects/${currentTicket.project.id}`}
                    className="px-2 py-1 text-xs font-semibold bg-primary-100 text-primary-800 rounded-full hover:bg-primary-200"
                  >
                    {currentTicket.project.name}
                  </Link>
                )}
              </div>
            </div>
            
            {canEdit && (
              <Link 
                to={`/tickets/${currentTicket.id}/edit`}
                className="btn btn-primary mt-3 md:mt-0 flex items-center"
              >
                <FaEdit className="mr-2" /> Edit Tiket
              </Link>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="mb-6">
                <h2 className="text-lg font-medium text-secondary-800 mb-2">Deskripsi</h2>
                <div className="prose max-w-none">
                  {currentTicket.description ? (
                    <p className="text-secondary-600 whitespace-pre-line">{currentTicket.description}</p>
                  ) : (
                    <p className="text-secondary-500 italic">Tidak ada deskripsi</p>
                  )}
                </div>
              </div>

              {/* Comments Section */}
              <div className="border-t border-secondary-200 pt-6">
                <h2 className="text-lg font-medium text-secondary-800 mb-4 flex items-center">
                  <FaComment className="mr-2 text-primary-600" /> 
                  Komentar
                </h2>

                {currentTicket.comments && currentTicket.comments.length > 0 ? (
                  <div className="space-y-4">
                    {currentTicket.comments.map(comment => (
                      <div key={comment.id} className="bg-secondary-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            <div className="h-10 w-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-medium">
                              {comment.user.firstName.charAt(0)}{comment.user.lastName.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="flex items-center">
                                <h4 className="font-medium text-secondary-800">
                                  {comment.user.firstName} {comment.user.lastName}
                                </h4>
                                <span className="ml-2 text-xs text-secondary-500">
                                  @{comment.user.username}
                                </span>
                              </div>
                              <p className="text-xs text-secondary-500">
                                <FaClock className="inline mr-1" /> {formatDate(comment.createdAt)}
                              </p>
                            </div>
                          </div>
                          
                          {user && comment.userId === user.id && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setEditingCommentId(comment.id)}
                                className="text-primary-600 hover:text-primary-700"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-danger-600 hover:text-danger-700"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          )}
                        </div>
                        
                        {editingCommentId === comment.id ? (
                          <div className="mt-3">
                            <Formik
                              initialValues={{ content: comment.content }}
                              validationSchema={Yup.object({
                                content: Yup.string().required('Komentar tidak boleh kosong')
                              })}
                              onSubmit={async (values, { setSubmitting }) => {
                                try {
                                  await editComment(comment.id, values);
                                  setEditingCommentId(null);
                                  toast.success('Komentar berhasil diperbarui');
                                } catch (error) {
                                  toast.error('Gagal memperbarui komentar');
                                } finally {
                                  setSubmitting(false);
                                }
                              }}
                            >
                              {({ isSubmitting }) => (
                                <Form>
                                  <Field
                                    as="textarea"
                                    name="content"
                                    className="form-input min-h-[80px] w-full mb-2"
                                  />
                                  <div className="flex justify-end space-x-2">
                                    <button
                                      type="button"
                                      className="btn btn-secondary"
                                      onClick={() => setEditingCommentId(null)}
                                    >
                                      Batal
                                    </button>
                                    <button
                                      type="submit"
                                      className="btn btn-primary"
                                      disabled={isSubmitting}
                                    >
                                      {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                  </div>
                                </Form>
                              )}
                            </Formik>
                          </div>
                        ) : (
                          <div className="mt-3 text-secondary-700 whitespace-pre-line">
                            {comment.content}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-secondary-500 italic">Belum ada komentar</p>
                )}

                {/* Add Comment Form */}
                <div className="mt-6">
                  <Formik
                    initialValues={{ content: '' }}
                    validationSchema={Yup.object({
                      content: Yup.string().required('Komentar tidak boleh kosong')
                    })}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                      try {
                        await addTicketComment(currentTicket.id, values);
                        toast.success('Komentar berhasil ditambahkan');
                        resetForm();
                      } catch (error) {
                        toast.error('Gagal menambahkan komentar');
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <Field
                          as="textarea"
                          name="content"
                          className="form-input min-h-[100px] w-full mb-2"
                          placeholder="Tambahkan komentar..."
                        />
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Mengirim...' : 'Kirim Komentar'}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-secondary-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-secondary-500 mb-4 uppercase">Detail</h3>
                
                {/* Status Actions */}
                {canEdit && currentTicket.status !== 'closed' && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-secondary-700 mb-2">Perbarui Status</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentTicket.status !== 'open' && (
                        <button
                          className="px-3 py-1 text-xs bg-warning-100 text-warning-800 rounded-full hover:bg-warning-200"
                          onClick={() => handleStatusChange('open')}
                        >
                          Open
                        </button>
                      )}
                      {currentTicket.status !== 'in_progress' && (
                        <button
                          className="px-3 py-1 text-xs bg-primary-100 text-primary-800 rounded-full hover:bg-primary-200"
                          onClick={() => handleStatusChange('in_progress')}
                        >
                          In Progress
                        </button>
                      )}
                      {currentTicket.status !== 'code_review' && (
                        <button
                          className="px-3 py-1 text-xs bg-info-100 text-info-800 rounded-full hover:bg-info-200"
                          onClick={() => handleStatusChange('code_review')}
                        >
                          Code Review
                        </button>
                      )}
                      {currentTicket.status !== 'testing' && (
                        <button
                          className="px-3 py-1 text-xs bg-success-100 text-success-800 rounded-full hover:bg-success-200"
                          onClick={() => handleStatusChange('testing')}
                        >
                          Testing
                        </button>
                      )}
                      {currentTicket.status !== 'closed' && (
                        <button
                          className="px-3 py-1 text-xs bg-secondary-100 text-secondary-800 rounded-full hover:bg-secondary-200"
                          onClick={() => handleStatusChange('closed')}
                        >
                          Closed
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-secondary-500">Pelapor</span>
                    {currentTicket.reporter ? (
                      <div className="flex items-center mt-1">
                        <div className="h-8 w-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-medium text-xs">
                          {currentTicket.reporter.firstName.charAt(0)}{currentTicket.reporter.lastName.charAt(0)}
                        </div>
                        <span className="ml-2 text-sm text-secondary-700">
                          {currentTicket.reporter.firstName} {currentTicket.reporter.lastName}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-secondary-700 mt-1">-</p>
                    )}
                  </div>
                  
                  <div>
                    <span className="text-sm text-secondary-500">Ditugaskan Kepada</span>
                    {currentTicket.assignee ? (
                      <div className="flex items-center mt-1">
                        <div className="h-8 w-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-medium text-xs">
                          {currentTicket.assignee.firstName.charAt(0)}{currentTicket.assignee.lastName.charAt(0)}
                        </div>
                        <span className="ml-2 text-sm text-secondary-700">
                          {currentTicket.assignee.firstName} {currentTicket.assignee.lastName}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-secondary-700 mt-1 italic">Belum ditugaskan</p>
                    )}
                  </div>
                  
                  <div>
                    <span className="text-sm text-secondary-500">Dibuat pada</span>
                    <p className="text-sm text-secondary-700 mt-1">{formatDate(currentTicket.createdAt)}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-secondary-500">Diperbarui pada</span>
                    <p className="text-sm text-secondary-700 mt-1">{formatDate(currentTicket.updatedAt)}</p>
                  </div>
                  
                  {currentTicket.dueDate && (
                    <div>
                      <span className="text-sm text-secondary-500">Tenggat Waktu</span>
                      <p className="text-sm text-secondary-700 mt-1">{formatDate(currentTicket.dueDate)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsPage;