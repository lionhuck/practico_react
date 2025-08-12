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

    return (
        <AuthContext.Provider value={{ user, setUser, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider; 
