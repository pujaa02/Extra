// Import necessary modules
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Components for each role's home page
const AdminHome = () => <div>Admin Home</div>;
const UserHome = () => <div>User Home</div>;
const GuestHome = () => <div>Guest Home</div>;
const NotFound = () => <div>404 Not Found</div>;

// Mock function to get user role
// Replace with actual authentication/authorization logic
const getUserRole = () => {
  // Return user role based on your authentication logic
  // This is just a mock example
  return 'admin'; // 'admin', 'user', 'guest'
};

const App = () => {
  const role = getUserRole();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={`/${role}`} />} />
        <Route path="/admin" element={role === 'admin' ? <AdminHome /> : <Navigate to="/" />} />
        <Route path="/user" element={role === 'user' ? <UserHome /> : <Navigate to="/" />} />
        <Route path="/guest" element={role === 'guest' ? <GuestHome /> : <Navigate to="/" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
