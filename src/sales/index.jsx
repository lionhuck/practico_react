// pages/UsersPage.jsx
import React from 'react';
import { SalesProvider } from '../context/SalesContext.jsx';
import SalesView from './SalesView.jsx';

const SalesPage = () => {
  return (
    <SalesProvider>
        <SalesView />
    </SalesProvider>
  );
};

export default SalesPage;