// frontend/src/pages/projects/ProjectListPage.js
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProjectContext } from '../../context/ProjectContext';
import { AuthContext } from '../../context/AuthContext';
import { 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaUsers, 
  FaCalendarAlt, 
  FaProjectDiagram,
  FaTasks,
  FaFilter,
  FaSearch,
  FaTimes
} from 'react-icons/fa';

const ProjectListPage = () => {
  const { projects, loading, getProjects } = useContext(ProjectContext);
  const { user } = useContext(AuthContext);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
  });

  // Check if user is manager or admin
  const isManagerOrAdmin = user && (user.role === 'manager' || user.role === 'admin');

  useEffect(() => {
    getProjects();
  }, []);

  useEffect(() => {
    if (projects && projects.length > 0) {
      let result = [...projects];
      
      // Filter projects based on user role
      if (!isManagerOrAdmin) {
        // Regular users can only see projects they are assigned to
        result = result.filter(project => 
          project.members && project.members.some(member => member.id === user?.id)
        );
      }

      // Apply search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(
          project => 
            project.name.toLowerCase().includes(term) || 
            project.key.toLowerCase().includes(term) ||
            (project.description && project.description.toLowerCase().includes(term))
        );
      }

      // Apply status filter
      if (filters.status) {
        result = result.filter(project => 
          filters.status === 'active' ? project.isActive : !project.isActive
        );
      }

      setFilteredProjects(result);
    } else {
      setFilteredProjects([]);
    }
  }, [projects, user, isManagerOrAdmin, searchTerm, filters]);

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
        <h1 className="text-2xl font-bold text-secondary-800">Proyek</h1>
        {isManagerOrAdmin && (
          <Link 
            to="/projects/new" 
            className="btn btn-primary flex items-center mt-4 md:mt-0 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 hover:shadow-lg transition-all duration-300"
          >
            <FaPlus className="mr-2" /> Proyek Baru
          </Link>
        )}
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
                placeholder="Cari proyek berdasarkan nama atau kode"
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
                <h3 className="font-medium text-secondary-700">Filter Proyek</h3>
                <button
                  className="text-secondary-500 hover:text-secondary-700 flex items-center text-sm font-medium"
                  onClick={clearFilters}
                >
                  <FaTimes className="mr-1" /> Reset Filter
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                  </select>
                </div>
              </div>
              
              {/* Filter chips/tags - show active filters */}
              {filters.status && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    Status: {filters.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                    <button 
                      className="ml-1 text-primary-600 hover:text-primary-800"
                      onClick={() => setFilters(prev => ({ ...prev, status: '' }))}
                    >
                      <FaTimes />
                    </button>
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-8 text-center border border-secondary-100">
          <div className="flex justify-center mb-6">
            <FaProjectDiagram className="text-primary-500 text-6xl opacity-70" />
          </div>
          <p className="text-secondary-600 mb-4 text-lg">
            {projects.length === 0 
              ? 'Belum ada proyek yang dibuat.' 
              : 'Tidak ada proyek yang sesuai dengan filter yang dipilih atau Anda tidak memiliki akses.'}
          </p>
          {isManagerOrAdmin ? (
            <Link 
              to="/projects/new" 
              className="btn btn-primary inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 hover:shadow-lg transition-all duration-300"
            >
              <FaPlus className="mr-2" /> Buat Proyek Baru
            </Link>
          ) : (
            <button 
              onClick={clearFilters}
              className="btn btn-secondary inline-flex items-center px-4 py-2 bg-secondary-200 text-secondary-700 rounded-md hover:bg-secondary-300 transition-all duration-300"
            >
              <FaTimes className="mr-2" /> Hapus Filter
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div 
              key={project.id} 
              className="bg-white shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 rounded-lg overflow-hidden border border-secondary-100 flex flex-col"
            >
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-4 flex justify-between items-center">
                <h2 className="font-semibold text-white text-lg line-clamp-1">{project.name}</h2>
                <span className="px-3 py-1 bg-white text-primary-700 text-xs rounded-full font-medium">
                  {project.key}
                </span>
              </div>
              
              <div className="p-5 flex-grow flex flex-col">
                <div className="mb-2 inline-flex">
                  <span className={`
                    text-xs px-2 py-1 rounded-full flex items-center
                    ${project.isActive 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-red-100 text-red-700 border border-red-200'}
                  `}>
                    <FaTasks className="mr-1" /> {project.isActive ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </div>
                
                <p className="text-secondary-600 mb-4 h-24 overflow-hidden text-sm leading-relaxed">
                  {project.description ? (
                    project.description.length > 150 ? (
                      `${project.description.substring(0, 150)}...`
                    ) : (
                      project.description
                    )
                  ) : (
                    <span className="text-secondary-400 italic">Tidak ada deskripsi</span>
                  )}
                </p>
                
                <div className="flex flex-col space-y-2 mb-5 border-t border-b border-secondary-100 py-3 mt-auto">
                  <div className="flex items-center text-secondary-500 text-sm">
                    <div className="p-1 bg-primary-50 rounded-full mr-2">
                      <FaUsers className="text-primary-500" />
                    </div>
                    <span>{project.members?.length || 0} anggota tim</span>
                  </div>
                  <div className="flex items-center text-secondary-500 text-sm">
                    <div className="p-1 bg-primary-50 rounded-full mr-2">
                      <FaCalendarAlt className="text-primary-500" />
                    </div>
                    <span>Terakhir diupdate: {new Date(project.updatedAt || Date.now()).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <Link
                    to={`/projects/${project.id}`}
                    className="btn btn-primary flex items-center justify-center py-2 px-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-all duration-300"
                  >
                    <FaEye className="mr-2" /> Detail
                  </Link>
                  {isManagerOrAdmin && (
                    <Link
                      to={`/projects/${project.id}/edit`}
                      className="btn btn-secondary flex items-center justify-center py-2 px-3 bg-secondary-100 text-secondary-700 rounded-md border border-secondary-300 hover:bg-secondary-200 transition-all duration-300"
                    >
                      <FaEdit className="mr-2" /> Edit
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectListPage;