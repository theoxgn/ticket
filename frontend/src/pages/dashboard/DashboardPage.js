// frontend/src/pages/dashboard/DashboardPage.js
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProjectContext } from '../../context/ProjectContext';
import { TicketContext } from '../../context/TicketContext';
import { 
  FaPlus, 
  FaProjectDiagram, 
  FaTicketAlt, 
  FaExclamationTriangle, 
  FaCheckCircle,
  FaChartLine
} from 'react-icons/fa';

const DashboardPage = () => {
  const { projects, loading: projectsLoading, getProjects } = useContext(ProjectContext);
  const { tickets, loading: ticketsLoading, getTickets } = useContext(TicketContext);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTickets: 0,
    openTickets: 0,
    highPriorityTickets: 0
  });

  useEffect(() => {
    getProjects();
    getTickets();
  }, []);

  useEffect(() => {
    if (tickets && projects) {
      setStats({
        totalProjects: projects.length,
        totalTickets: tickets.length,
        openTickets: tickets.filter(ticket => ticket.status === 'open').length,
        highPriorityTickets: tickets.filter(ticket => ['high', 'highest'].includes(ticket.priority)).length
      });
    }
  }, [tickets, projects]);

  if (projectsLoading || ticketsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-secondary-800">Dashboard</h1>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Link to="/projects/new" className="btn btn-primary flex items-center">
            <FaPlus className="mr-2" /> Proyek Baru
          </Link>
          <Link to="/tickets/new" className="btn btn-primary flex items-center">
            <FaPlus className="mr-2" /> Tiket Baru
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-primary-500">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-medium text-primary-600 uppercase">
                Total Proyek
              </div>
              <div className="text-2xl font-semibold">{stats.totalProjects}</div>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <FaProjectDiagram className="text-primary-500 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-success-500">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-medium text-success-600 uppercase">
                Total Tiket
              </div>
              <div className="text-2xl font-semibold">{stats.totalTickets}</div>
            </div>
            <div className="p-3 bg-success-100 rounded-full">
              <FaTicketAlt className="text-success-500 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-info-500">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-medium text-info-600 uppercase">
                Tiket Terbuka
              </div>
              <div className="text-2xl font-semibold">{stats.openTickets}</div>
            </div>
            <div className="p-3 bg-info-100 rounded-full">
              <FaCheckCircle className="text-info-500 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-warning-500">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-medium text-warning-600 uppercase">
                Prioritas Tinggi
              </div>
              <div className="text-2xl font-semibold">{stats.highPriorityTickets}</div>
            </div>
            <div className="p-3 bg-warning-100 rounded-full">
              <FaExclamationTriangle className="text-warning-500 text-xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center p-4 border-b border-secondary-200">
            <h2 className="text-lg font-semibold text-secondary-800">
              Proyek Terbaru
            </h2>
            <Link 
              to="/projects" 
              className="text-primary-600 hover:text-primary-700 text-sm flex items-center"
            >
              Lihat Semua <FaChartLine className="ml-1" />
            </Link>
          </div>
          <div className="p-4">
            {projects.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-secondary-600">Belum ada proyek.</p>
                <Link 
                  to="/projects/new" 
                  className="inline-block mt-2 text-primary-600 hover:text-primary-700"
                >
                  Buat proyek pertama
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {projects
                  .slice(0, 5)
                  .map(project => (
                    <Link
                      key={project.id}
                      to={`/projects/${project.id}`}
                      className="block p-3 rounded-md hover:bg-secondary-50 border border-transparent hover:border-secondary-200 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-secondary-800">{project.name}</h3>
                        <span className="text-xs font-semibold bg-secondary-100 text-secondary-700 py-1 px-2 rounded">
                          {project.key}
                        </span>
                      </div>
                      <p className="text-sm text-secondary-600 mt-1 line-clamp-2">
                        {project.description
                          ? project.description
                          : 'Tidak ada deskripsi'}
                      </p>
                      <div className="text-xs text-secondary-500 mt-2">
                        {project.members?.length || 0} anggota tim
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center p-4 border-b border-secondary-200">
            <h2 className="text-lg font-semibold text-secondary-800">
              Tiket Terbaru
            </h2>
            <Link 
              to="/tickets" 
              className="text-primary-600 hover:text-primary-700 text-sm flex items-center"
            >
              Lihat Semua <FaChartLine className="ml-1" />
            </Link>
          </div>
          <div className="p-4">
            {tickets.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-secondary-600">Belum ada tiket.</p>
                <Link 
                  to="/tickets/new" 
                  className="inline-block mt-2 text-primary-600 hover:text-primary-700"
                >
                  Buat tiket pertama
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets
                  .slice(0, 5)
                  .map(ticket => (
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

export default DashboardPage;