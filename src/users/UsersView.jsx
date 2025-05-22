// components/UsersView.jsx
import React, { useState } from 'react';
import { useUsers } from '../context/UsersContext';
import UserForm from './UserForm';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { confirmDialog } from 'primereact/confirmdialog';
import { Fragment } from 'react';
import { exportToPdf } from '../utils/ExportToPdf';


const UsersView = () => {
  const {
    users,
    handleDelete,
    handleCreate,
    handleUpdate,
    editingUser,
    startEdit,
  } = useUsers();

  const [displayModal, setDisplayModal] = useState(false);

  const openNew = () => {
    startEdit(null);
    setDisplayModal(true);
  };

  const onSubmit = (values) => {
    if (editingUser) {
      handleUpdate(values);
    } else {
      handleCreate(values);
    }
    setDisplayModal(false);
  };

  const confirmDeleteUser = (id) => {
    confirmDialog({
      message: '¿Estás seguro que deseas eliminar este usuario?',
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
          onClick={() => confirmDeleteUser(rowData.id)}
        />
      </div>
    );
  };

  return (
    <Fragment>
      <div className="flex justify-content-between align-items-center">
        <h2>Gestión de Usuarios</h2>
        <Button 
          label="Exportar PDF" 
          icon="pi pi-file-pdf" 
          onClick={() => exportToPdf(users, 'Usuarios', ['ID', 'Nombre', 'Email', 'Edad'])}
          className="p-button-secondary"
        />
        <Button 
          label="Nuevo Usuario" 
          icon="pi pi-plus" 
          onClick={openNew}
          className="p-button-success"
        />
      </div>

      <DataTable 
        value={users}
        emptyMessage="No se encontraron usuarios"
      >
        <Column field="id" header="ID" sortable style={{ width: '10%' }}></Column>
        <Column field="nombre" header="Nombre" sortable style={{ width: '25%' }}></Column>
        <Column field="email" header="Email" sortable style={{ width: '30%' }}></Column>
        <Column field="edad" header="Edad" sortable style={{ width: '15%' }}></Column>
        <Column body={actionBodyTemplate} exportable={false} style={{ width: '20%' }} header="Acciones"></Column>
      </DataTable>

      <Dialog 
        visible={displayModal} 
        onHide={() => setDisplayModal(false)}
        header={editingUser ? "Editar Usuario" : "Nuevo Usuario"}
        modal
      >
        <UserForm 
          user={editingUser} 
          onSubmit={onSubmit}
        />
      </Dialog>
    </Fragment>
  );
};

export default UsersView;