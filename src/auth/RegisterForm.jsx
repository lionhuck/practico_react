import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Password } from 'primereact/password';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

const RegisterForm = () => {
  const { register } = useContext(AuthContext);

  const initialValues = {
    name: '',
    email: '',
    age: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    age: Yup.number().min(1, 'You must be at least 18 years old').required('Age is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values) => {
  const userData = {
    nombre: values.name,
    email: values.email,
    age: values.age,
    password: values.password,
  };
  await register(userData);
};

  return (
    <Card title="Register">
      <Formik initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({ handleChange, values }) => (
          <Form className="p-fluid">
            <div className="field p-2">
              <label htmlFor="name">Name</label>
              <InputText id="name" name="name" value={values.name} onChange={handleChange} />
              <ErrorMessage name="name" component="div" className="p-error" />
            </div>
            <div className="field p-2">
              <label htmlFor="email">Email</label>
              <InputText id="email" name="email" type="email" value={values.email} onChange={handleChange} />
              <ErrorMessage name="email" component="div" className="p-error" />
            </div>
            <div className="field p-2">
              <label htmlFor="age">Age</label>
              <InputNumber
                id="age"
                name="age"
                value={values.age}
                onValueChange={(e) =>
                  handleChange({ target: { name: 'age', value: e.value } })
                }
              />
              <ErrorMessage name="age" component="div" className="p-error" />
            </div>
            <div className="field p-2">
              <label htmlFor="password">Password</label>
              <Password id="password" name="password" value={values.password} onChange={handleChange} />
              <ErrorMessage name="password" component="div" className="p-error" />
            </div>
            <div className="field p-2">
              <Button type="submit" label="Register" className="p-button-primary" />
            </div>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default RegisterForm;
