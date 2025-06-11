import React, { useState } from 'react';
import { useSales } from '../context/SalesContext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

const SalesView = () => {
  const {
    sales,
    handleDelete,
    handleCreate,
    handleUpdate,
    editingSale,
    startEdit,
  } = useSales();

  const [displayModal, setDisplayModal] = useState(false);
  const [saleData, setSaleData] = useState({ usuarioId: '', productoId: '', cantidad: 0 });


  const handleInputChange = (e, field) => {
  const value = e.target?.value ?? e.value;
  setSaleData((prev) => ({ ...prev, [field]: value }));
};

const openNew = () => {
  setSaleData({ usuarioId: '', productoId: '', cantidad: 0 });
  setDisplayModal(true);
};

const onSubmit = () => {
  if (editingSale) {
    handleUpdate({ ...editingSale, ...saleData });
  } else {
    handleCreate(saleData);
  }
  setDisplayModal(false);
};

  const confirmDeleteSale = (id) => {
    confirmDialog({
      message: '¿Estás seguro que deseas eliminar esta venta?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => handleDelete(id),
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
          onClick={() => confirmDeleteSale(rowData.id)}
        />
      </div>
    );
  };
  
  return (
    <div className="flex flex-column gap-2">
      <DataTable
        value={sales}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      >
        <Column field="id" header="ID" style={{ width: '100px' }} />
        <Column
          field="Usuario.nombre"
          header="Usuario ID"
          style={{ width: '150px' }}
        />
        <Column
          field="Producto.nombre"
          header="Producto ID"
          style={{ width: '150px' }}
        />
        <Column
          field="cantidad"
          header="Cantidad"
          style={{ width: '100px' }}
        />
        <Column body={actionBodyTemplate} style={{ width: '100px' }} />
      </DataTable>

      <Button
        label="Nueva Venta"
        className="p-button-success"
        onClick={openNew}
      />

      <Dialog
        visible={displayModal}
        style={{ width: '500px' }}
        onHide={() => setDisplayModal(false)}
        header="Nueva Venta"
      >
        <div className="flex flex-column gap-2">
          <InputText
            id="usuarioId"
            value={editingSale?.usuarioId}
            onChange={(e) => handleInputChange(e, 'usuarioId')}
            placeholder="Usuario ID"
          />
          <InputText
            id="productoId"
            value={editingSale?.productoId}
            onChange={(e) => handleInputChange(e, 'productoId')}
            placeholder="Producto ID"
          />
          <InputNumber
            id="cantidad"
            value={editingSale?.cantidad}
            onChange={(e) => handleInputChange(e, 'cantidad')}
            placeholder="Cantidad"
          />
          <Button
            label="Guardar"
            className="p-button-success"
            onClick={onSubmit}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default SalesView;
