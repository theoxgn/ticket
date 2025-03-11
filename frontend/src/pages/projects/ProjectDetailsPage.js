// frontend/src/pages/projects/ProjectDetailsPage.js
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ProjectContext } from '../../context/ProjectContext';
import { AuthContext } from '../../context/AuthContext';
import { UserContext } from '../../context/UserContext';
import { 
  FaEdit, 
  FaPlus, 
  FaUsers, 
  FaTicketAlt, 
  FaArrowLeft, 
  FaTimes, 
  FaSearch,
  FaInfoCircle,
  FaCalendarAlt,
  FaLink,
  FaTasks,
  FaClipboardList,
  FaUsersCog
} from 'react-icons/fa';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { currentProject, loading, getProject, clearCurrentProject, addUserToProject } = useContext(ProjectContext);
  const { users, loading: usersLoading, getUsers } = useContext(UserContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  
  // States for add team member modal
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('member');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Stats calculations
  const [projectStats, setProjectStats] = useState({
    totalMembers: 0,
    totalTickets: 0,
    openTickets: 0,
    completedTickets: 0
  });

  useEffect(() => {
    getProject(id);

    return () => {
      clearCurrentProject();
    };
  }, [id]);

  // Fetch all users when modal is opened
  useEffect(() => {
    if (showAddMemberModal) {
      getUsers();
    }
  }, [showAddMemberModal]);

  // Calculate project stats
  useEffect(() => {
    if (currentProject) {
      const memberCount = currentProject.members?.length || 0;
      const ticketCount = currentProject.tickets?.length || 0;
      const openTicketCount = currentProject.tickets?.filter(ticket => 
        ticket.status === 'open' || ticket.status === 'in_progress'
      ).length || 0;
      const completedTicketCount = currentProject.tickets?.filter(ticket => 
        ticket.status === 'resolved' || ticket.status === 'closed'
      ).length || 0;

      setProjectStats({
        totalMembers: memberCount,
        totalTickets: ticketCount,
        openTickets: openTicketCount,
        completedTickets: completedTicketCount
      });
    }
  }, [currentProject]);

  // Filter users that are not already members of the project
  useEffect(() => {
    if (users && currentProject && currentProject.members) {
      const existingMemberIds = currentProject.members.map(member => member.id);
      const availableUsers = users.filter(user => !existingMemberIds.includes(user.id));
      setFilteredUsers(availableUsers);
      
      // Apply search filter if there's a search term
      if (searchTerm && searchTerm.length >= 2) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const results = availableUsers.filter(user => 
          user.firstName.toLowerCase().includes(lowerCaseSearchTerm) || 
          user.lastName.toLowerCase().includes(lowerCaseSearchTerm) || 
          user.username.toLowerCase().includes(lowerCaseSearchTerm)
        );
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }
  }, [users, currentProject, searchTerm]);

  useEffect(() => {
    if (currentProject && user) {
      console.log("DEBUG - Current user:", user);
      console.log("DEBUG - User global role:", user.role);
      console.log("DEBUG - Project members:", currentProject.members);
      
      // Cari user dalam anggota proyek
      const projectMember = currentProject.members?.find(member => member.id === user.id);
      console.log("DEBUG - Found user in project members:", projectMember);
      
      // Dapatkan peran dalam proyek ini
      const projectRole = projectMember?.UserProject?.role;
      console.log("DEBUG - User project role:", projectRole);
      
      // Set state berdasarkan peran
      setIsOwner(projectRole === 'owner');
      
      // User adalah admin proyek jika: admin sistem ATAU owner/manager proyek
      const isProjectAdmin = 
        user.role === 'admin' || 
        user.role === 'owner' || 
        user.role === 'manager' ||
        projectRole === 'owner' || 
        projectRole === 'manager';
      
      setIsAdmin(isProjectAdmin);
      
      console.log("DEBUG - Final permission states:");
      console.log("  isManager:", projectRole === 'manager');
      console.log("  isOwner:", projectRole === 'owner');
      console.log("  isAdmin:", isProjectAdmin);
    }
  }, [currentProject, user]);

  // Function to add team member
  const addTeamMember = async () => {
    if (!selectedUser) {
      toast.warn('Silakan pilih pengguna terlebih dahulu');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Gunakan addUserToProject dari ProjectContext
      await addUserToProject(currentProject.id, {
        userId: selectedUser.id,
        role: selectedRole
      });
      
      toast.success(`${selectedUser.firstName} ${selectedUser.lastName} berhasil ditambahkan ke proyek`);
      
      // Reset dan tutup modal
      setShowAddMemberModal(false);
      setSelectedUser(null);
      setSearchTerm('');
      setSearchResults([]);
      setSelectedRole('member');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Gagal menambahkan anggota tim';
      toast.error(errorMsg);
      console.error('Error adding team member:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTeamMember = () => {
    setShowAddMemberModal(true);
  };

  // Get status badge style
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-secondary-100 text-secondary-800';
    }
  };

  // Get priority badge style
  const getPriorityBadgeClass = (priority) => {
    if (priority === 'highest' || priority === 'high') {
      return 'bg-danger-100 text-danger-700';
    } else if (priority === 'medium') {
      return 'bg-warning-100 text-warning-700';
    } else {
      return 'bg-info-100 text-info-700';
    }
  };

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
        <Link to="/projects" className="text-primary-600 hover:text-primary-700 flex items-center transition-colors">
          <FaArrowLeft className="mr-2" /> Kembali ke Daftar Proyek
        </Link>
      </div>
      
      {/* Project Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-md overflow-hidden mb-6 text-white">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold">{currentProject.name}</h1>
                <span className="ml-3 px-3 py-1 bg-white bg-opacity-20 text-white text-sm rounded-full">
                  {currentProject.key}
                </span>
              </div>
              <p className="mt-1 flex items-center">
                {currentProject.isActive ? (
                  <>
                    <span className="inline-block h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                    <span>Aktif</span>
                  </>
                ) : (
                  <>
                    <span className="inline-block h-2 w-2 rounded-full bg-red-400 mr-2"></span>
                    <span>Tidak Aktif</span>
                  </>
                )}
              </p>
            </div>
            
            {isAdmin && (
              <Link 
                to={`/projects/${currentProject.id}/edit`} 
                className="px-4 py-2 bg-white text-primary-700 rounded-md font-medium hover:bg-opacity-90 transition-colors flex items-center shadow-sm"
              >
                <FaEdit className="mr-2" /> Edit Proyek
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content - New Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Column - Project Stats */}
        <div className="lg:col-span-1">
          {/* Project Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-primary-500 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-primary-600 uppercase">
                    Total Anggota
                  </div>
                  <div className="text-2xl font-semibold">{projectStats.totalMembers}</div>
                </div>
                <div className="p-3 bg-primary-100 rounded-full">
                  <FaUsers className="text-primary-500 text-xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-info-500 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-info-600 uppercase">
                    Total Tiket
                  </div>
                  <div className="text-2xl font-semibold">{projectStats.totalTickets}</div>
                </div>
                <div className="p-3 bg-info-100 rounded-full">
                  <FaTicketAlt className="text-info-500 text-xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-warning-500 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-warning-600 uppercase">
                    Tiket Terbuka
                  </div>
                  <div className="text-2xl font-semibold">{projectStats.openTickets}</div>
                </div>
                <div className="p-3 bg-warning-100 rounded-full">
                  <FaTasks className="text-warning-500 text-xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-success-500 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-success-600 uppercase">
                    Tiket Selesai
                  </div>
                  <div className="text-2xl font-semibold">{projectStats.completedTickets}</div>
                </div>
                <div className="p-3 bg-success-100 rounded-full">
                  <FaClipboardList className="text-success-500 text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Project Details */}
        <div className="lg:col-span-2">
          {/* Project Description */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-secondary-200 bg-gradient-to-r from-primary-50 to-primary-100">
              <h3 className="text-lg font-semibold text-secondary-800 flex items-center">
                <FaInfoCircle className="mr-2 text-primary-600" /> Detail Proyek
              </h3>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-md font-medium text-secondary-700 mb-2">Deskripsi</h4>
                <div className="bg-secondary-50 p-4 rounded-lg border border-secondary-100">
                  <div className="prose max-w-none text-secondary-600">
                    {currentProject.description ? (
                      <p>{currentProject.description}</p>
                    ) : (
                      <p className="italic text-secondary-400">Tidak ada deskripsi</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-secondary-50 p-4 rounded-lg border border-secondary-100">
                  <h4 className="text-sm font-medium text-secondary-700 mb-3 pb-2 border-b border-secondary-200">Informasi Dasar</h4>
                  <div className="space-y-3">
                    <div className="flex items-center text-secondary-700">
                      <div className="p-1.5 bg-primary-100 rounded-full mr-3">
                        <FaCalendarAlt className="text-primary-600 text-sm" />
                      </div>
                      <div>
                        <span className="text-xs text-secondary-500 block">Dibuat Pada</span>
                        <span className="text-sm font-medium">
                          {new Date(currentProject.createdAt || Date.now()).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </div>
                    
                    {currentProject.updatedAt && (
                      <div className="flex items-center text-secondary-700">
                        <div className="p-1.5 bg-primary-100 rounded-full mr-3">
                          <FaCalendarAlt className="text-primary-600 text-sm" />
                        </div>
                        <div>
                          <span className="text-xs text-secondary-500 block">Terakhir Diperbarui</span>
                          <span className="text-sm font-medium">
                            {new Date(currentProject.updatedAt).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-secondary-50 p-4 rounded-lg border border-secondary-100">
                  <h4 className="text-sm font-medium text-secondary-700 mb-3 pb-2 border-b border-secondary-200">Detail Lainnya</h4>
                  <div className="space-y-3">
                    <div className="flex items-center text-secondary-700">
                      <div className="p-1.5 bg-primary-100 rounded-full mr-3">
                        <FaTicketAlt className="text-primary-600 text-sm" />
                      </div>
                      <div>
                        <span className="text-xs text-secondary-500 block">Total Tiket</span>
                        <span className="text-sm font-medium">
                          {projectStats.totalTickets} Tiket
                        </span>
                      </div>
                    </div>
                    
                    {currentProject.url && (
                      <div className="flex items-center text-secondary-700">
                        <div className="p-1.5 bg-primary-100 rounded-full mr-3">
                          <FaLink className="text-primary-600 text-sm" />
                        </div>
                        <div>
                          <span className="text-xs text-secondary-500 block">URL Proyek</span>
                          <a 
                            href={currentProject.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
                          >
                            {currentProject.url}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Team Members and Tickets Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Team Members */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-secondary-200 flex justify-between items-center bg-gradient-to-r from-primary-50 to-primary-100">
            <h2 className="text-lg font-semibold text-secondary-800 flex items-center">
              <FaUsersCog className="mr-2 text-primary-600" /> Anggota Tim
            </h2>
            {/* Allow adding members if the user is an admin, owner, OR manager */}
            {isAdmin && (
              <button 
                className="flex items-center px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm"
                onClick={handleAddTeamMember}
              >
                <FaPlus className="mr-1" /> <span>Tambah Anggota</span>
              </button>
            )}
          </div>
          <div className="p-6">
            {currentProject.members?.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-secondary-50 p-6 rounded-lg inline-block mb-3">
                  <FaUsers className="text-secondary-400 text-4xl mx-auto" />
                </div>
                <p className="text-secondary-500 mb-4">Belum ada anggota tim.</p>
                {isAdmin && (
                  <button 
                    className="btn btn-primary inline-flex items-center bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                    onClick={handleAddTeamMember}
                  >
                    <FaPlus className="mr-2" /> Tambah Anggota Tim
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {currentProject.members?.map(member => (
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
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs rounded-full capitalize font-medium border border-primary-200">
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
          <div className="px-6 py-4 border-b border-secondary-200 flex justify-between items-center bg-gradient-to-r from-primary-50 to-primary-100">
            <h2 className="text-lg font-semibold text-secondary-800 flex items-center">
              <FaTicketAlt className="mr-2 text-primary-600" /> Tiket
            </h2>
            <Link 
              to="/tickets/new" 
              state={{ projectId: currentProject.id }}
              className="flex items-center px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm"
            >
              <FaPlus className="mr-1" /> <span>Buat Tiket</span>
            </Link>
          </div>
          <div className="p-6">
            {currentProject.tickets?.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-secondary-50 p-6 rounded-lg inline-block mb-3">
                  <FaTicketAlt className="text-secondary-400 text-4xl mx-auto" />
                </div>
                <p className="text-secondary-500 mb-4">Belum ada tiket untuk proyek ini.</p>
                <Link 
                  to="/tickets/new" 
                  state={{ projectId: currentProject.id }}
                  className="btn btn-primary inline-flex items-center bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
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
                    className="block p-4 rounded-lg hover:bg-primary-50 border border-secondary-100 hover:border-primary-200 transition-all shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded font-medium mr-2">
                          {ticket.ticketKey}
                        </span>
                        <h3 className="font-medium text-secondary-800 line-clamp-1">
                          {ticket.title}
                        </h3>
                      </div>
                      <span className={`text-xs font-semibold py-1 px-2 rounded-full ${getPriorityBadgeClass(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <div className="flex items-center mt-3 text-sm">
                      <span className={`py-1 px-2 rounded-full text-xs font-medium ${getStatusBadgeClass(ticket.status)}`}>
                        {ticket.status}
                      </span>
                      {ticket.assignee ? (
                        <div className="flex items-center ml-3">
                          <div className="bg-primary-100 text-primary-700 h-5 w-5 rounded-full flex items-center justify-center text-xs font-medium mr-1">
                            {ticket.assignee.firstName.charAt(0)}{ticket.assignee.lastName.charAt(0)}
                          </div>
                          <span className="text-secondary-600">
                            {ticket.assignee.firstName} {ticket.assignee.lastName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-secondary-500 ml-3 text-xs italic">
                          Belum ditugaskan
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Team Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg shadow-xl animate-fadeIn">
            <div className="p-6 border-b border-secondary-200 flex justify-between items-center bg-gradient-to-r from-primary-50 to-primary-100">
              <h3 className="text-xl font-semibold text-secondary-800 flex items-center">
                <FaUsers className="mr-2 text-primary-600" /> Tambah Anggota Tim
              </h3>
              <button 
                onClick={() => setShowAddMemberModal(false)}
                className="text-secondary-500 hover:text-secondary-700 bg-white p-2 rounded-full hover:bg-secondary-100 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="p-6">
              {/* Search User */}
              <div className="mb-4">
                <label htmlFor="search" className="block text-secondary-700 mb-2 font-medium">Cari Pengguna</label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari berdasarkan nama atau username"
                    className="form-input w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-secondary-400" />
                  </div>
                </div>
              </div>
              
              {/* Selected User */}
              {selectedUser && (
                <div className="mb-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white h-10 w-10 rounded-full flex items-center justify-center font-medium shadow-sm">
                        {selectedUser.firstName.charAt(0)}{selectedUser.lastName.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-secondary-800">
                          {selectedUser.firstName} {selectedUser.lastName}
                        </p>
                        <p className="text-sm text-secondary-500">@{selectedUser.username}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedUser(null)}
                      className="text-secondary-500 hover:text-secondary-700 bg-white p-1 rounded-full hover:bg-secondary-100 transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              )}
              {/* User List */}
              <div className="mb-6">
                <h4 className="font-medium text-secondary-700 mb-2">Pengguna Tersedia</h4>
                {usersLoading ? (
                  <div className="flex justify-center my-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-6 bg-secondary-50 rounded-lg border border-secondary-200">
                    <FaUsers className="text-secondary-400 text-3xl mx-auto mb-2" />
                    <p className="text-secondary-500">Tidak ada pengguna tersedia untuk ditambahkan</p>
                  </div>
                ) : (
                  <div className="border border-secondary-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto shadow-inner">
                    {/* Jika ada pencarian, tampilkan hasil pencarian */}
                    {searchTerm.length >= 2 && searchResults.length > 0 ? (
                      searchResults.map(user => (
                        <div 
                          key={user.id} 
                          className={`p-3 hover:bg-primary-50 cursor-pointer border-b border-secondary-100 transition-colors ${
                            selectedUser?.id === user.id ? 'bg-primary-50 border-primary-200' : ''
                          }`}
                          onClick={() => setSelectedUser(user)}
                        >
                          <div className="flex items-center">
                            <div className="bg-primary-100 text-primary-700 h-8 w-8 rounded-full flex items-center justify-center font-medium text-sm">
                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </div>
                            <div className="ml-3">
                              <p className="font-medium text-secondary-800">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-xs text-secondary-500">@{user.username}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : searchTerm.length >= 2 && searchResults.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-secondary-500">Tidak ada hasil pencarian</p>
                      </div>
                    ) : (
                      /* Jika tidak ada pencarian, tampilkan semua user */
                      filteredUsers.map(user => (
                        <div 
                          key={user.id} 
                          className={`p-3 hover:bg-primary-50 cursor-pointer border-b border-secondary-100 transition-colors ${
                            selectedUser?.id === user.id ? 'bg-primary-50 border-primary-200' : ''
                          }`}
                          onClick={() => setSelectedUser(user)}
                        >
                          <div className="flex items-center">
                            <div className="bg-primary-100 text-primary-700 h-8 w-8 rounded-full flex items-center justify-center font-medium text-sm">
                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </div>
                            <div className="ml-3">
                              <p className="font-medium text-secondary-800">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-xs text-secondary-500">@{user.username}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              
              {/* Role Selection */}
              <div className="mb-6">
                <label htmlFor="role" className="block text-secondary-700 font-medium mb-2">Peran dalam Proyek</label>
                <div className="relative">
                  <select
                    id="role"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="form-select appearance-none w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                  >
                    <option value="member">Anggota</option>
                    <option value="manager">Manajer</option>
                    {isOwner && <option value="owner">Pemilik</option>}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-secondary-500">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                <div className="mt-3 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                  {selectedRole === 'owner' ? (
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1 p-1 bg-primary-100 rounded-full">
                        <svg className="h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="ml-2 text-sm text-secondary-700">
                        <span className="font-bold block mb-1 text-primary-700">Pemilik</span>
                        Memiliki akses penuh untuk mengelola proyek, termasuk mengedit detail proyek, 
                        menambah/menghapus anggota tim, serta mengelola semua tiket.
                      </p>
                    </div>
                  ) : selectedRole === 'manager' ? (
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1 p-1 bg-primary-100 rounded-full">
                        <svg className="h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                      </div>
                      <p className="ml-2 text-sm text-secondary-700">
                        <span className="font-bold block mb-1 text-primary-700">Manajer</span>
                        Dapat mengelola tiket dan anggota tim, membuat perubahan pada status dan prioritas, 
                        tetapi tidak dapat menghapus proyek.
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1 p-1 bg-primary-100 rounded-full">
                        <svg className="h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                      </div>
                      <p className="ml-2 text-sm text-secondary-700">
                        <span className="font-bold block mb-1 text-primary-700">Anggota</span>
                        Dapat melihat dan berkontribusi pada proyek, menangani tiket, menambahkan komentar, 
                        serta memperbarui status tiket yang ditugaskan.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-4 p-6 border-t border-secondary-200">
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="px-5 py-2.5 border border-secondary-300 bg-white text-secondary-700 rounded-md font-medium hover:bg-secondary-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
              >
                Batal
              </button>
              <button
                onClick={addTeamMember}
                disabled={!selectedUser || isSubmitting}
                className={`px-5 py-2.5 rounded-md font-medium flex items-center justify-center min-w-[120px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-sm ${
                  !selectedUser || isSubmitting
                    ? 'bg-primary-400 text-white cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses
                  </>
                ) : (
                  <>
                    <FaPlus className="mr-2" />
                    Tambahkan
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

export default ProjectDetailsPage;