// context/ProductsContext.jsx
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import axios from 'axios';

const ProductsContext = createContext();
const API_URL = 'http://localhost:3000/productos';

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useRef(null);

  const getProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_URL);
      setProducts(response.data.data || []); 
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Productos cargados correctamente',
        life: 3000
      })
    } catch (err) {
      console.error('Error al obtener productos:', err);
      setError('Error al cargar los productos');
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los productos. Inténtalo de nuevo más tarde.',
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
        precio: parseFloat(values.precio)
      });
      
      console.log('Producto creado:', response.data);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Producto creado correctamente',
        life: 3000
      });
      
      await getProducts();
      
      return { success: true, data: response.data };
      
    } catch (error) {
      console.error('Error al crear producto:', error);
      const errorMessage = error.response?.data?.message || 'Error al crear producto';
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
    if (!editingProduct) return { success: false, error: 'No hay producto para editar' };
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put(`${API_URL}/${editingProduct.id}`, {
        nombre: values.nombre,
        precio: parseFloat(values.precio) // Asegurar que sea número
      });
      
      console.log('Producto actualizado:', response.data);
      setEditingProduct(null);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Producto actualizado correctamente',
        life: 3000
      });
      
      await getProducts();
      
      return { success: true, data: response.data };
      
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail:'Error al actualizar producto',
        life: 3000
      });
      const errorMessage = error.response?.data?.message || 'Error al actualizar producto';
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
      console.log('Producto eliminado:', response.data);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Producto eliminado correctamente',
        life: 3000
      });
      
      await getProducts();
      
      return { success: true, data: response.data };
      
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      const errorMessage = error.response?.data?.message || 'Error al eliminar producto';
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
  
  const startEdit = (product) => {
    setEditingProduct(product);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        products,
        handleCreate,
        handleUpdate,
        handleDelete,
        editingProduct,
        startEdit,
        loading,
        error,
        clearError,
        refreshProducts: getProducts
      }}
    >
      {children}
      <Toast ref={toast} />
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);