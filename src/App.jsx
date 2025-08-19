// App.jsx (actualizado con Navbar)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UsersPage from './users/index.jsx';
import ProductsPage from './products/index';
import SalesPage from './sales/index';
import { PrimeReactProvider } from 'primereact/api';
import { ConfirmDialog } from 'primereact/confirmdialog';
import Navbar from './components/Navbar';
import Home from './components/Home.jsx';
// Import required PrimeReact styles
import "primereact/resources/themes/lara-light-indigo/theme.css";  
import "primereact/resources/primereact.min.css";                  
import "primeicons/primeicons.css";                                
import 'primeflex/primeflex.css';  
import LoginForm from './auth/LoginForm'
import RegisterForm from './auth/RegisterForm';
import AuthProvider from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
    <PrimeReactProvider>
      <Router>
        <AuthProvider>
        <Navbar />
        <ConfirmDialog />
        <Routes>
          <Route path="/login" element={
            <PublicRoute><LoginForm /></PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute><RegisterForm /></PublicRoute>
          } />
          <Route path="/" element={<Home />} />

          <Route path="/users" element={
            <PrivateRoute><UsersPage /></PrivateRoute>
          } />
          <Route path="/products" element={
            <PrivateRoute><ProductsPage /></PrivateRoute>
          } />
          <Route path="/sales" element={
            <PrivateRoute><SalesPage /></PrivateRoute>
          } />
        </Routes>
        </AuthProvider>
      </Router>
    </PrimeReactProvider>
  );
}

export default App;