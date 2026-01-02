// src/App.jsx
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Signup';
import Dashboard from './Pages/Dashboard';
import Profile from './/Pages/Profile';
import Navbar from './components/UI/Navbar';
import { AuthContext } from './context/AuthContext';

function RequireAuth({ children }) {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    
  )
}
