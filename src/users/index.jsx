// pages/UsersPage.jsx
import React from 'react';
import { UsersProvider } from '../context/UsersContext.jsx';
import UsersView from './UsersView.jsx';

const UsersPage = () => {
  return (
    <UsersProvider>
        <UsersView />
    </UsersProvider>
  );
};

export default UsersPage;