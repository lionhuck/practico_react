// context/UsersContext.jsx (Versión mejorada)
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const UsersContext = createContext();
const API_URL = 'http://localhost:3000/usuarios';

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useRef(null);
  const { user: currentUser } = useContext(AuthContext);

  // Configurar axios con el token
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const getUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_URL, {
        headers: getAuthHeaders()
      });
      setUsers(response.data.data || []); 
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuarios cargados correctamente',
        life: 3000
      });
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
      const errorMessage = err.response?.data?.message || 'Error al cargar los usuarios';
      setError(errorMessage);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreate = async (values) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(API_URL, {
        nombre: values.nombre,
        email: values.email,
        age: parseInt(values.age)
      }, {
        headers: getAuthHeaders()
      });
      
      console.log('Usuario creado:', response.data);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario creado correctamente',
        life: 3000
      });

      await getUsers();
      
      return { success: true, data: response.data };
      
    } catch (error) {
      console.error('Error al crear usuario:', error);
      const errorMessage = error.response?.data?.message || 'Error al crear usuario';
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 3000
      });
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdate = async (values) => {
    if (!editingUser) return { success: false, error: 'No hay usuario para editar' };
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put(`${API_URL}/${editingUser.id}`, {
        nombre: values.nombre,
        email: values.email,
        age: parseInt(values.age)
      }, {
        headers: getAuthHeaders()
      });
      
      console.log('Usuario actualizado:', response.data);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario actualizado correctamente',
        life: 3000
      });
      
      setEditingUser(null);
      
      setTimeout(async () => {
        await getUsers();
      }, 100);
      
      return { success: true, data: response.data };
      
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      const errorMessage = error.response?.data?.message || 'Error al actualizar usuario';
      setError(errorMessage);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 3000
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      setLoading(true);
      
      const response = await axios.put(`${API_URL}/${userId}/rol`, {
        rol: newRole
      }, {
        headers: getAuthHeaders()
      });
      
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Rol actualizado correctamente',
        life: 3000
      });

      // Actualizar el usuario en la lista local
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, rol: newRole, isAdmin: newRole === 'admin' }
            : user
        )
      );
      
      return { success: true, data: response.data };
      
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      const errorMessage = error.response?.data?.message || 'Error al actualizar rol';
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 3000
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeaders()
      });
      
      console.log('Usuario eliminado:', response.data);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario eliminado correctamente',
        life: 3000
      });

      await getUsers();
      
      return { success: true, data: response.data };
      
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      const errorMessage = error.response?.data?.message || 'Error al eliminar usuario';
      setError(errorMessage);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 3000
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  
  const startEdit = (user) => {
    setEditingUser(user);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    if (currentUser) {
      getUsers();
    }
  }, [currentUser]);

  return (
    <UsersContext.Provider
      value={{
        users,
        handleCreate,
        handleUpdate,
        handleUpdateRole,
        handleDelete,
        editingUser,
        startEdit,
        loading,
        error,
        clearError,
        refreshUsers: getUsers
      }}
    >
      {children}
      <Toast ref={toast} />
    </UsersContext.Provider>
  );
};

export const useUsers = () => useContext(UsersContext);