// frontend/src/pages/users/UserListPage.js
import React, { useEffect, useState, useContext } from 'react';
import { FaSearch, FaUserCog, FaCheck, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { getAllUsers } from '../../services/userService';
import { toast } from 'react-toastify';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    // Cek apakah user adalah admin atau manager
    if (currentUser && !['admin', 'manager'].includes(currentUser.role)) {
      toast.error('Anda tidak memiliki akses ke halaman ini');
      return;
    }

    fetchUsers();
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error('Gagal memuat daftar pengguna');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return (
      fullName.includes(search) ||
      user.username.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.role.toLowerCase().includes(search)
    );
  });

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
        <h1 className="text-2xl font-bold text-secondary-800">Manajemen Pengguna</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-secondary-400" />
            </div>
            <input
              type="text"
              className="form-input pl-10 w-full"
              placeholder="Cari pengguna berdasarkan nama, username, email, atau role"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Nama
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Username
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-secondary-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-medium">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-secondary-900">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                    @{user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full
                      ${user.role === 'admin' ? 'bg-danger-100 text-danger-800' :
                        user.role === 'manager' ? 'bg-primary-100 text-primary-800' :
                        user.role === 'developer' ? 'bg-success-100 text-success-800' :
                        'bg-secondary-100 text-secondary-800'}`}
                    >
                      {user.role === 'admin' ? 'Admin' :
                        user.role === 'manager' ? 'Manager' :
                        user.role === 'developer' ? 'Developer' :
                        'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.isActive ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-success-100 text-success-800 flex items-center w-min">
                        <FaCheck className="mr-1" /> Aktif
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-danger-100 text-danger-800 flex items-center w-min">
                        <FaTimes className="mr-1" /> Nonaktif
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserListPage;