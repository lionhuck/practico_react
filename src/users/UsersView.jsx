// components/UsersView.jsx (Versión mejorada)
import React, { useState, Fragment, useContext } from 'react';
import { useUsers } from '../context/UsersContext';
import UserForm from './UserForm';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { confirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Badge } from 'primereact/badge';
import { exportToPdf } from '../utils/ExportToPdf';
import { AuthContext } from '../context/AuthContext';

const UsersView = () => {
  const {
    users,
    handleDelete,
    handleCreate,
    handleUpdate,
    editingUser,
    startEdit,
    handleUpdateRole,
    loading
  } = useUsers();

  const { user } = useContext(AuthContext); 
  const [displayModal, setDisplayModal] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');

  const roleOptions = [
    { label: 'Cliente', value: 'cliente' },
    { label: 'Moderador', value: 'moderador' },
    { label: 'Administrador', value: 'admin' }
  ];

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

  const confirmDeleteUser = (userData) => {
    if (userData.id === user?.id) {
      return;
    }

    confirmDialog({
      message: `¿Estás seguro que deseas eliminar al usuario "${userData.nombre}"?`,
      header: 'Confirmación de eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      rejectLabel: 'Cancelar',
      acceptLabel: 'Eliminar',
      accept: () => handleDelete(userData.id)
    });
  };
  const actionBodyTemplate = (rowData) => {
    if (user?.rol !== "admin") return null;
    
    const canDelete = rowData.id !== user?.id; // No puede eliminarse a sí mismo
    
    return (
      <div className="flex gap-2">
        <Button 
          icon="pi pi-pencil" 
          className="p-button-rounded p-button-warning p-button-outlined p-button-sm" 
          tooltip="Editar usuario"
          onClick={() => {
            startEdit(rowData);
            setDisplayModal(true);
          }}
        />
        <Button 
          icon="pi pi-trash" 
          className={`p-button-rounded p-button-danger p-button-outlined p-button-sm ${!canDelete ? 'p-disabled' : ''}`}
          tooltip={canDelete ? "Eliminar usuario" : "No puedes eliminarte a ti mismo"}
          disabled={!canDelete}
          onClick={() => confirmDeleteUser(rowData)}
        />
      </div>
    );
  };

  // Template para el rol
  const roleBodyTemplate = (rowData) => {
    if (user?.rol === "admin") {
      const canChangeRole = rowData.id !== user?.id; // No puede cambiar su propio rol
      
      return (
        <Dropdown
          value={rowData.rol || "cliente"}
          options={roleOptions}
          onChange={(e) => handleUpdateRole(rowData.id, e.value)}
          disabled={!canChangeRole}
          className="w-full"
          tooltip={canChangeRole ? "Cambiar rol" : "No puedes cambiar tu propio rol"}
        />
      );
    }
    return <Badge value={rowData.rol} severity={getBadgeSeverity(rowData.rol)} />;
  };

  const getBadgeSeverity = (role) => {
    switch(role) {
      case 'admin': return 'danger';
      case 'moderador': return 'warning';
      case 'cliente': return 'info';
      default: return 'secondary';
    }
  };

  // Template para el nombre con badge de estado
  const nameBodyTemplate = (rowData) => {
    const isCurrentUser = rowData.id === user?.id;
    return (
      <div className="flex align-items-center gap-2">
        <span>{rowData.nombre}</span>
        {isCurrentUser && <Badge value="Tú" severity="success" />}
      </div>
    );
  };

  // Header de la tabla con búsqueda
  const header = (
    <div className="flex justify-content-between align-items-center">
      <h2 className="m-0">Gestión de Usuarios</h2>
      <div className="flex gap-2 align-items-center">
        <InputText
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar usuarios..."
          className="p-inputtext-sm"
        />
        <Button 
          label="Exportar PDF" 
          icon="pi pi-file-pdf" 
          onClick={() => exportToPdf(users, 'Usuarios', ['ID', 'Nombre', 'Email', 'Edad', 'Rol'])}
          className="p-button-secondary p-button-sm"
        />
        {user?.rol === "admin" && (
          <Button 
            label="Nuevo Usuario" 
            icon="pi pi-plus" 
            onClick={openNew}
            className="p-button-success p-button-sm"
          />
        )}
      </div>
    </div>
  );

  return (
    <Fragment>
      <div className="card">
        <DataTable 
          value={users}
          loading={loading}
          globalFilter={globalFilter}
          header={header}
          emptyMessage="No se encontraron usuarios"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          className="p-datatable-gridlines"
          responsiveLayout="scroll"
        >
          <Column 
            field="id" 
            header="ID" 
            sortable 
            style={{ width: '10%' }}
          />
          <Column 
            field="nombre" 
            header="Nombre" 
            body={nameBodyTemplate}
            sortable 
            style={{ width: '20%' }}
          />
          <Column 
            field="email" 
            header="Email" 
            sortable 
            style={{ width: '25%' }}
          />
          <Column 
            field="age" 
            header="Edad" 
            sortable 
            style={{ width: '10%' }}
          />
          <Column 
            field="rol" 
            header="Rol" 
            body={roleBodyTemplate} 
            style={{ width: '15%' }}
          />
          {user?.rol === "admin" && (
            <Column 
              body={actionBodyTemplate} 
              exportable={false} 
              style={{ width: '20%' }} 
              header="Acciones"
              headerStyle={{ textAlign: 'center' }}
              bodyStyle={{ textAlign: 'center' }}
            />
          )}
        </DataTable>
      </div>

      <Dialog 
        visible={displayModal} 
        onHide={() => setDisplayModal(false)}
        header={editingUser ? "Editar Usuario" : "Nuevo Usuario"}
        modal
        className="p-fluid"
        style={{ width: '450px' }}
        footer={null}
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