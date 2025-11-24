import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRegUser, FaSpinner, FaLock, FaArrowRight, FaExclamationCircle, FaPause, FaPlay, FaSun, FaMoon } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import FloatingPaths from '../../components/FloatingPaths/FloatingPaths'; 

import useAuth from '../../hooks/useAuth';
import './login.css';

const MAX_LENGTH = 20;
const MAX_ATTEMPTS = 3;
const LOCK_TIME_MS = 60000;

const Login = () => {
    const [username, setUsername] = useState('');
    const [clave, setClave] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [failCount, setFailCount] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [lockTimeRemaining, setLockTimeRemaining] = useState(0);
    const [animationsPaused, setAnimationsPaused] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const lockTimerRef = useRef(null);
    const countdownTimerRef = useRef(null);

    const { login, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/clientes');
        }
    }, [isLoggedIn, navigate]);

    // Effect para manejar dark-mode
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

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
                        clearInterval(countdownTimerRef.current);
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
        setter(value);
        if (value.length > MAX_LENGTH) {
            // Muestra el error de longitud inmediatamente
            setError(`Error: El campo "${fieldName}" no puede tener más de ${MAX_LENGTH} caracteres.`);
        } else if (error && error.startsWith('Error:')) {
            setError('');
        }
    };

    // Manejo de bloqueo
    const startLockdown = () => {
        setIsLocked(true);
        setError(`Demasiados intentos fallidos. Por favor, espera ${LOCK_TIME_MS / 1000} segundos.`);
        lockTimerRef.current = setTimeout(() => {
            setIsLocked(false);
            setFailCount(0);
            setError('');
        }, LOCK_TIME_MS);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (isLocked) {
            setError(`Tu cuenta está bloqueada temporalmente. Intenta de nuevo en ${lockTimeRemaining} segundos.`);
            return;
        }

        if (username.trim() === '' || clave.trim() === '') {
            setError('Por favor, ingresa tu usuario y contraseña.');
            return;
        }

        if (username.length > MAX_LENGTH || clave.length > MAX_LENGTH) {
            setError(`Por favor, corrige la longitud de los campos. Máximo ${MAX_LENGTH} caracteres permitidos.`);
            return;
        }

        setLoading(true);

        const result = await login(username, clave);

        if (result.success) {
            setFailCount(0);
            navigate('/clientes');
        } else {
            setFailCount(prevCount => {
                const newCount = prevCount + 1;
                if (newCount >= MAX_ATTEMPTS) {
                    startLockdown();
                }
                return newCount;
            });

            if (failCount + 1 < MAX_ATTEMPTS) {
                setError(result.error);
            }
        }
        setLoading(false);
    };

    const isLengthInvalid = username.length > MAX_LENGTH || clave.length > MAX_LENGTH;
    const isButtonDisabled = loading || isLengthInvalid || isLocked

    return (
        <div className="modern-login-container">
            {/* Fondo Animado (Las lineas de la izquierda) */}
            <FloatingPaths position={1} paused={animationsPaused} />
            <FloatingPaths position={-1} paused={animationsPaused} />

            {/* Panel izquierdo */}
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
                        <h1 className="login-title">LOGIN</h1>
                        <p className="login-subtitle">Bienvenido al sistema de Seguros</p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label className="label-text">Usuario</label>
                            <div className="input-wrapper">
                                <FaRegUser className="input-icon" />
                                <input 
                                    type="text" 
                                    className="modern-input" 
                                    placeholder="Ingresa tu usuario"
                                    value={username}
                                    onChange={(e) => handleInputChange(setUsername, e.target.value, 'Usuario')}
                                    disabled={isLocked}
                                    required
                                />
                            </div>
                        </div>

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
                                    disabled={isLocked}
                                    required
                                />
                            </div>
                        </div>

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

                        {!error && !isLocked && failCount > 0 && (
                            <motion.p 
                                className="attempts-text"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                Intentos restantes: {MAX_ATTEMPTS - failCount}
                            </motion.p>
                        )}

                        <motion.button 
                            type="submit" 
                            className="btn-modern"
                            disabled={isButtonDisabled}
                            whileHover={!isButtonDisabled ? { scale: 1.02 } : {}}
                            whileTap={!isButtonDisabled ? { scale: 0.98 } : {}}
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin" /> 
                                    <span>Validando...</span>
                                </>
                            ) : isLocked ? (
                                <>
                                    <FaLock /> 
                                    <span>Bloqueado ({lockTimeRemaining}s)</span>
                                </>
                            ) : (
                                <>
                                    <span>Iniciar Sesión</span> 
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
                        <p>¿No tienes una cuenta? <Link to="/register">Regístrate</Link></p>
                    </motion.div>
                </motion.div>
            </div>

            {/* Panel derecho*/}
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
                                top: 0,
                                left: 0,
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'contain',
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden' // Soporte para Safari/iOS
                            }} 
                        />

                        <img 
                            src="/img/logobdt.svg" 
                            alt="Logo BDT Back" 
                            style={{ 
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'contain',
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden', // Soporte para Safari/iOS
                                transform: 'rotateY(180deg)' // La giramos para que NO se vea en espejo
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
                    transition={{ delay: 0.9 }} // Un poco antes que el de pausa
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

export default Login;