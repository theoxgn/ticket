import React, { useState, useEffect } from 'react';
import { FaChartLine, FaTasks, FaUsers, FaCheck } from 'react-icons/fa';
import api from '../../services/api';

const ProjectProgress = ({ projectId }) => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/projects/${projectId}/progress`);
        setProgressData(response.data.data);
      } catch (err) {
        console.error('Error fetching project progress:', err);
        setError('Gagal memuat data progres proyek');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProgress();
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-2 bg-gray-200 rounded w-full mb-4"></div>
        <div className="grid grid-cols-3 gap-2">
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-red-700 mb-4">
        <p>{error}</p>
      </div>
    );
  }

  if (!progressData) {
    return null;
  }

  const { totalTasks, completedTasks, membersCount, progressPercentage } = progressData;

  return (
    <div className="p-4 mb-4">
      <h3 className="text-md font-semibold text-secondary-800 mb-4 pb-2 border-b border-secondary-200 flex items-center">
        <FaChartLine className="mr-2 text-gray-700" /> Progres Proyek
      </h3>
      
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-secondary-700">Penyelesaian</span>
          <span className="text-sm font-medium text-primary-700">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProjectProgress;