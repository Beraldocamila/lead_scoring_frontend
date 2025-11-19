import React, { useEffect } from 'react';
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';
import './notificationToast.css'; 

const NotificationToast = ({ isVisible, type = 'success', message, onClose }) => {
    // Efecto para auto-cierre despues de 4 segundos
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 4000);
            // Limpieza del timer si el componente se desmonta o cambia la visibilidad
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    // Si no es visible, no renderizamos nada
    if (!isVisible) return null;

    // Mapeo de iconos según el tipo de notificacion
    const icons = {
        success: <FiCheckCircle />,
        error: <FiAlertCircle />,
        info: <FiInfo />
    };

    return (
        <div className={`toast-container toast-${type}`}>
            <div className="toast-icon">
                {/* Mostramos el icono correspondiente o info por defecto */}
                {icons[type] || icons.info}
            </div>
            
            <div className="toast-message">
                <p>{message}</p>
            </div>
            
            <button className="toast-close" onClick={onClose} aria-label="Cerrar notificación">
                <FiX />
            </button>
            
            {/* Barra de progreso visual para indicar el tiempo restante */}
            <div className="toast-progress"></div>
        </div>
    );
};

export default NotificationToast;