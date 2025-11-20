import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegUser } from "react-icons/fa6";
import { RiLockPasswordLine } from "react-icons/ri";

import useAuth from '../../hooks/useAuth';
import './login.css';

// Constante para el límite de caracteres
const MAX_LENGTH = 20;
// Constantes para el bloqueo por intentos fallidos
const MAX_ATTEMPTS = 3; // Límite de intentos
const LOCK_TIME_MS = 60000; // Tiempo de bloqueo en milisegundos (60 segundos)

const Login = () => {
    const [username, setUsername] = useState('');
    const [clave, setClave] = useState('');
    // El error se usa para mostrar el mensaje del servidor o de validación local
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // NUEVOS ESTADOS PARA EL BLOQUEO 
    const [failCount, setFailCount] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    // Estado para el tiempo restante del bloqueo
    const [lockTimeRemaining, setLockTimeRemaining] = useState(0);

    // Referencia para limpiar el timer del bloqueo si el componente se desmonta
    const lockTimerRef = useRef(null);
    // Referencia para el timer del contador de tiempo restante
    const countdownTimerRef = useRef(null);

    // Obtenemos la función login del AuthContext
    const { login, isLoggedIn } = useAuth();

    // Inicializo el hook de navegación
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/clientes');
        }
    }, [isLoggedIn, navigate]);

    // Effect para manejar el contador de tiempo restante del bloqueo
    useEffect(() => {
        // Si el bloqueo está activo, iniciar la cuenta regresiva
        if (isLocked) {
            // Inicializar el tiempo restante
            setLockTimeRemaining(LOCK_TIME_MS / 1000);

            // Configurar el contador de 1 segundo
            countdownTimerRef.current = setInterval(() => {
                setLockTimeRemaining(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(countdownTimerRef.current); // Detener el contador
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        // Función de limpieza para borrar ambos timers
        return () => {
            if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
            if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
        };
    }, [isLocked]);

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

    // NUEVA FUNCIÓN para manejar el bloqueo
    const startLockdown = () => {
        setIsLocked(true);
        // Establece el mensaje de error de bloqueo
        setError(`Demasiados intentos fallidos. Por favor, espera ${LOCK_TIME_MS / 1000} segundos.`);

        // Configura un timer para levantar el bloqueo
        lockTimerRef.current = setTimeout(() => {
            setIsLocked(false);
            setFailCount(0); // Resetea el contador de fallos
            setError(''); // Limpia el mensaje de error
            // También se borra el timer del countdown en el useEffect de limpieza
        }, LOCK_TIME_MS);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        // VALIDACIÓN: Si está bloqueado, salir y no procesar
        if (isLocked) {
            setError(`Tu cuenta está bloqueada temporalmente. Intenta de nuevo en ${lockTimeRemaining} segundos.`);
            return;
        }

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

        if (result.success) {
            // Si el login es exitoso, navegamos a la página principal de clientes y reinicia el contador
            setFailCount(0);
            navigate('/clientes');
        } else {
            // FALLO: Actualizar el contador de fallos
            setFailCount(prevCount => {
                const newCount = prevCount + 1;

                // Si el nuevo contador llega al límite, activar el bloqueo
                if (newCount >= MAX_ATTEMPTS) {
                    startLockdown();
                }

                // Si no está bloqueado, mostrar el error del backend
                if (!isLocked) {
                    setError(result.error);
                }

                return newCount;
            });

            // Mostrar el error del backend si no se activó el bloqueo en el setFailCount
            if (failCount + 1 < MAX_ATTEMPTS && !isLocked) {
                setError(result.error);
            }
        }

        setLoading(false); // Siempre termina el estado de carga
    };

    // La lógica para deshabilitar el botón
    const isLengthInvalid = username.length > MAX_LENGTH || clave.length > MAX_LENGTH;
    // NUEVA CONDICIÓN para deshabilitar el botón si está bloqueado
    const isButtonDisabled = loading || isLengthInvalid || isLocked; 
    
    // Mensaje para el contador de intentos fallidos
    const attemptsMessage = !isLocked && failCount > 0 ? 
        `Intentos restantes: ${MAX_ATTEMPTS - failCount}` : '';

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
                            // Deshabilitar si está bloqueado
                            disabled={isLocked}
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
                            // Deshabilitar si está bloqueado
                            disabled={isLocked}
                        />
                    </div>
                    {/* Muestra el mensaje de error/bloqueo */}
                    {error && <p className={`error-message ${isLocked ? 'locked-error' : ''}`}>{error}</p>}
                    
                    {/* Mensaje de intentos restantes */}
                    {attemptsMessage && !isLocked && (
                        <p className="attempts-message">{attemptsMessage}</p>
                    )}
                    
                    <button 
                        type="submit" 
                        className="login-button" 
                        // Deshabilitado si está cargando, si la longitud es inválida O si está bloqueado
                        disabled={isButtonDisabled}
                    >
                        {isLocked ? `Bloqueado (${lockTimeRemaining}s)` : (loading ? 'Iniciando Sesión...' : 'Iniciar Sesión')}
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
