// frontend/src/pages/profile/ProfilePage.js
import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FaUser, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const styles = {
  container: {
    padding: '0 1rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  heading: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '1.5rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #e2e8f0'
  },
  profileContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '2rem'
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: '#e6f0fb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    fontWeight: '600',
    color: '#3182ce',
    marginBottom: '1rem'
  },
  profileName: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '0.5rem'
  },
  profileUsername: {
    fontSize: '1rem',
    color: '#718096',
    marginBottom: '1rem'
  },
  profileRole: {
    backgroundColor: '#e6f0fb',
    color: '#3182ce',
    padding: '0.25rem 1rem',
    borderRadius: '1rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    display: 'inline-block'
  },
  createdAt: {
    marginTop: '1.5rem',
    fontSize: '0.875rem',
    color: '#718096'
  },
  editProfileCard: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    padding: '2rem'
  },
  editHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  editIcon: {
    color: '#3182ce',
    marginRight: '0.5rem'
  },
  editTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2d3748'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  },
  formGroup: {
    marginBottom: '1.5rem'
  },
  formLabel: {
    display: 'block',
    fontWeight: '500',
    marginBottom: '0.5rem',
    color: '#4a5568'
  },
  formInput: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.375rem',
    border: '1px solid #cbd5e0',
    backgroundColor: '#fff',
    color: '#2d3748',
    transition: 'border-color 0.2s, box-shadow 0.2s'
  },
  saveButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.625rem 1.25rem',
    backgroundColor: '#3182ce',
    color: 'white',
    borderRadius: '0.375rem',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginLeft: 'auto'
  },
  buttonIcon: {
    marginRight: '0.5rem'
  }
};

const ProfilePage = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    username: user.username || '',
    email: user.email || ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const getInitials = () => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Profil Anda</h1>

      <div style={styles.profileContainer}>
        <div style={styles.profileCard}>
          <div style={styles.avatar}>
            {getInitials()}
          </div>
          <h2 style={styles.profileName}>{user.firstName} {user.lastName}</h2>
          <p style={styles.profileUsername}>@{user.username}</p>
          <span style={styles.profileRole}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
          <div style={styles.createdAt}>
            <p>Akun dibuat pada:</p>
            <p>{formatDate(user.createdAt)}</p>
          </div>
        </div>

        <div style={styles.editProfileCard}>
          <div style={styles.editHeader}>
            <FaEdit style={styles.editIcon} />
            <h3 style={styles.editTitle}>Edit Profil</h3>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label htmlFor="firstName" style={styles.formLabel}>
                  Nama Depan
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  style={styles.formInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="lastName" style={styles.formLabel}>
                  Nama Belakang
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  style={styles.formInput}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="username" style={styles.formLabel}>
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                style={styles.formInput}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.formLabel}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.formInput}
                required
              />
            </div>

            <button type="submit" style={styles.saveButton}>
              <FaSave style={styles.buttonIcon} />
              Simpan Perubahan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;