// hooks/useUserForm.jsx
import { useFormik } from 'formik';
import { useEffect } from 'react';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  nombre: Yup.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .required('El nombre es obligatorio'),
  email: Yup.string()
    .email('El email no es válido')
    .required('El email es obligatorio'),
  edad: Yup.number()
    .typeError('Debe ser un número')
    .positive('La edad debe ser positiva')
    .required('La edad es obligatoria'),
});

const useUserForm = (onSubmit, user) => {
  const formik = useFormik({
    initialValues: {
      nombre: '',
      email: '',
      edad: '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      onSubmit(values);
      resetForm();
    },
  });

  useEffect(() => {
    if (user) {
      formik.setValues({
        nombre: user.nombre || '',
        email: user.email || '',
        edad: user.edad || '',
      });
    }
  }, [user]);

  return {
    formData: formik.values,
    handleChange: formik.handleChange,
    handleSubmit: formik.handleSubmit,
    isEditing: !!user,
    errors: formik.errors,
    touched: formik.touched
  };
};

export default useUserForm;