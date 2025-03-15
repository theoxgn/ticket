// Member component for ProjectDetailsPage.js
import React, { useState } from 'react';
import { FaUsersCog, FaUserMinus, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { removeUserFromProject } from '../../services/projectService';

const TeamMemberSection = ({ 
  currentProject, 
  isAdmin, 
  members, 
  loading, 
  handleAddTeamMember, 
  getProject 
}) => {
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [userToRemove, setUserToRemove] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveMember = async () => {
    if (!userToRemove || !currentProject) return;
    
    setIsRemoving(true);
    try {
      await removeUserFromProject(currentProject.id, userToRemove.id);
      toast.success(`${userToRemove.firstName} ${userToRemove.lastName} telah dihapus dari proyek`);
      getProject(currentProject.id); // Refresh project data
      setShowRemoveModal(false);
      setUserToRemove(null);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Gagal menghapus anggota tim';
      toast.error(errorMsg);
    } finally {
      setIsRemoving(false);
    }
  };

  const openRemoveModal = (member) => {
    setUserToRemove(member);
    setShowRemoveModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden lg:border-r lg:pr-4">
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-blue-100">
        <h2 className="text-md font-semibold text-gray-800 flex items-center">
          <FaUsersCog className="mr-2 text-blue-600" /> Anggota Tim
        </h2>
        {isAdmin && (
          <button 
            className="flex items-center px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm"
            onClick={handleAddTeamMember}
          >
            <span className="mr-1">+</span> Tambah Anggota
          </button>
        )}
      </div>
      <div className="p-4">
        {members?.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-secondary-50 p-6 rounded-lg inline-block mb-3">
              <FaUsersCog className="text-secondary-400 text-4xl mx-auto" />
            </div>
            <p className="text-secondary-500 mb-4">Belum ada anggota tim.</p>
            {isAdmin && (
              <button 
                className="btn btn-primary inline-flex items-center bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                onClick={handleAddTeamMember}
              >
                <span className="mr-2">+</span> Tambah Anggota Tim
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
            {members.map(member => (
              <div 
                key={member.id} 
                className="flex items-center justify-between p-3 bg-white border border-secondary-100 hover:border-primary-200 hover:bg-primary-50 rounded-lg transition-all shadow-sm"
              >
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white h-10 w-10 rounded-full flex items-center justify-center font-medium shadow-sm">
                    {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-secondary-800">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-sm text-secondary-500">@{member.username}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs rounded-full capitalize font-medium border border-primary-200 mr-2">
                    {member.UserProject?.role || 'member'}
                  </span>
                  {isAdmin && (
                    <button
                      onClick={() => openRemoveModal(member)}
                      className="p-2 text-secondary-500 hover:text-danger-600 hover:bg-danger-100 rounded-full transition-colors"
                      title="Hapus dari proyek"
                    >
                      <FaUserMinus />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Remove Member Modal */}
      {showRemoveModal && userToRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-xl animate-fadeIn">
            <div className="p-6 border-b border-secondary-200">
              <div className="flex items-center text-danger-600 mb-4">
                <FaExclamationTriangle className="text-2xl mr-3" />
                <h3 className="text-xl font-semibold">Hapus Anggota Tim</h3>
              </div>
              
              <p className="text-secondary-700 mb-2">
                Apakah Anda yakin ingin menghapus anggota tim berikut dari proyek ini?
              </p>
              
              <div className="bg-secondary-50 p-4 rounded-lg flex items-center mb-4">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white h-10 w-10 rounded-full flex items-center justify-center font-medium shadow-sm">
                  {userToRemove.firstName.charAt(0)}{userToRemove.lastName.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-secondary-800">
                    {userToRemove.firstName} {userToRemove.lastName}
                  </p>
                  <p className="text-sm text-secondary-500">@{userToRemove.username}</p>
                </div>
              </div>
              
              <p className="text-danger-600 text-sm flex items-center mb-4">
                <FaExclamationTriangle className="mr-2" />
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            
            <div className="flex justify-end gap-4 p-6">
              <button
                onClick={() => setShowRemoveModal(false)}
                className="px-5 py-2.5 border border-secondary-300 bg-white text-secondary-700 rounded-md font-medium hover:bg-secondary-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleRemoveMember}
                disabled={isRemoving}
                className="px-5 py-2.5 bg-danger-600 text-white rounded-md font-medium hover:bg-danger-700 transition-colors flex items-center"
              >
                {isRemoving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </>
                ) : (
                  <>
                    <FaTrash className="mr-2" />
                    Hapus Anggota
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMemberSection;