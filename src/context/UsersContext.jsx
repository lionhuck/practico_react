// context/UsersContext.jsx
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import axios from 'axios';

const UsersContext = createContext();
const API_URL = 'http://localhost:3000/usuarios';

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useRef(null);

  const getUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_URL);
      setUsers(response.data.data || []); 
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuarios cargados correctamente',
        life: 3000
      });
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
      setError('Error al cargar los usuarios');
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los usuarios. Inténtalo de nuevo más tarde.',
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
        edad: parseInt(values.edad) // Asegurar que sea número
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
      const errorMessage = 'Error al crear usuario';
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 3000
      })
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
        edad: parseInt(values.edad) // Asegurar que sea número
      });
      
      console.log('Usuario actualizado:', response.data);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario actualizado correctamente',
        life: 3000
      });
      
      setEditingUser(null);
      
      // Esperar un poco antes de recargar
      setTimeout(async () => {
        await getUsers();
      }, 100);
      
      return { success: true, data: response.data };
      
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      const errorMessage = 'Error al actualizar usuario';
      setError(errorMessage);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 3000
      })
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.delete(`${API_URL}/${id}`);
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
      })
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  
  const startEdit = (user) => {
    setEditingUser(user);
    setError(null); // Limpiar errores al empezar a editar
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <UsersContext.Provider
      value={{
        users,
        handleCreate,
        handleUpdate,
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