// context/SalesContext.jsx
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import axios from 'axios';

const SalesContext = createContext();
const API_URL = 'http://localhost:3000/ventas';

export const SalesProvider = ({ children }) => {
  const [sales, setSales] = useState([]);
  const [editingSale, setEditingSale] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useRef(null);

  const getSales = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_URL);
      setSales(response.data.data || []); 
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Ventas cargados correctamente',
        life: 3000
      })
    } catch (err) {
      console.error('Error al obtener ventas:', err);
      setError('Error al cargar los ventas');
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los ventas. Inténtalo de nuevo más tarde.',
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
        usuarioId: parseFloat(values.usuarioId),
        productoId: parseFloat(values.productoId),
        cantidad: parseFloat(values.cantidad)
      });
      
      console.log('Venta creado:', response.data);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Venta creado correctamente',
        life: 3000
      });
      
      await getSales();
      
      return { success: true, data: response.data };
      
    } catch (error) {
      console.error('Error al crear venta:', error);
      const errorMessage = error.response?.data?.message || 'Error al crear venta';
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
  
  const handleUpdate = async (values) => {
    if (!editingSale) return { success: false, error: 'No hay venta para editar' };
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put(`${API_URL}/${editingSale.id}`, {
        usuarioId: parseFloat(values.usuarioId),
        productoId: parseFloat(values.productoId),
        cantidad: parseFloat(values.cantidad)
      });
      
      console.log('Venta actualizado:', response.data);
      setEditingSale(null);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Venta actualizado correctamente',
        life: 3000
      });
      
      await getSales();
      
      return { success: true, data: response.data };
      
    } catch (error) {
      console.error('Error al actualizar venta:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail:'Error al actualizar venta',
        life: 3000
      });
      const errorMessage = error.response?.data?.message || 'Error al actualizar venta';
      setError(errorMessage);
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
      console.log('Venta eliminado:', response.data);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Venta eliminado correctamente',
        life: 3000
      });
      
      await getSales();
      
      return { success: true, data: response.data };
      
    } catch (error) {
      console.error('Error al eliminar venta:', error);
      const errorMessage = error.response?.data?.message || 'Error al eliminar venta';
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
  
  const startEdit = (sale) => {
    setEditingSale(sale);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    getSales();
  }, []);

  return (
    <SalesContext.Provider
      value={{
        sales,
        handleCreate,
        handleUpdate,
        handleDelete,
        editingSale,
        startEdit,
        loading,
        error,
        clearError,
        refreshSales: getSales
      }}
    >
      {children}
      <Toast ref={toast} />
    </SalesContext.Provider>
  );
};

export const useSales = () => useContext(SalesContext);