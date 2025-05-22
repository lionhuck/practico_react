// hooks/useUserForm.jsx
import { useFormik } from 'formik';
import { useEffect } from 'react';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  nombre: Yup.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .required('El nombre es obligatorio'),
  precio: Yup.string()
    .min(1, 'El precio no puede ser menor a 1')
    .required('El precio es obligatorio'),
});

const useProductForm = (onSubmit, product) => {
  const formik = useFormik({
    initialValues: {
      nombre: '',
      precio: '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      onSubmit(values);
      resetForm();
    },
  });

  useEffect(() => {
    if (product) {
      formik.setValues({
        nombre: product.nombre || '',
        precio: product.precio || '',
      });
    }
  }, [product]);

  return {
    formData: formik.values,
    handleChange: formik.handleChange,
    handleSubmit: formik.handleSubmit,
    isEditing: !!product,
    errors: formik.errors,
    touched: formik.touched
  };
};

export default useProductForm;