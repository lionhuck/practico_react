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
            const payload = JSON.parse(token.split('.')[1]);
            setUser({ ...payload, token });
        }
    }, []);

    const login = async (credentials) => {
        try {
            const response = await axios.post('http://localhost:3000/auth/login', credentials);
            const token = response.token;
            localStorage.setItem('token', token);
            const payload = JSON.parse(token.split('.')[1]);
            setUser({ ...payload, token });
            navigate('/');
        } catch (error) {
            alert("Hubo error al iniciar sesión");
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
