import { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './UsersPage.css';

const UsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'viewer'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUsers();
      setUsers(response.data);
    } catch (err) {
      console.error('Error loading users:', err);
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setFormData({ name: '', email: '', password: '', role: 'viewer' });
    setShowCreateModal(true);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Don't populate password for security
      role: user.role
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser(formData);
      setShowCreateModal(false);
      loadUsers();
      alert('User created successfully!');
    } catch (err) {
      alert(`Failed to create user: ${err.message}`);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Only send fields that have values (don't include empty password)
      const updateData = {
        name: formData.name,
        email: formData.email,
        role: formData.role
      };

      await updateUser(selectedUser.id, updateData);
      setShowEditModal(false);
      loadUsers();
      alert('User updated successfully!');
    } catch (err) {
      alert(`Failed to update user: ${err.message}`);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteUser(selectedUser.id);
      setShowDeleteModal(false);
      loadUsers();
      alert('User deleted successfully!');
    } catch (err) {
      alert(`Failed to delete user: ${err.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleBadgeClass = (role) => {
    const classes = {
      admin: 'role-badge-admin',
      editor: 'role-badge-editor',
      viewer: 'role-badge-viewer'
    };
    return classes[role] || 'role-badge-viewer';
  };

  const formatRole = (role) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  if (loading) {
    return (
      <div className="users-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users-page">
        <div className="error-state">
          <h2>Error Loading Users</h2>
          <p>{error}</p>
          <button onClick={loadUsers} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1>User Management</h1>
          <p className="subtitle">Manage team members and their permissions</p>
        </div>
        <button onClick={handleCreateClick} className="create-user-button">
          + Add New User
        </button>
      </div>

      <div className="users-stats">
        <div className="stat-item">
          <span className="stat-label">Total Users</span>
          <span className="stat-value">{users.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Admins</span>
          <span className="stat-value">{users.filter(u => u.role === 'admin').length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Editors</span>
          <span className="stat-value">{users.filter(u => u.role === 'editor').length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Viewers</span>
          <span className="stat-value">{users.filter(u => u.role === 'viewer').length}</span>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="user-name-cell">
                    {user.name}
                    {currentUser && user.id === currentUser.id && (
                      <span className="you-badge">You</span>
                    )}
                  </div>
                </td>
                <td className="email-cell">{user.email}</td>
                <td>
                  <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                    {formatRole(user.role)}
                  </span>
                </td>
                <td className="date-cell">{formatDate(user.created_at)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="edit-button"
                      title="Edit user"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(user)}
                      className="delete-button"
                      disabled={currentUser && user.id === currentUser.id}
                      title={currentUser && user.id === currentUser.id ? "Cannot delete yourself" : "Delete user"}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="no-users">
            <p>No users found.</p>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New User</h2>
              <button onClick={() => setShowCreateModal(false)} className="modal-close">
                ×
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="user-form">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="user@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength="6"
                  placeholder="Minimum 6 characters"
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Role *</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="viewer">Viewer - Can view data only</option>
                  <option value="editor">Editor - Can create and edit</option>
                  <option value="admin">Admin - Full access</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit User</h2>
              <button onClick={() => setShowEditModal(false)} className="modal-close">
                ×
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="user-form">
              <div className="form-group">
                <label htmlFor="edit-name">Name *</label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-email">Email *</label>
                <input
                  type="email"
                  id="edit-email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="user@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-role">Role *</label>
                <select
                  id="edit-role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="viewer">Viewer - Can view data only</option>
                  <option value="editor">Editor - Can create and edit</option>
                  <option value="admin">Admin - Full access</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditModal(false)} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete User</h2>
              <button onClick={() => setShowDeleteModal(false)} className="modal-close">
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{selectedUser.name}</strong>?</p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="cancel-button">
                Cancel
              </button>
              <button onClick={handleDeleteConfirm} className="delete-confirm-button">
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
