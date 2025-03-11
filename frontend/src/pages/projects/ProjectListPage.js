// frontend/src/pages/projects/ProjectListPage.js
import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProjectContext } from '../../context/ProjectContext';
import { 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaUsers, 
  FaCalendarAlt, 
  FaProjectDiagram,
  FaTasks
} from 'react-icons/fa';

const ProjectListPage = () => {
  const { projects, loading, getProjects } = useContext(ProjectContext);

  useEffect(() => {
    getProjects();
  }, []);

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
        <Link 
          to="/projects/new" 
          className="btn btn-primary flex items-center mt-4 md:mt-0 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 hover:shadow-lg transition-all duration-300"
        >
          <FaPlus className="mr-2" /> Proyek Baru
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-8 text-center border border-secondary-100">
          <div className="flex justify-center mb-6">
            <FaProjectDiagram className="text-primary-500 text-6xl opacity-70" />
          </div>
          <p className="text-secondary-600 mb-4 text-lg">Belum ada proyek yang dibuat.</p>
          <Link 
            to="/projects/new" 
            className="btn btn-primary inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 hover:shadow-lg transition-all duration-300"
          >
            <FaPlus className="mr-2" /> Buat Proyek Pertama
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
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
                  <span className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full border border-primary-200 flex items-center">
                    <FaTasks className="mr-1" /> {project.status || 'Active'}
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
                    <span>Terakhir diupdate: {new Date().toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <Link
                    to={`/projects/${project.id}`}
                    className="btn btn-primary flex items-center justify-center py-2 px-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-all duration-300"
                  >
                    <FaEye className="mr-2" /> Detail
                  </Link>
                  <Link
                    to={`/projects/${project.id}/edit`}
                    className="btn btn-secondary flex items-center justify-center py-2 px-3 bg-secondary-100 text-secondary-700 rounded-md border border-secondary-300 hover:bg-secondary-200 transition-all duration-300"
                  >
                    <FaEdit className="mr-2" /> Edit
                  </Link>
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