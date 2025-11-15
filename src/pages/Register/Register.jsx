import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegUser } from "react-icons/fa6";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineMailOutline } from "react-icons/md";

import './register.css';
import authService from '../../services/authService';
import useAuth from '../../hooks/useAuth';

// Constantes de Validación
const MAX_LENGTH = 20;
const MIN_LENGTH = 6;

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [clave, setClave] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth(); // guardo el usuario logueado
    const navigate = useNavigate();

    // Función de validación de longitud y email en tiempo real
    const handleInputChange = (setter, value, fieldName) => {
        setter(value);
        setError('');

        // Validación de Email simple en tiempo real
        if (fieldName === 'Email' && value.length > 0 && !value.includes('@')) {
            setError('Error: Ingresa un correo electrónico válido.');
        }
        // Validación de Longitud (solo para usuario y contraseña) en tiempo real
        else if (fieldName !== 'Email') {
            if (value.length > MAX_LENGTH) {
                setError(`Error: El campo "${fieldName}" no puede tener más de ${MAX_LENGTH} caracteres.`);
            } else if (value.length > 0 && value.length < MIN_LENGTH) {
                setError(`Error: El campo "${fieldName}" debe tener al menos ${MIN_LENGTH} caracteres.`);
            }
        }
    };


    // const handleRegister = async (e) => {

    //     
    //     try {

    //         const data = await authService.register(username, clave, email);

    //         // REGISTRO EXITOSO
    //         console.log('Registro exitoso:', data.message);
    //         alert(`¡Registro exitoso! ${data.message}.`);

    //         login(data.user, data.clave);
    //         // Redirigir al usuario al login después del éxito
    //         navigate('/clientes');

    //     } catch (error) {
    //         // Captura errores del servidor (ej: 400 'Username already registered')
    //         console.error('API Error:', error);

    //         let errorMessage = 'Error de conexión o servidor no disponible.';

    //         // Intenta extraer el mensaje de error de FastAPI/Axios
    //         if (error.response && error.response.data && error.response.data.detail) {
    //             errorMessage = error.response.data.detail;
    //         }

    //         setError(errorMessage);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // VALIDACIONES LOCALES FINALES 
        if (username.length < MIN_LENGTH || username.length > MAX_LENGTH ||
            clave.length < MIN_LENGTH || clave.length > MAX_LENGTH ||
            username.trim() === '' || email.trim() === '' || clave.trim() === '') {

            setError('Por favor, verifica la longitud y completa todos los campos.');
            setLoading(false);
            return;
        }
        //  LLAMADA AL BACKEND DE FASTAPI USANDO EL SERVICIO 
        try {
            // Llama a la función 'register' de authService.js
            // Los datos se envían a http://127.0.0.1:8000/register
            const data = await authService.register(username, clave, email);
            
            // REGISTRO EXITOSO
            alert(`${data.message}.`);

            // Hace LOGIN automático usando AuthContext
            const loginResult = await login(username, clave);

            if (loginResult.success) {
                navigate('/clientes');  // 3️⃣ Ahora sí te lleva directo
            } else {
                setError("Error al iniciar sesión automáticamente.");
            }

        } catch (error) {
            let errorMessage = 'Error de conexión o servidor no disponible.';

            if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail;
            }

            setError(errorMessage);

        } finally {
            setLoading(false);
        }
    };


    // Lógica para deshabilitar el botón si hay errores de longitud o cargando
    const isInvalid = username.length > MAX_LENGTH || username.length < MIN_LENGTH ||
        clave.length > MAX_LENGTH || clave.length < MIN_LENGTH ||
        (error && error.startsWith('Error:'));

    return (
        <div className="login-page-container">
            <div className="login-form-panel">
                <h1 className="login-title">CREAR CUENTA</h1>
                <form onSubmit={handleRegister} className="login-form">

                    {/* Campo Username */}
                    <div className="input-group">
                        <FaRegUser className="input-icon" />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => handleInputChange(setUsername, e.target.value, 'Usuario')}
                            required
                            aria-label="Username"
                            className="login-input"
                        />
                    </div>

                    {/* Campo Email */}
                    <div className="input-group">
                        <MdOutlineMailOutline className="input-icon" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => handleInputChange(setEmail, e.target.value, 'Email')}
                            required
                            aria-label="Email"
                            className="login-input"
                        />
                    </div>

                    {/* Campo Contraseña */}
                    <div className="input-group">
                        <RiLockPasswordLine className="input-icon" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={clave}
                            onChange={(e) => handleInputChange(setClave, e.target.value, 'Contraseña')}
                            required
                            aria-label="Password"
                            className="login-input"
                        />
                    </div>

                    {/* Muestra el mensaje de error */}
                    {error && <p className="error-message">{error}</p>}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading || isInvalid}
                    >
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>

                {/* Enlace a la página de Login */}
                <p className="link-to-register">
                    ¿Ya tenes una cuenta? <Link to="/">Inicia Sesión</Link>
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

export default Register;