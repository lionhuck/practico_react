// components/ProductsView.jsx
import React, { useState } from 'react';
import { useProducts } from '../context/ProductsContext';
import ProductForm from './ProductForm';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { confirmDialog } from 'primereact/confirmdialog';
import { Fragment } from 'react';
import { exportToPdf } from '../utils/ExportToPdf';


const ProductsView = () => {
  const {
    products,
    handleDelete,
    handleCreate,
    handleUpdate,
    editingProduct,
    startEdit,
  } = useProducts();

  const [displayModal, setDisplayModal] = useState(false);

  const openNew = () => {
    startEdit(null);
    setDisplayModal(true);
  };

  const formatCurrency = (value) => {
  return value.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS'
  });
  };

  const priceBodyTemplate = (product) => {
  return formatCurrency(product.precio);
  };


  const onSubmit = (values) => {
    if (editingProduct) {
      handleUpdate(values);
    } else {
      handleCreate(values);
    }
    setDisplayModal(false);
  };

  const confirmDeleteProduct = (id) => {
    confirmDialog({
      message: '¿Estás seguro que deseas eliminar este producto?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => handleDelete(id)
    });
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button 
          icon="pi pi-pencil" 
          className="p-button-rounded p-button-warning p-button-outlined" 
          onClick={() => {
            startEdit(rowData);
            setDisplayModal(true);
          }}
        />
        <Button 
          icon="pi pi-trash" 
          className="p-button-rounded p-button-danger p-button-outlined" 
          onClick={() => confirmDeleteProduct(rowData.id)}
        />
      </div>
    );
  };

  return (
    <Fragment>
      <div className="flex justify-content-between align-items-center">
        <h2>Gestión de Productos</h2>
        <Button 
          label="Exportar PDF" 
          icon="pi pi-file-pdf" 
          onClick={() => exportToPdf(products, 'Productos', ['ID', 'Nombre', 'Precio'])}
          className="p-button-secondary"
        />
        <Button 
          label="Nuevo producto" 
          icon="pi pi-plus" 
          onClick={openNew}
          className="p-button-success"
        />
      </div>

      <DataTable 
        value={products}
        emptyMessage="No se encontraron usuarios"
      >
        <Column field="id" header="ID" sortable style={{ width: '10%' }}></Column>
        <Column field="nombre" header="Nombre" sortable style={{ width: '25%' }}></Column>
        <Column field="precio" header="Precio" body={priceBodyTemplate} sortable style={{ width: '30%' }}></Column>
        <Column body={actionBodyTemplate} exportable={false} style={{ width: '20%' }} header="Acciones"></Column>
      </DataTable>

      <Dialog 
        visible={displayModal} 
        onHide={() => setDisplayModal(false)}
        header={editingProduct ? "Editar Producto" : "Nuevo Producto"}
        modal
      >
        <ProductForm 
          product={editingProduct} 
          onSubmit={onSubmit}
        />
      </Dialog>
    </Fragment>
  );
};

export default ProductsView;