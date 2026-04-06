import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/user.service';
import UserList from '../components/Users/UserList';
import UserForm from '../components/Users/UserForm';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { UserPlusIcon } from '@heroicons/react/24/outline';

const Users = () => {
  const { hasRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    if (hasRole('admin')) {
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (id, data) => {
    try {
      await userService.updateUser(id, data);
      fetchUsers();
      setShowForm(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  if (!hasRole('admin')) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">You don't have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-2">Manage system users and their roles</p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <UserPlusIcon className="h-5 w-5 mr-2" />
          Add User
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <UserList
          users={users}
          onEdit={handleEdit}
          onDelete={handleDeleteUser}
        />
      )}

      {showForm && (
        <UserForm
          user={editingUser}
          onSubmit={handleUpdateUser}
          onClose={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
};

export default Users;