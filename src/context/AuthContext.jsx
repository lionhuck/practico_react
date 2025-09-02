import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const base64Payload = token.split('.')[1];
            const decodedPayload = JSON.parse(atob(base64Payload));
            setUser({ ...decodedPayload, token });
        } catch (err) {
            console.error("Error decodificando token:", err);
            localStorage.removeItem('token');
        }
    }
    }, []);

    const decodeToken = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
        } catch (error) {
        return null;
        }
    };


    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:3000/auth/login', { email, password });
            const token = response.data.token;
            if (!token) throw new Error("Token no recibido");

            localStorage.setItem('token', token);

            const base64Payload = token.split('.')[1];
            const decodedPayload = JSON.parse(atob(base64Payload));
            setUser({ ...decodedPayload, token });

            navigate('/');
        } catch (error) {
            console.error("Error en login:", error);
            alert(error.response?.data?.message || "Hubo error al iniciar sesión");
        }
    };



    const register = async (userData) => {
        try {
            const response = await axios.post('http://localhost:3000/auth/register', userData);
            if (response.status === 201) {
                alert("Usuario creado exitosamente");
                navigate('/login');
            } else {
                alert(response.data.message || "Error desconocido");
            }
        } catch (error) {
            console.error("Error al registrar:", error);
            const errorMsg = error.response?.data?.message || "Hubo un error al registrar el usuario";
            alert(errorMsg);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        navigate('/login');
    };


    const forgotPassword = async (email) => {
        try {
            const response = await axios.post('http://localhost:3000/auth/forgot-password', { email });
            if (response.status === 200) {
                alert("Se ha enviado un link de recuperación a tu email");
                return true
            } else {
                alert(response.data.message || "Error desconocido");
                return false
            }
        } catch (error) {
            console.error("Error en recuperar contraseña:", error);
            const errorMsg = error.response?.data?.message || "Hubo un error al intentar recuperar la contraseña";
            alert(errorMsg);
            return false
        }
    }


    return (
        <AuthContext.Provider value={{ user, setUser, register, login, logout, forgotPassword }}>
            {children}
        </AuthContext.Provider>
    );

}
export default AuthProvider; 
