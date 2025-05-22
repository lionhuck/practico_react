// context/ProductsContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const ProductsContext = createContext();
const API_URL = 'http://localhost:3000/productos';

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_URL);
      setProducts(response.data.data || []); 
    } catch (err) {
      console.error('Error al obtener productos:', err);
      setError('Error al cargar los productos');
      // En caso de error, mantener el estado actual en lugar de array vacío
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
        precio: parseFloat(values.precio) // Asegurar que sea número
      });
      
      console.log('Producto creado:', response.data);
      
      // Esperar un poco antes de recargar para asegurar que el archivo se guardó
      setTimeout(async () => {
        await getProducts();
      }, 100);
      
      return { success: true, data: response.data };
      
    } catch (error) {
      console.error('Error al crear producto:', error);
      const errorMessage = error.response?.data?.message || 'Error al crear producto';
      setError(errorMessage);
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
      
      // Esperar un poco antes de recargar
      setTimeout(async () => {
        await getProducts();
      }, 100);
      
      return { success: true, data: response.data };
      
    } catch (error) {
      console.error('Error al actualizar producto:', error);
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
      
      // Esperar un poco antes de recargar
      setTimeout(async () => {
        await getProducts();
      }, 100);
      
      return { success: true, data: response.data };
      
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      const errorMessage = error.response?.data?.message || 'Error al eliminar producto';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  
  const startEdit = (product) => {
    setEditingProduct(product);
    setError(null); // Limpiar errores al empezar a editar
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
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);