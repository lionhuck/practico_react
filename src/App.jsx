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

function App() {
  return (
    <PrimeReactProvider>
      <Router>
        <AuthProvider>
        <Navbar />
        <ConfirmDialog />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/sales" element={<SalesPage />} />
        </Routes>
        </AuthProvider>
      </Router>
    </PrimeReactProvider>
  );
}

export default App;