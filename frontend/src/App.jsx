import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LoanApplication from './pages/LoanApplication';
import LoanDetails from './pages/LoanDetails';
import Calculators from './pages/Calculators';
import Messages from './pages/Messages';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/loans/new"
          element={
            <ProtectedRoute>
              <LoanApplication />
            </ProtectedRoute>
          }
        />
        <Route
          path="/loans/:id"
          element={
            <ProtectedRoute>
              <LoanDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calculators"
          element={
            <ProtectedRoute>
              <Calculators />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
