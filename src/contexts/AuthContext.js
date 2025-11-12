import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import authService from '../services/authService';

// Crea el contexto, definiendo su estructura inicial y valores por defecto.
export const AuthContext = createContext({
    isLoggedIn: false,
    accessToken: null,
    login: () => { },
    logout: () => { },
    loading: true, // Indica si la verificación inicial de la sesión terminó.
});

// Crea el proveedor que contiene la lógica y el estado de la sesión.
export const AuthProvider = ({ children }) => {
    // Inicializa el estado leyendo el token del almacenamiento local
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));

    // Inicializa el estado de sesión basado en la existencia del token
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'));
    const [loading, setLoading] = useState(true);

    // Efecto para manejar la configuración de Axios y el estado de la sesión
    useEffect(() => {
        if (accessToken) {
            // Si hay un token, lo establece en el header de autorización para todas las peticiones
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            setIsLoggedIn(true);
        } else {
            // Si no hay token, elimina cualquier encabezado de autorización
            delete api.defaults.headers.common['Authorization'];
            setIsLoggedIn(false);
        }
        // Marca la verificación inicial como terminada después de configurar el token/Axios
        setLoading(false);
    }, [accessToken]);


    // Función de LOGIN (Llama a la API para obtener el token)
    // Retorna { success: true } o { success: false, error: mensaje }
    const login = async (username, clave) => {
        try {
            // Llamada a la función del servicio
        const response = await authService.login(username, clave); 
        const token = response.data.access_token;

            // Guarda el token en el almacenamiento local y actualiza el estado
            localStorage.setItem('accessToken', token);
            setAccessToken(token); // Esto dispara el useEffect y configura Axios

            return { success: true };

        } catch (err) {
            console.error('Error en AuthContext.login:', err);

            // Extrae el mensaje de error del backend
            const errorMessage = err.response && err.response.data && err.response.data.detail
                ? err.response.data.detail
                : 'Credenciales inválidas o error de conexión.';

            // Limpia cualquier estado de sesión
            localStorage.removeItem('accessToken');
            setAccessToken(null);
            setIsLoggedIn(false);

            return { success: false, error: errorMessage };
        }
    };

    // Función de LOGOUT (No requiere llamar a la API)
    const logout = () => {
        // Limpia estados y almacenamiento local
        localStorage.removeItem('accessToken');
        setAccessToken(null);
        setIsLoggedIn(false);

        // Remueve el header de Axios
        delete api.defaults.headers.common['Authorization'];

    };

    // Define los valores que serán accesibles para los componentes que consuman el contexto
    const contextValue = {
        isLoggedIn,
        accessToken,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {/* Mientras loading es true, mostramos un estado de carga global. */}
            {loading ? <div className="loading-state">Cargando autenticación...</div> : children}
        </AuthContext.Provider>
    );
};