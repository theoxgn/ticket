// frontend/src/pages/projects/ProjectDetailsPage.js
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ProjectContext } from '../../context/ProjectContext';
import { AuthContext } from '../../context/AuthContext';
import { FaEdit, FaPlus, FaUsers, FaTicketAlt, FaArrowLeft } from 'react-icons/fa';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { currentProject, loading, getProject, clearCurrentProject } = useContext(ProjectContext);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    getProject(id);

    return () => {
      clearCurrentProject();
    };
  }, [id]);

  useEffect(() => {
    if (currentProject && user) {
      // Check if user is admin or project owner/manager
      const isProjectAdmin = currentProject.members?.some(
        member => 
          member.id === user.id && 
          (member.UserProject?.role === 'owner' || member.UserProject?.role === 'manager')
      );
      
      setIsAdmin(user.role === 'admin' || isProjectAdmin);
    }
  }, [currentProject, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <p className="text-secondary-600 mb-4">Proyek tidak ditemukan.</p>
        <Link to="/projects" className="btn btn-primary">
          Kembali ke Daftar Proyek
        </Link>
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
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-secondary-800">{currentProject.name}</h1>
                <span className="ml-3 px-3 py-1 bg-secondary-100 text-secondary-800 text-sm rounded-full">
                  {currentProject.key}
                </span>
              </div>
              <p className="text-secondary-500 mt-1">
                {currentProject.isActive ? 
                  <span className="text-success-600">Aktif</span> : 
                  <span className="text-danger-600">Tidak Aktif</span>}
              </p>
            </div>
            
            {isAdmin && (
              <Link 
                to={`/projects/${currentProject.id}/edit`} 
                className="btn btn-primary mt-3 md:mt-0 flex items-center"
              >
                <FaEdit className="mr-2" /> Edit Proyek
              </Link>
            )}
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium text-secondary-800 mb-2">Deskripsi</h3>
            <p className="text-secondary-600">
              {currentProject.description || <span className="italic text-secondary-400">Tidak ada deskripsi</span>}
            </p>
          </div>
        </div>
      </div>
      
      {/* Team Members */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-secondary-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-secondary-800 flex items-center">
              <FaUsers className="mr-2 text-primary-600" /> Anggota Tim
            </h2>
            {isAdmin && (
              <button 
                className="text-primary-600 hover:text-primary-700"
                onClick={() => toast.info('Fungsionalitas tambah anggota akan diimplementasikan')}
              >
                <FaPlus /> <span className="sr-only">Tambah Anggota</span>
              </button>
            )}
          </div>
          <div className="p-6">
            {currentProject.members?.length === 0 ? (
              <p className="text-secondary-500">Belum ada anggota tim.</p>
            ) : (
              <div className="space-y-4">
                {currentProject.members?.map(member => (
                  <div 
                    key={member.id} 
                    className="flex items-center justify-between p-3 hover:bg-secondary-50 rounded-md"
                  >
                    <div className="flex items-center">
                      <div className="bg-primary-100 text-primary-700 h-10 w-10 rounded-full flex items-center justify-center font-medium">
                        {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-secondary-800">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-sm text-secondary-500">@{member.username}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-secondary-100 text-secondary-800 text-xs rounded-full capitalize">
                      {member.UserProject?.role || 'member'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Tickets */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-secondary-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-secondary-800 flex items-center">
              <FaTicketAlt className="mr-2 text-primary-600" /> Tiket
            </h2>
            <Link 
              to="/tickets/new" 
              state={{ projectId: currentProject.id }}
              className="text-primary-600 hover:text-primary-700"
            >
              <FaPlus /> <span className="sr-only">Tambah Tiket</span>
            </Link>
          </div>
          <div className="p-6">
            {currentProject.tickets?.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-secondary-500 mb-4">Belum ada tiket untuk proyek ini.</p>
                <Link 
                  to="/tickets/new" 
                  state={{ projectId: currentProject.id }}
                  className="btn btn-primary inline-flex items-center"
                >
                  <FaPlus className="mr-2" /> Buat Tiket
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {currentProject.tickets?.map(ticket => (
                  <Link
                    key={ticket.id}
                    to={`/tickets/${ticket.id}`}
                    className="block p-3 rounded-md hover:bg-secondary-50 border border-transparent hover:border-secondary-200 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-secondary-800">
                        {ticket.ticketKey} - {ticket.title}
                      </h3>
                      <span className={`text-xs font-semibold py-1 px-2 rounded
                        ${ticket.priority === 'highest' || ticket.priority === 'high'
                          ? 'bg-danger-100 text-danger-700'
                          : ticket.priority === 'medium'
                          ? 'bg-warning-100 text-warning-700'
                          : 'bg-info-100 text-info-700'
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </div>
                    <div className="flex items-center mt-2">
                      <span className="text-xs bg-secondary-100 text-secondary-700 py-1 px-2 rounded">
                        {ticket.status}
                      </span>
                      <span className="text-xs text-secondary-500 ml-2">
                        Ditugaskan ke: {ticket.assignee ? `${ticket.assignee.firstName} ${ticket.assignee.lastName}` : 'Belum ditugaskan'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;