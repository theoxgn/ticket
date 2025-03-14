// frontend/src/pages/tickets/TicketListPage.js
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TicketContext } from '../../context/TicketContext';
import { ProjectContext } from '../../context/ProjectContext';
import { FaPlus, FaFilter, FaSearch, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';

const TicketListPage = () => {
  const { tickets, loading, getTickets } = useContext(TicketContext);
  const { projects, getProjects } = useContext(ProjectContext);
  const { user } = useContext(AuthContext);
  
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    type: '',
    projectId: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    getTickets();
    getProjects();
  }, []);

  // Check if user is a manager or admin
  useEffect(() => {
    if (user) {
      setIsManager(['admin', 'manager'].includes(user.role));
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [tickets, searchTerm, filters, isManager, user]);

  const applyFilters = () => {
    if (!tickets || !user) return;

    let result = [...tickets];

    // For non-manager roles, only show tickets assigned to the current user
    if (!isManager) {
      result = result.filter(ticket => ticket.assigneeId === user.id);
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        ticket => 
          ticket.title.toLowerCase().includes(term) || 
          ticket.ticketKey.toLowerCase().includes(term)
      );
    }

    // Apply dropdown filters
    if (filters.status) {
      result = result.filter(ticket => ticket.status === filters.status);
    }
    
    if (filters.priority) {
      result = result.filter(ticket => ticket.priority === filters.priority);
    }
    
    if (filters.type) {
      result = result.filter(ticket => ticket.type === filters.type);
    }
    
    if (filters.projectId) {
      result = result.filter(ticket => ticket.projectId === parseInt(filters.projectId));
    }

    setFilteredTickets(result);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      type: '',
      projectId: ''
    });
    setSearchTerm('');
  };

  const toggleFilters = () => {
    setFilterOpen(!filterOpen);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-secondary-800">Tiket</h1>
        <Link to="/tickets/new" className="btn btn-primary flex items-center mt-4 md:mt-0">
          <FaPlus className="mr-2" /> Tiket Baru
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div className="relative flex-grow mb-4 md:mb-0 md:mr-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-secondary-400" />
              </div>
              <input
                type="text"
                className="form-input pl-10 w-full rounded-md border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                placeholder="Cari tiket berdasarkan judul atau kode"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className={`btn ${filterOpen ? 'btn-primary' : 'btn-secondary'} flex items-center justify-center transition-colors duration-200`}
              onClick={toggleFilters}
            >
              <FaFilter className="mr-2" />
              Filter {filterOpen ? 'Aktif' : ''}
            </button>
          </div>

          {filterOpen && (
            <div className="bg-secondary-50 p-4 rounded-md mt-2 border border-secondary-200 shadow-sm transition-all duration-300 ease-in-out">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-secondary-700">Filter Tiket</h3>
                <button
                  className="text-secondary-500 hover:text-secondary-700 flex items-center text-sm font-medium"
                  onClick={clearFilters}
                >
                  <FaTimes className="mr-1" /> Reset Filter
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="status" className="form-label block text-sm font-medium text-secondary-700 mb-1">Status</label>
                  <select
                    id="status"
                    name="status"
                    className="form-input w-full rounded-md border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 text-secondary-700"
                    value={filters.status}
                    onChange={handleFilterChange}
                  >
                    <option value="">Semua status</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="code_review">Code Review</option>
                    <option value="testing">Testing</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="priority" className="form-label block text-sm font-medium text-secondary-700 mb-1">Prioritas</label>
                  <select
                    id="priority"
                    name="priority"
                    className="form-input w-full rounded-md border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 text-secondary-700"
                    value={filters.priority}
                    onChange={handleFilterChange}
                  >
                    <option value="">Semua prioritas</option>
                    <option value="highest">Tertinggi</option>
                    <option value="high">Tinggi</option>
                    <option value="medium">Sedang</option>
                    <option value="low">Rendah</option>
                    <option value="lowest">Terendah</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="type" className="form-label block text-sm font-medium text-secondary-700 mb-1">Tipe</label>
                  <select
                    id="type"
                    name="type"
                    className="form-input w-full rounded-md border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 text-secondary-700"
                    value={filters.type}
                    onChange={handleFilterChange}
                  >
                    <option value="">Semua tipe</option>
                    <option value="bug">Bug</option>
                    <option value="feature">Fitur</option>
                    <option value="improvement">Perbaikan</option>
                    <option value="task">Tugas</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="projectId" className="form-label block text-sm font-medium text-secondary-700 mb-1">Proyek</label>
                  <select
                    id="projectId"
                    name="projectId"
                    className="form-input w-full rounded-md border-secondary-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 text-secondary-700"
                    value={filters.projectId}
                    onChange={handleFilterChange}
                  >
                    <option value="">Semua proyek</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Filter chips/tags - show active filters */}
              {(filters.status || filters.priority || filters.type || filters.projectId) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {filters.status && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      Status: {filters.status === 'open' ? 'Open' :
                        filters.status === 'in_progress' ? 'In Progress' :
                        filters.status === 'code_review' ? 'Code Review' :
                        filters.status === 'testing' ? 'Testing' : 'Closed'}
                      <button 
                        className="ml-1 text-primary-600 hover:text-primary-800"
                        onClick={() => setFilters(prev => ({ ...prev, status: '' }))}
                      >
                        <FaTimes />
                      </button>
                    </span>
                  )}
                  {filters.priority && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      Prioritas: {filters.priority === 'highest' ? 'Tertinggi' :
                        filters.priority === 'high' ? 'Tinggi' :
                        filters.priority === 'medium' ? 'Sedang' :
                        filters.priority === 'low' ? 'Rendah' : 'Terendah'}
                      <button 
                        className="ml-1 text-primary-600 hover:text-primary-800"
                        onClick={() => setFilters(prev => ({ ...prev, priority: '' }))}
                      >
                        <FaTimes />
                      </button>
                    </span>
                  )}
                  {filters.type && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      Tipe: {filters.type === 'bug' ? 'Bug' :
                        filters.type === 'feature' ? 'Fitur' :
                        filters.type === 'improvement' ? 'Perbaikan' : 'Tugas'}
                      <button 
                        className="ml-1 text-primary-600 hover:text-primary-800"
                        onClick={() => setFilters(prev => ({ ...prev, type: '' }))}
                      >
                        <FaTimes />
                      </button>
                    </span>
                  )}
                  {filters.projectId && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      Proyek: {projects.find(p => p.id === parseInt(filters.projectId))?.name || filters.projectId}
                      <button 
                        className="ml-1 text-primary-600 hover:text-primary-800"
                        onClick={() => setFilters(prev => ({ ...prev, projectId: '' }))}
                      >
                        <FaTimes />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Ticket List */}
      {filteredTickets.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-secondary-600 mb-4">
            {tickets.length === 0 
              ? 'Belum ada tiket yang dibuat.' 
              : 'Tidak ada tiket yang sesuai dengan filter yang dipilih.'}
          </p>
          {tickets.length === 0 ? (
            <Link to="/tickets/new" className="btn btn-primary inline-flex items-center">
              <FaPlus className="mr-2" /> Buat Tiket Pertama
            </Link>
          ) : (
            <button 
              className="btn btn-secondary inline-flex items-center"
              onClick={clearFilters}
            >
              <FaTimes className="mr-2" /> Hapus Filter
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Kode
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Judul
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Prioritas
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Tipe
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Ditugaskan Kepada
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Proyek
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                      <Link to={`/tickets/${ticket.id}`} className="text-primary-600 hover:text-primary-700">
                        {ticket.ticketKey}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                      <Link to={`/tickets/${ticket.id}`} className="hover:text-primary-600">
                        {ticket.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full
                        ${ticket.status === 'open' ? 'bg-warning-100 text-warning-800' :
                          ticket.status === 'in_progress' ? 'bg-primary-100 text-primary-800' :
                          ticket.status === 'code_review' ? 'bg-info-100 text-info-800' :
                          ticket.status === 'testing' ? 'bg-success-100 text-success-800' :
                          'bg-secondary-100 text-secondary-800'}`}
                      >
                        {ticket.status === 'open' ? 'Open' :
                          ticket.status === 'in_progress' ? 'In Progress' :
                          ticket.status === 'code_review' ? 'Code Review' :
                          ticket.status === 'testing' ? 'Testing' :
                          'Closed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full
                        ${ticket.priority === 'highest' ? 'bg-danger-100 text-danger-800' :
                          ticket.priority === 'high' ? 'bg-warning-100 text-warning-800' :
                          ticket.priority === 'medium' ? 'bg-primary-100 text-primary-800' :
                          ticket.priority === 'low' ? 'bg-success-100 text-success-800' :
                          'bg-info-100 text-info-800'}`}
                      >
                        {ticket.priority === 'highest' ? 'Tertinggi' :
                          ticket.priority === 'high' ? 'Tinggi' :
                          ticket.priority === 'medium' ? 'Sedang' :
                          ticket.priority === 'low' ? 'Rendah' :
                          'Terendah'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold bg-secondary-100 text-secondary-800 rounded-full">
                        {ticket.type === 'bug' ? 'Bug' :
                          ticket.type === 'feature' ? 'Fitur' :
                          ticket.type === 'improvement' ? 'Perbaikan' :
                          'Tugas'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                      {ticket.assignee ? (
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-medium text-xs">
                            {ticket.assignee.firstName.charAt(0)}{ticket.assignee.lastName.charAt(0)}
                          </div>
                          <span className="ml-2">{ticket.assignee.firstName} {ticket.assignee.lastName}</span>
                        </div>
                      ) : (
                        <span className="italic">Belum ditugaskan</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                      {ticket.project ? (
                        <Link to={`/projects/${ticket.project.id}`} className="text-primary-600 hover:text-primary-700">
                          {ticket.project.name}
                        </Link>
                      ) : (
                        <span className="italic">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketListPage;