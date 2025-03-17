// src/GetUsersPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GetUsersPage() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/students');
      setUsers(response.data);
    } catch (error) {
      setMessage('Error fetching users');
    }
  };

  // Fetch users when the component mounts.
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">All Registered Users</h1>
      {message && <p className="text-red-600">{message}</p>}
      <div className="w-full max-w-3xl bg-white p-6 rounded shadow-md">
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b">First Name</th>
                <th className="px-6 py-3 border-b">Last Name</th>
                <th className="px-6 py-3 border-b">Email</th>
                <th className="px-6 py-3 border-b">DOB</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 border-b">{user.firstName}</td>
                  <td className="px-6 py-4 border-b">{user.lastName}</td>
                  <td className="px-6 py-4 border-b">{user.email}</td>
                  <td className="px-6 py-4 border-b">{new Date(user.dob).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default GetUsersPage;
