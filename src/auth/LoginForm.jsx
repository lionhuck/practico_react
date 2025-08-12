import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

const LoginForm = () => {

    const { login } = useContext(AuthContext);

    const initialValues = {
        email: '',
        password: '',
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const handleSubmit = async (values) => {
        await login(values.email, values.password);
    };

    return (
        <Card>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                <Form className="p-fluid">
                    <div className="field p-2">
                        <label htmlFor="email">Email</label>
                        <InputText id="email" name="email" type="email" placeholder="Email" />
                        <ErrorMessage name="email" component="div" className="p-error" />
                    </div>
                    <div className="field p-2">
                        <label htmlFor="password">Password</label>
                        <Password id="password" name="password" placeholder="Password" />
                        <ErrorMessage name="password" component="div" className="p-error" />
                    </div>
                    <div className="field p-2">
                        <button type="submit" className="p-button p-button-primary">Login</button>
                    </div>
                </Form>
            </Formik>
        </Card>
    );
    
}

export default LoginForm