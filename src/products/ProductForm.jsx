// components/ProductForm.jsx
import React from 'react';
import useProductForm from './useProductForm';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';

const ProductForm = ({ product, onSubmit }) => {
  const {
    formData,
    handleChange,
    handleSubmit,
    isEditing,
    errors,
    touched
  } = useProductForm(onSubmit, product);

  return (
    <form onSubmit={handleSubmit} className="p-fluid">
      <div className="field p-2">
        <label htmlFor="nombre">Nombre</label>
        <InputText
          id="nombre"
          name="nombre"
          placeholder="Nombre del producto"
          value={formData.nombre}
          onChange={handleChange}
          className={errors.nombre && touched.nombre ? 'p-invalid' : ''}
        />
        {errors.nombre && touched.nombre && <small className="p-error">{errors.nombre}</small>}
      </div>

      <div className="field p-2">
        <label htmlFor="precio">Precio</label>
        <InputText
          id="precio"
          name="precio"
          placeholder="Precio del producto"
          value={formData.precio}
          onChange={handleChange}
          className={errors.precio && touched.precio ? 'p-invalid' : ''}
        />
        {errors.precio && touched.precio && <small className="p-error">{errors.precio}</small>}
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

export default ProductForm;