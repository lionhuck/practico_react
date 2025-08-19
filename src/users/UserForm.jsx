// components/UserForm.jsx
import React from 'react';
import useUserForm from './useUserForm';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';

const UserForm = ({ user, onSubmit }) => {
  const {
    formData,
    handleChange,
    handleSubmit,
    isEditing,
    errors,
    touched
  } = useUserForm(onSubmit, user);

  return (
    <form onSubmit={handleSubmit} className="p-fluid">
      <div className="field p-2">
        <label htmlFor="nombre">Nombre</label>
        <InputText
          id="nombre"
          name="nombre"
          placeholder="Nombre del usuario"
          value={formData.nombre}
          onChange={handleChange}
          className={errors.nombre && touched.nombre ? 'p-invalid' : ''}
        />
        {errors.nombre && touched.nombre && <small className="p-error">{errors.nombre}</small>}
      </div>

      <div className="field p-2">
        <label htmlFor="email">Email</label>
        <InputText
          id="email"
          name="email"
          placeholder="Email del usuario"
          value={formData.email}
          onChange={handleChange}
          className={errors.email && touched.email ? 'p-invalid' : ''}
        />
        {errors.email && touched.email && <small className="p-error">{errors.email}</small>}
      </div>

      <div className="field p-2">
        <label htmlFor="age">Edad</label>
        <InputNumber
          id="age"
          name="age"
          placeholder="Edad"
          value={formData.age}
          onValueChange={(e) => handleChange({ target: { name: 'age', value: e.value } })}
          className={errors.age && touched.age ? 'p-invalid' : ''}
          min={0}
        />
        {errors.age && touched.age && <small className="p-error">{errors.age}</small>}
      </div>

      <div className="flex justify-content-end gap-2 p-2">
        <Button 
          type="button" 
          label="Cancelar" 
          className="p-button-text"
          onClick={() => document.querySelector('.p-dialog-header-close')?.click()}
        />
        <Button 
          type="submit" 
          label={isEditing ? "Actualizar" : "Guardar"} 
          className="p-button-primary"
        />
      </div>
    </form>
  );
};

export default UserForm;