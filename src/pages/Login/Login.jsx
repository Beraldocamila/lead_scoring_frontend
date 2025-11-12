import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRegUser } from "react-icons/fa6";
import { RiLockPasswordLine } from "react-icons/ri";

import useAuth from '../../hooks/useAuth';
import './login.css';

// Constante para el límite de caracteres
const MAX_LENGTH = 20;

const Login = () => {
    const [username, setUsername] = useState('');
    const [clave, setClave] = useState('');
    // El error se usa para mostrar el mensaje del servidor o de validación local
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Obtenemos la función login del AuthContext
    const { login } = useAuth();
    
    // Función para manejar el cambio y la validación en tiempo real
    const handleInputChange = (setter, value, fieldName) => {
        setter(value); // Actualiza el estado

        // Realiza la validación de longitud en tiempo real
        if (value.length > MAX_LENGTH) {
            // Muestra el error de longitud inmediatamente
            setError(`Error: El campo "${fieldName}" no puede tener más de ${MAX_LENGTH} caracteres.`);
        } 
        // Si el valor vuelve a ser válido (longitud <= MAX_LENGTH) y hay un error de longitud activo, lo borra.
        // Lo verificamos si el error comienza con 'Error:' para no borrar errores de campos vacíos o de servidor.
        else if (error && error.startsWith('Error:')) {
            setError('');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // VALIDACIÓN LOCAL: Verificar campos vacíos
        if (username.trim() === '' || clave.trim() === '') {
            setError('Por favor, ingresa tu usuario y contraseña.');
            setLoading(false);
            return;
        }

        // VALIDACIÓN LOCAL: Verificación de longitud
        if (username.length > MAX_LENGTH || clave.length > MAX_LENGTH) {
            // Si la longitud es inválida, muestra un mensaje de error y detiene el proceso
            setError(`Por favor, corrige la longitud de los campos. Máximo ${MAX_LENGTH} caracteres permitidos.`);
            setLoading(false);
            return;
        }

        // LLAMADA AL CONTEXTO
        const result = await login(username, clave);

        if (!result.success) {
            // Si el login falla, el AuthContext devuelve el mensaje de error del backend.
            setError(result.error);
        }

        setLoading(false); // Siempre termina el estado de carga
    };

    // La lógica para deshabilitar el botón si la longitud es inválida
    const isLengthInvalid = username.length > MAX_LENGTH || clave.length > MAX_LENGTH;

    return (
        <div className="login-page-container">
            {/* Panel izquierdo: Formulario de Login */}
            <div className="login-form-panel">
                <h1 className="login-title">LOGIN</h1>
                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <FaRegUser className="input-icon" />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            // Usamos el nuevo handler para validar mientras se escribe
                            onChange={(e) => handleInputChange(setUsername, e.target.value, 'Usuario')}
                            required
                            aria-label="Username"
                            className="login-input"
                            // **CLAVE DEL CAMBIO:** Se eliminó la propiedad maxLength
                        />
                    </div>
                    <div className="input-group">
                        <RiLockPasswordLine className="input-icon" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={clave}
                            // Usamos el nuevo handler para validar mientras se escribe
                            onChange={(e) => handleInputChange(setClave, e.target.value, 'Contraseña')}
                            required
                            aria-label="Password"
                            className="login-input"
                            // **CLAVE DEL CAMBIO:** Se eliminó la propiedad maxLength
                        />
                    </div>
                    {/* Muestra el mensaje de error */}
                    {error && <p className="error-message">{error}</p>}
                    <button 
                        type="submit" 
                        className="login-button" 
                        // Deshabilitado si está cargando O si la longitud es inválida
                        disabled={loading || isLengthInvalid}
                    >
                        {loading ? 'Iniciando Sesión...' : 'Login'}
                    </button>
                </form>

                {/* Enlace a la página de Registro */}
                <p className="link-to-register">
                    ¿No tenes una cuenta? <Link to="/register">Registrate</Link>
                </p>

            </div>

            {/* Panel derecho: Logo/Decoración */}
            <div className="login-decoration-panel">
                <div className="login-logo-card">
                    <span className="login-logo-text">LOGO</span>
                </div>
            </div>
        </div>
    );
};

export default Login;