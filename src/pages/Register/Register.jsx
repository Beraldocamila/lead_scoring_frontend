import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRegUser, FaSpinner, FaArrowRight, FaExclamationCircle, FaPause, FaPlay, FaSun, FaMoon } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineMailOutline } from "react-icons/md";
import FloatingPaths from '../../components/FloatingPaths/FloatingPaths';
import NotificationToast from '../../components/NotificationToast/NotificationToast';
import authService from '../../services/authService';
import useAuth from '../../hooks/useAuth';
import './register.css';

// Constantes de Validación
const MAX_LENGTH = 20;
const MIN_LENGTH = 6;

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [clave, setClave] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({visible: false, type: "success", message: ""});
    
    // Estados de UI (Animaciones y Dark Mode)
    const [animationsPaused, setAnimationsPaused] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    // Effect para manejar dark-mode
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

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

    const showToast = (type, message) => {
        setToast({
            visible: true,
            type,
            message
        });
    };

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

        // LLAMADA AL BACKEND DE FASTAPI USANDO EL SERVICIO 
        try {
            // Llama a la función 'register' de authService.js
            const data = await authService.register(username, clave, email);
            
            // REGISTRO EXITOSO
            showToast("success", `${data.message}`);
            
            // Hace LOGIN automático usando AuthContext
            const loginResult = await login(username, clave);

            if (loginResult.success) {
                // Pequeño delay para que se vea el toast antes de navegar
                setTimeout(() => {
                    navigate('/clientes');
                }, 1000);
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
        <div className="modern-login-container">
            {/* Fondo Animado (Las lineas de la izquierda) */}
            <FloatingPaths position={1} paused={animationsPaused} />
            <FloatingPaths position={-1} paused={animationsPaused} />

            {/* Panel izquierdo - Formulario */}
            <div className="login-left-panel">
                <div className="login-glow" />
                
                <motion.div 
                    className="login-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="login-header">
                        <motion.div 
                            className="icon-container"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                        >
                            <FaRegUser />
                        </motion.div>
                        <h1 className="login-title">CREAR CUENTA</h1>
                        <p className="login-subtitle">Únete a la revolución de Seguros</p>
                    </div>

                    <form onSubmit={handleRegister}>
                        {/* Campo Usuario */}
                        <div className="form-group">
                            <label className="label-text">Usuario</label>
                            <div className="input-wrapper">
                                <FaRegUser className="input-icon" />
                                <input 
                                    type="text" 
                                    className="modern-input" 
                                    placeholder="Elige tu usuario"
                                    value={username}
                                    onChange={(e) => handleInputChange(setUsername, e.target.value, 'Usuario')}
                                    required
                                />
                            </div>
                        </div>

                        {/* Campo Email */}
                        <div className="form-group">
                            <label className="label-text">Email</label>
                            <div className="input-wrapper">
                                <MdOutlineMailOutline className="input-icon" />
                                <input 
                                    type="email" 
                                    className="modern-input" 
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => handleInputChange(setEmail, e.target.value, 'Email')}
                                    required
                                />
                            </div>
                        </div>

                        {/* Campo Contraseña */}
                        <div className="form-group">
                            <label className="label-text">Contraseña</label>
                            <div className="input-wrapper">
                                <RiLockPasswordLine className="input-icon" />
                                <input 
                                    type="password" 
                                    className="modern-input" 
                                    placeholder="••••••••"
                                    value={clave}
                                    onChange={(e) => handleInputChange(setClave, e.target.value, 'Contraseña')}
                                    required
                                />
                            </div>
                        </div>

                        {/* Mensajes de Error con AnimatePresence */}
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div 
                                    className="feedback-msg feedback-error"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                >
                                    <FaExclamationCircle size={16} style={{ flexShrink: 0 }} /> 
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button 
                            type="submit" 
                            className="btn-modern"
                            disabled={loading || isInvalid}
                            whileHover={(!loading && !isInvalid) ? { scale: 1.02 } : {}}
                            whileTap={(!loading && !isInvalid) ? { scale: 0.98 } : {}}
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin" /> 
                                    <span>Registrando...</span>
                                </>
                            ) : (
                                <>
                                    <span>Registrarse</span> 
                                    <FaArrowRight style={{ opacity: 0.7 }} />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <motion.div 
                        className="register-link"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <p>¿Ya tienes una cuenta? <Link to="/">Inicia Sesión</Link></p>
                    </motion.div>
                </motion.div>
                
                {/* Toast de Notificación fuera de la card pero dentro del panel */}
                <NotificationToast
                    isVisible={toast.visible}
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast({ ...toast, visible: false })}
                />
            </div>

            {/* Panel derecho - Idéntico al Login para continuidad visual */}
            <div className="login-right-panel">
                {/* GRADIENTE ANIMADO DE FONDO */}
                <motion.div 
                    className="animated-gradient-bg"
                    animate={animationsPaused ? {} : {
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                
                {/* Degradado para suavizar los bordes */}
                <div className="image-gradient-mask" />
                
                {/* OVERLAY con blur */}
                <div className="right-panel-overlay" />
                
                {/* Glows decorativos */}
                <motion.div 
                    className="right-glow-top"
                    animate={animationsPaused ? {} : {
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div 
                    className="right-glow-bottom"
                    animate={animationsPaused ? {} : {
                        scale: [1, 1.4, 1],
                        opacity: [0.25, 0.45, 0.25]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Contenido Textual */}
                <motion.div 
                    className="right-panel-content"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <motion.div 
                        className="hero-icon-box"
                        style={{ 
                            transformStyle: "preserve-3d",
                            position: 'relative',
                            height: '100px'
                        }} 
                        animate={animationsPaused 
                            ? { rotateY: 0 }
                            : { rotateY: [0, 360] }
                        }
                        transition={animationsPaused
                            ? { duration: 0.8, ease: "backOut" }
                            : { duration: 20, repeat: Infinity, ease: "linear" }
                        }
                    >
                        <img 
                            src="/img/logobdt.svg" 
                            alt="Logo BDT Front" 
                            style={{ 
                                position: 'absolute',
                                top: 0, left: 0, width: '100%', height: '100%', 
                                objectFit: 'contain',
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden'
                            }} 
                        />
                        <img 
                            src="/img/logobdt.svg" 
                            alt="Logo BDT Back" 
                            style={{ 
                                position: 'absolute',
                                top: 0, left: 0, width: '100%', height: '100%', 
                                objectFit: 'contain',
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)'
                            }} 
                        />
                    </motion.div>
                    
                    <motion.h2 
                        className="hero-title"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Gestión de <br/>
                        <span className="highlight-text">Seguros</span>
                    </motion.h2>
                    
                    <motion.p 
                        className="hero-desc"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Detectá las mejores oportunidades. Ahora conectá y transforma con nuestro sello de innovación Soulware.
                    </motion.p>
                </motion.div>

                {/* Boton de Tema (Modo Oscuro/Claro) */}
                <motion.button
                    className="animation-toggle-btn"
                    style={{ right: '90px' }} 
                    onClick={() => setDarkMode(!darkMode)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                >
                    {darkMode ? <FaSun /> : <FaMoon />}
                </motion.button>

                {/* Boton de pausa */}
                <motion.button
                    className="animation-toggle-btn"
                    onClick={() => setAnimationsPaused(!animationsPaused)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    {animationsPaused ? <FaPlay /> : <FaPause />}
                </motion.button>
            </div>
        </div>
    );
};

export default Register;