
import React, { useState } from 'react';
import axios from 'axios';

function RegistrationPage() {
  const [student, setStudent] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/register', student);
      setMessage(`Student ${response.data.firstName} registered successfully!`);
      setStudent({ firstName: '', lastName: '', email: '', dob: '' });
    } catch (error) {
      setMessage('Error registering student');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Student Registration</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md w-full max-w-md">
        <div>
          <label className="block text-gray-700">First Name</label>
          <input
            type="text"
            name="firstName"
            value={student.firstName}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={student.lastName}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={student.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={student.dob}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>
        <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">
          Register Student
        </button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}

export default RegistrationPage;
