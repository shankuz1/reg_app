// src/DeleteUserPage.jsx

import React, { useState } from 'react';
import axios from 'axios';

function DeleteUserPage() {
  const [credentials, setCredentials] = useState({ email: '', firstName: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      // For DELETE requests with a request body, pass the data in the config's data property.
      const response = await axios.delete('http://localhost:3000/deleteUser', { data: credentials });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error deleting user');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Delete User</h1>
      <form onSubmit={handleDelete} className="space-y-4 bg-white p-6 rounded shadow-md w-full max-w-md">
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700">First Name</label>
          <input
            type="text"
            name="firstName"
            value={credentials.firstName}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>
        <button type="submit" className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600">
          Delete User
        </button>
      </form>
      {message && <p className="mt-4 text-red-600">{message}</p>}
    </div>
  );
}

export default DeleteUserPage;
