// src/App.jsx

// [1] Import React and routing components from react-router-dom.
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// [2] Import the three pages: Registration, DeleteUser, and GetUsers.
import RegistrationPage from './RegistrationPage';
import DeleteUserPage from './DeleteUserPage';
import GetUsersPage from './GetUsersPage';

// [3] Define the App component that sets up a navigation bar and routes.
function App() {
  return (
    // [3a] BrowserRouter provides the routing context.
    <BrowserRouter>
      {/* [3b] Navigation bar to link to each page */}
      <nav className="bg-gray-800 p-4">
        <ul className="flex space-x-4">
          <li><Link to="/" className="text-white">Register</Link></li>
          <li><Link to="/delete" className="text-white">Delete User</Link></li>
          <li><Link to="/users" className="text-white">Get Users</Link></li>
        </ul>
      </nav>
      {/* [3c] Define the routes for the different pages */}
      <Routes>
        <Route path="/" element={<RegistrationPage />} />
        <Route path="/delete" element={<DeleteUserPage />} />
        <Route path="/users" element={<GetUsersPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
