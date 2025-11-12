import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Hook personalizado para consumir el contexto de autenticación (AuthContext).
 * Provee acceso fácil a los estados (isLoggedIn, loading) y 
 * a las funciones (login, logout) de la sesión de usuario.
 */
const useAuth = () => {
    const context = useContext(AuthContext);

    // Mantenemos una verificación de seguridad: si el hook se usa fuera del AuthProvider, lanzamos un error.
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }

    return context;
};

export default useAuth;