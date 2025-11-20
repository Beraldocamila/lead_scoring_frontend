import React from 'react';
import './modalVistaCorreo.css'; // Asumiendo que los estilos están aquí

const ModalVistaCorreo = ({ isVisible, emailData, onClose }) => {

    // Si no está visible o no hay datos, no renderizar nada
    if (!isVisible || !emailData) return null;

    // Desestructuramos el emailData para usar los campos directamente en el JSX
    const { mail, asunto, usuario, fecha_envio, cuerpo } = emailData;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>

                <header className="modal-header">
                    <h3>Detalle del Correo Enviado</h3>
                    <button className="modal-close-button" onClick={onClose}>
                        x
                    </button>
                </header>

                <div className="modal-body email-viewer">
                    <div className="email-meta">
                        <p><strong>Para:</strong> {mail}</p>
                        <p><strong>Asunto:</strong> {asunto}</p>
                        <p><strong>Enviado por:</strong> {usuario} ({fecha_envio})</p>
                    </div>

                    <div
                        className="email-body-content"
                        // Renderiza el contenido HTML del correo
                        dangerouslySetInnerHTML={{ __html: cuerpo }}
                    />
                </div>


                <footer className="modal-email-view-footer">
                    <button
                        className="modal-button modal-button--cancel"
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ModalVistaCorreo;