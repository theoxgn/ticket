// frontend/src/pages/projects/ProjectListPage.js
import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProjectContext } from '../../context/ProjectContext';
import { FaPlus, FaEye, FaEdit, FaUsers } from 'react-icons/fa';

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
        <Link to="/projects/new" className="btn btn-primary flex items-center mt-4 md:mt-0">
          <FaPlus className="mr-2" /> Proyek Baru
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-secondary-600 mb-4">Belum ada proyek yang dibuat.</p>
          <Link to="/projects/new" className="btn btn-primary inline-flex items-center">
            <FaPlus className="mr-2" /> Buat Proyek Pertama
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="border-b border-secondary-200 px-4 py-3 flex justify-between items-center">
                <h2 className="font-semibold text-secondary-800">{project.name}</h2>
                <span className="px-2 py-1 bg-secondary-100 text-secondary-800 text-xs rounded-full">
                  {project.key}
                </span>
              </div>
              <div className="p-4">
                <p className="text-secondary-600 mb-4 h-20 overflow-hidden">
                  {project.description ? (
                    project.description.length > 120 ? (
                      `${project.description.substring(0, 120)}...`
                    ) : (
                      project.description
                    )
                  ) : (
                    <span className="text-secondary-400 italic">Tidak ada deskripsi</span>
                  )}
                </p>
                <div className="flex items-center text-secondary-500 text-sm mb-4">
                  <FaUsers className="mr-2" />
                  <span>{project.members?.length || 0} anggota tim</span>
                </div>
                <div className="flex justify-between mt-2">
                  <Link
                    to={`/projects/${project.id}`}
                    className="btn btn-primary flex items-center"
                  >
                    <FaEye className="mr-2" /> Detail
                  </Link>
                  <Link
                    to={`/projects/${project.id}/edit`}
                    className="btn btn-secondary flex items-center"
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