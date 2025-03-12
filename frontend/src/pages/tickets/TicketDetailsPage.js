// frontend/src/pages/tickets/TicketDetailsPage.js
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { TicketContext } from '../../context/TicketContext';
import { AuthContext } from '../../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaTrash,
  FaClock, 
  FaComment,
  FaTag,
  FaExclamationCircle,
  FaTasks,
  FaCheckCircle,
  FaRegCalendarAlt,
  FaUserCircle,
  FaUsersCog,
  FaPaperPlane,
  FaImage,
  FaVideo
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

  // Gunakan useEffect dengan cleanup yang tepat
  useEffect(() => {
    // Mencegah multiple fetch
    let mounted = true;
    
    if (id && mounted) {
      getTicket(id);
    }

    // Cleanup function
    return () => {
      mounted = false;
      clearCurrentTicket();
    };
  }, [id, getTicket, clearCurrentTicket]);

  // Periksa hak edit terpisah
  useEffect(() => {
    if (currentTicket && user) {
      // Check if user can edit this ticket
      const isCreator = currentTicket.reporterId === user.id;
      const isAssignee = currentTicket.assigneeId === user.id;
      const isAdmin = user.role === 'admin';
      
      setCanEdit(isCreator || isAssignee || isAdmin);
    }
  }, [currentTicket, user]);

  // Fungsi handler yang stabil dengan useCallback
  const handleStatusChange = useCallback(async (newStatus) => {
    try {
      await editTicket(id, { status: newStatus });
      toast.success('Status tiket berhasil diperbarui');
    } catch (error) {
      toast.error('Gagal memperbarui status tiket');
    }
  }, [id, editTicket]);

  const handleDeleteComment = useCallback(async (commentId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus komentar ini?')) {
      try {
        await removeComment(commentId);
        toast.success('Komentar berhasil dihapus');
      } catch (error) {
        toast.error('Gagal menghapus komentar');
      }
    }
  }, [removeComment]);

  // Fungsi submit form yang stabil
  const handleAddComment = useCallback(async (values, { setSubmitting, resetForm }) => {
    try {
      await addTicketComment(id, values);
      toast.success('Komentar berhasil ditambahkan');
      resetForm();
    } catch (error) {
      toast.error('Gagal menambahkan komentar');
    } finally {
      setSubmitting(false);
    }
  }, [id, addTicketComment]);

  const handleEditComment = useCallback(async (commentId, values, { setSubmitting }) => {
    try {
      await editComment(commentId, values);
      setEditingCommentId(null);
      toast.success('Komentar berhasil diperbarui');
    } catch (error) {
      toast.error('Gagal memperbarui komentar');
    } finally {
      setSubmitting(false);
    }
  }, [editComment]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        <span className="ml-4 text-secondary-600">Memuat tiket...</span>
      </div>
    );
  }

  if (!currentTicket) {
    return (
      <div className="bg-white shadow-md rounded-lg p-8 text-center max-w-lg mx-auto mt-8">
        <FaExclamationCircle className="text-secondary-500 text-5xl mx-auto mb-4" />
        <p className="text-secondary-600 text-lg mb-6">Tiket tidak ditemukan atau telah dihapus.</p>
        <Link to="/tickets" className="btn btn-primary inline-flex items-center">
          <FaArrowLeft className="mr-2" /> Kembali ke Daftar Tiket
        </Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'open':
        return 'bg-warning-100 text-warning-800';
      case 'in_progress':
        return 'bg-primary-100 text-primary-800';
      case 'code_review':
        return 'bg-info-100 text-info-800';
      case 'testing':
        return 'bg-success-100 text-success-800';
      case 'closed':
        return 'bg-secondary-200 text-secondary-800';
      default:
        return 'bg-secondary-100 text-secondary-800';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch(priority) {
      case 'highest':
        return 'bg-danger-100 text-danger-800';
      case 'high':
        return 'bg-warning-100 text-warning-800';
      case 'medium':
        return 'bg-primary-100 text-primary-800';
      case 'low':
        return 'bg-success-100 text-success-800';
      case 'lowest':
        return 'bg-info-100 text-info-800';
      default:
        return 'bg-secondary-100 text-secondary-800';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'open': return 'Open';
      case 'in_progress': return 'In Progress';
      case 'code_review': return 'Code Review';
      case 'testing': return 'Testing';
      case 'closed': return 'Closed';
      default: return status;
    }
  };

  const getPriorityLabel = (priority) => {
    switch(priority) {
      case 'highest': return 'Tertinggi';
      case 'high': return 'Tinggi';
      case 'medium': return 'Sedang';
      case 'low': return 'Rendah';
      case 'lowest': return 'Terendah';
      default: return priority;
    }
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'bug': return 'Bug';
      case 'feature': return 'Fitur';
      case 'improvement': return 'Perbaikan';
      case 'task': return 'Tugas';
      default: return type;
    }
  };

  const getInitials = (firstName, lastName) => {
    return (firstName?.charAt(0) || '') + (lastName?.charAt(0) || '');
  };
  
  // Helper untuk mendapatkan tombol status dengan warna yang lebih kuat
  const getStatusButtonClass = (status) => {
    switch(status) {
      case 'open':
        return 'bg-warning-400 text-white hover:bg-warning-500 border border-warning-500';
      case 'in_progress':
        return 'bg-primary-400 text-white hover:bg-primary-500 border border-primary-500';
      case 'code_review':
        return 'bg-info-400 text-white hover:bg-info-500 border border-info-500';
      case 'testing':
        return 'bg-success-400 text-white hover:bg-success-500 border border-success-500';
      case 'closed':
        return 'bg-secondary-400 text-white hover:bg-secondary-500 border border-secondary-500';
      default:
        return 'bg-secondary-400 text-white hover:bg-secondary-500 border border-secondary-500';
    }
  };  

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="bg-gradient-to-r from-primary-700 to-primary-800 shadow-md rounded-t-lg p-6 text-white">
        <div className="mb-4">
          <Link to="/tickets" className="text-white opacity-80 hover:opacity-100 flex items-center transition">
            <FaArrowLeft className="mr-2" /> Kembali ke Daftar Tiket
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">
                {currentTicket.ticketKey}: {currentTicket.title}
              </h1>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className={`px-3 py-1.5 text-xs font-bold rounded-full flex items-center ${getStatusBadgeClass(currentTicket.status)}`}>
                <FaCheckCircle className="mr-1" /> {getStatusLabel(currentTicket.status)}
              </span>
              <span className={`px-3 py-1.5 text-xs font-bold rounded-full flex items-center ${getPriorityBadgeClass(currentTicket.priority)}`}>
                <FaExclamationCircle className="mr-1" /> {getPriorityLabel(currentTicket.priority)}
              </span>
              <span className="px-3 py-1.5 text-xs font-bold bg-secondary-100 text-secondary-800 rounded-full flex items-center">
                <FaTasks className="mr-1" /> {getTypeLabel(currentTicket.type)}
              </span>
              {currentTicket.project && (
                <Link 
                  to={`/projects/${currentTicket.project.id}`}
                  className="px-3 py-1.5 text-xs font-bold bg-primary-100 text-primary-800 rounded-full hover:bg-primary-200 flex items-center transition"
                >
                  <FaTag className="mr-1" /> {currentTicket.project.name}
                </Link>
              )}
            </div>
          </div>
          
          {canEdit && (
            <Link 
              to={`/tickets/${currentTicket.id}/edit`}
              className="btn btn-secondary mt-3 md:mt-0 flex items-center bg-white text-primary-700 hover:bg-primary-50 hover:text-primary-800 transition shadow-lg px-4 py-2 font-semibold rounded-lg"
            >
              <FaEdit className="mr-2 text-primary-600" /> Edit Tiket
            </Link>
          )}
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-b-lg overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="mb-8">
                <h2 className="text-lg font-medium text-secondary-800 mb-4 pb-2 border-b border-secondary-200">Deskripsi</h2>
                <div className="prose max-w-none">
                  {currentTicket.description ? (
                    <p className="text-secondary-600 whitespace-pre-line leading-relaxed">{currentTicket.description}</p>
                  ) : (
                    <p className="text-secondary-500 italic">Tidak ada deskripsi untuk tiket ini</p>
                  )}
                </div>
              </div>
              {/* Photo and Video Section */}
              {(currentTicket.photoUrl || currentTicket.videoLink) && (
                <div className="mb-8">
                  <h2 className="text-lg font-medium text-secondary-800 mb-4 pb-2 border-b border-secondary-200">Lampiran</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentTicket.photoUrl && (
                      <div className="bg-secondary-50 p-4 rounded-lg border border-secondary-200">
                        <h3 className="font-medium text-secondary-700 mb-2 flex items-center">
                          <FaImage className="mr-2 text-primary-600" /> Foto
                        </h3>
                        <div className="mt-2">
                          <div className="relative">
                            <img 
                              src={currentTicket.photoUrl} 
                              alt="Lampiran" 
                              className="max-w-full rounded-lg border border-secondary-200 hover:border-primary-300 transition-colors shadow-sm" 
                              onError={(e) => {
                                console.error("Failed to load image:", e);
                                e.target.onerror = null; // Prevent infinite error loop
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' text-anchor='middle' fill='%23999999'%3EImage Not Available%3C/text%3E%3C/svg%3E";
                                e.target.style.opacity = "0.7";
                                e.target.style.filter = "grayscale(1)";
                              }}
                            />
                          </div>
                          
                          {/* Show actual URL for debugging */}
                          <div className="mt-2 text-xs text-secondary-500 break-all">
                            <span className="font-semibold">Image URL:</span> {currentTicket.photoUrl}
                          </div>
                        </div>
                      </div>
                    )} 
                    {currentTicket.videoLink && (
                      <div className="bg-secondary-50 p-4 rounded-lg border border-secondary-200">
                        <h3 className="font-medium text-secondary-700 mb-2 flex items-center">
                          <FaVideo className="mr-2 text-primary-600" /> Video
                        </h3>
                        <div className="mt-2">
                          <a 
                            href={currentTicket.videoLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center bg-white p-3 rounded-lg border border-secondary-200 hover:border-primary-300 transition-colors shadow-sm"
                          >
                            <div className="bg-primary-100 p-2 rounded-full mr-3">
                              <FaVideo className="text-primary-600" />
                            </div>
                            <div className="text-primary-600 hover:text-primary-700 hover:underline line-clamp-1 break-all">
                              {currentTicket.videoLink}
                            </div>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* Comments Section */}
              <div className="border-t border-secondary-200 pt-8">
                <h2 className="text-lg font-medium text-secondary-800 mb-4 bp-2 flex items-center">
                  <FaComment className="mr-2 text-primary-600" /> 
                  Komentar {currentTicket.comments?.length > 0 && `(${currentTicket.comments.length})`}
                </h2>

                {currentTicket.comments && currentTicket.comments.length > 0 ? (
                  <div className="space-y-5">
                    {currentTicket.comments.map(comment => (
                      <div key={comment.id} className="bg-secondary-50 rounded-lg p-4 hover:shadow-sm transition">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            <div className="h-10 w-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-medium">
                              {getInitials(comment.user.firstName, comment.user.lastName)}
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
                              <p className="text-xs text-secondary-500 flex items-center">
                                <FaClock className="mr-1" /> {formatDate(comment.createdAt)}
                                {comment.updatedAt !== comment.createdAt && 
                                  <span className="ml-2 italic">(diperbarui)</span>
                                }
                              </p>
                            </div>
                          </div>
                          
                          {user && comment.userId === user.id && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setEditingCommentId(comment.id)}
                                className="text-primary-600 hover:text-primary-700 p-1"
                                title="Edit komentar"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-danger-600 hover:text-danger-700 p-1"
                                title="Hapus komentar"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          )}
                        </div>
                        
                        {editingCommentId === comment.id ? (
                          <div className="mt-4">
                            <Formik
                              initialValues={{ content: comment.content }}
                              validationSchema={Yup.object({
                                content: Yup.string().required('Komentar tidak boleh kosong')
                              })}
                              onSubmit={(values, actions) => handleEditComment(comment.id, values, actions)}
                            >
                              {({ isSubmitting, errors, touched }) => (
                                <Form>
                                  <Field
                                    as="textarea"
                                    name="content"
                                    className={`form-input min-h-[100px] w-full mb-2 ${errors.content && touched.content ? 'border-danger-500' : ''}`}
                                  />
                                  <ErrorMessage name="content" component="div" className="text-danger-600 text-sm mb-2" />
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
                          <div className="mt-3 text-secondary-700 whitespace-pre-line leading-relaxed">
                            {comment.content}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-secondary-50 rounded-lg p-6 text-center">
                    <FaComment className="mx-auto text-secondary-400 text-3xl mb-2" />
                    <p className="text-secondary-500">Belum ada komentar untuk tiket ini</p>
                  </div>
                )}

                {/* Add Comment Form - Ditingkatkan */}
                <div className="mt-8 bg-primary-50 rounded-lg border border-primary-200 p-5 shadow-sm">
                  <h3 className="text-md font-semibold text-primary-700 mb-4 pb-2 border-b border-primary-200 flex items-center">
                    <FaComment className="mr-2 text-primary-600" /> Tambahkan Komentar
                  </h3>
                  <Formik
                    initialValues={{ content: '' }}
                    validationSchema={Yup.object({
                      content: Yup.string().required('Komentar tidak boleh kosong')
                    })}
                    onSubmit={handleAddComment}
                  >
                    {({ isSubmitting, errors, touched }) => (
                      <Form>
                        <div className="relative">
                          <Field
                            as="textarea"
                            name="content"
                            className={`form-input min-h-[120px] w-full mb-2 p-4 focus:ring-2 focus:ring-primary-400 focus:border-primary-400 ${errors.content && touched.content ? 'border-danger-500' : 'border-primary-200'}`}
                            placeholder="Tambahkan komentar disini..."
                          />
                          <ErrorMessage name="content" component="div" className="text-danger-600 text-sm mb-3 font-medium" />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="flex items-center px-5 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 transition shadow-md disabled:opacity-70"
                            disabled={isSubmitting}
                          >
                            <FaPaperPlane className="mr-2" />
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
              <div className="bg-secondary-50 rounded-lg p-5 shadow-sm sticky top-4">
                <h3 className="text-sm font-medium text-primary-600 mb-4 uppercase tracking-wider">Detail Tiket</h3>
                
                {/* Status Actions - Dengan highlight warna yang lebih kuat */}
                {canEdit && currentTicket.status !== 'closed' && (
                  <div className="mb-6 bg-primary-100 border-2 border-primary-300 rounded-lg p-4 shadow-md">
                    <h4 className="text-sm font-bold text-primary-800 mb-4 flex items-center bg-primary-200 p-2 rounded-md">
                      <FaCheckCircle className="mr-2 text-primary-600" /> Perbarui Status
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {currentTicket.status !== 'open' && (
                        <button
                          className={`px-3 py-1.5 text-xs font-bold rounded-md transition flex items-center shadow-lg ${getStatusButtonClass('open')}`}
                          onClick={() => handleStatusChange('open')}
                        >
                          Open
                        </button>
                      )}
                      {currentTicket.status !== 'in_progress' && (
                        <button
                          className={`px-3 py-1.5 text-xs font-bold rounded-md transition flex items-center shadow-lg ${getStatusButtonClass('in_progress')}`}
                          onClick={() => handleStatusChange('in_progress')}
                        >
                          In Progress
                        </button>
                      )}
                      {currentTicket.status !== 'code_review' && (
                        <button
                          className={`px-3 py-1.5 text-xs font-bold rounded-md transition flex items-center shadow-lg ${getStatusButtonClass('code_review')}`}
                          onClick={() => handleStatusChange('code_review')}
                        >
                          Code Review
                        </button>
                      )}
                      {currentTicket.status !== 'testing' && (
                        <button
                          className={`px-3 py-1.5 text-xs font-bold rounded-md transition flex items-center shadow-lg ${getStatusButtonClass('testing')}`}
                          onClick={() => handleStatusChange('testing')}
                        >
                          Testing
                        </button>
                      )}
                      {currentTicket.status !== 'closed' && (
                        <button
                          className={`px-3 py-1.5 text-xs font-bold rounded-md transition flex items-center shadow-lg ${getStatusButtonClass('closed')}`}
                          onClick={() => handleStatusChange('closed')}
                        >
                          Closed
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="space-y-5">
                  <div className="border-b border-secondary-200 pb-4">
                    <div className="flex items-center">
                      <FaUserCircle className="text-primary-600 mr-2" />
                      <span className="text-sm text-secondary-600">Pelapor</span>
                    </div>
                    {currentTicket.reporter ? (
                      <div className="flex items-center mt-2">
                        <div className="h-8 w-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-medium text-xs">
                          {getInitials(currentTicket.reporter.firstName, currentTicket.reporter.lastName)}
                        </div>
                        <span className="ml-2 text-sm text-secondary-700 font-medium">
                          {currentTicket.reporter.firstName} {currentTicket.reporter.lastName}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-secondary-700 mt-2">-</p>
                    )}
                  </div>
                  
                  <div className="border-b border-secondary-200 pb-4">
                    <div className="flex items-center">
                      <FaUsersCog className="text-primary-600 mr-2" />
                      <span className="text-sm text-secondary-600">Ditugaskan Kepada</span>
                    </div>
                    {currentTicket.assignee ? (
                      <div className="flex items-center mt-2">
                        <div className="h-8 w-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-medium text-xs">
                          {getInitials(currentTicket.assignee.firstName, currentTicket.assignee.lastName)}
                        </div>
                        <span className="ml-2 text-sm text-secondary-700 font-medium">
                          {currentTicket.assignee.firstName} {currentTicket.assignee.lastName}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-secondary-700 mt-2 italic">Belum ditugaskan</p>
                    )}
                  </div>
                  
                  <div className="border-b border-secondary-200 pb-4">
                    <div className="flex items-center">
                      <FaRegCalendarAlt className="text-primary-600 mr-2" />
                      <span className="text-sm text-secondary-600">Dibuat pada</span>
                    </div>
                    <p className="text-sm text-secondary-700 mt-2">{formatDate(currentTicket.createdAt)}</p>
                  </div>
                  
                  <div className="border-b border-secondary-200 pb-4">
                    <div className="flex items-center">
                      <FaClock className="text-primary-600 mr-2" />
                      <span className="text-sm text-secondary-600">Diperbarui pada</span>
                    </div>
                    <p className="text-sm text-secondary-700 mt-2">{formatDate(currentTicket.updatedAt)}</p>
                  </div>
                  
                  {currentTicket.dueDate && (
                    <div className="border-b border-secondary-200 pb-4">
                      <div className="flex items-center">
                        <FaRegCalendarAlt className="text-danger-600 mr-2" />
                        <span className="text-sm text-secondary-600">Tenggat Waktu</span>
                      </div>
                      <p className="text-sm text-secondary-700 mt-2 font-medium">{formatDate(currentTicket.dueDate)}</p>
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