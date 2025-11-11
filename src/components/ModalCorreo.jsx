import React, { useState, useEffect } from 'react';
import './modalCorreo.css';

// URL base para la API de envío de correos
// const API_MAIL_ENDPOINT = ; 

// Definimos los pasos del modal. Primero inicia con la Seleccion del Formato, luego con la vista/edicion.
const steps = {
    select_format: 'select_format',
    preview_edit: 'preview_edit',
};

// MOCK: formatos de correos (simulacion del back)
const generateDraft = (formatType, clientName) => { //segun el formato que elija el usuario, se va a generar un texto
    switch (formatType) {
        case 'formal':
            return `Estimado/a ${clientName}:\n\nLe comparto una propuesta de seguro que puede resultarle de interés. La opción [Nombre de Póliza Formal] ofrece una cobertura completa y confiable.\n\nQuedo a su disposición por cualquier consulta o si desea coordinar una llamada.\n\nSaludos cordiales,\n[Tu Nombre]`;

        case 'intermedio':
            return `Hola ${clientName},\n\nTe quería acercar una propuesta de seguro que puede ser una buena opción para vos. El plan [Nombre de Póliza Intermedia] tiene una excelente combinación de cobertura y precio.\n\nSi te interesa o querés charlar algún detalle, estoy a disposición.\n\nSaludos,\n[Tu Nombre]`;

        case 'informal':
            return `¡Hola ${clientName}!\n\nTe dejo una propuesta de seguro que creemos que te puede servir. El plan [Nombre de Póliza Simple] es práctico, fácil y muy completo.\n\nDale una mirada y cualquier duda me escribís.\n\n¡Abrazo!,\n[Tu Nombre]`;

        default:
            return `Borrador predeterminado para ${clientName}. (Debe seleccionar un formato).`;
    }
};

const ModalCorreo = ({ isVisible, clientDni, onClose, clientName, onSendSuccess }) => {

    // primer modal en select_format para forzar la elección
    const [currentStep, setCurrentStep] = useState(steps.select_format); // primero inicia en "definir formato" despues puede cambiar a editar
    const [isSending, setIsSending] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // controla el modo para editar. 
    const [draftText, setDraftText] = useState('');
    const [error, setError] = useState(null);
    const [selectedFormat, setSelectedFormat] = useState(null); // almacena el formato elegido por el usuario

    // Reiniciamos el estado al abrir el modal, forzando el primer paso
    useEffect(() => {
        if (isVisible) {
            setCurrentStep(steps.select_format);
            setDraftText('');
            setIsEditing(false);
            setError(null);
            setSelectedFormat(null);
        }
    }, [isVisible]);

    if (!isVisible) return null;

    // LÓGICA DE MANEJO DE PASOS

    // Función que se llama al elegir un formato
    const handleFormatSelect = (format) => {
        setSelectedFormat(format);
        // Genera el borrador inmediatamente con el nuevo formato
        const newDraft = generateDraft(format, clientName);
        setDraftText(newDraft);
        setCurrentStep(steps.preview_edit); // Pasar al paso de Vista Previa/Edición
    };

    // Función para volver a la selección de formato
    const handleGoBackToSelect = () => {
        setCurrentStep(steps.select_format);
        setIsEditing(false); // Aseguramos que no quede en modo edición
    };

    // Función para alternar la edición
    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    // FUNCIÓN DE ENVÍO

    const handleSendMailMock = () => {
        // Simulación de éxito
        setIsSending(true);
        setTimeout(() => {
            // Llama a la función de éxito para actualizar las interacciones
            onSendSuccess(`Propuesta Seguro de ...`);
            alert(` Correo enviado con éxito a ${clientName}!`);
            setIsSending(false);
            onClose();
            // Restablecer el estado para la próxima apertura
            setCurrentStep(steps.select_format);
            setDraftText('');
            setSelectedFormat(null);
        }, 800);
    };

    // RENDERIZADO DEL PASO DE SELECCIÓN DE FORMATO
    const renderFormatSelection = () => (
        <div className="format-selection-container">
            <h3>Seleccione el formato del correo</h3>
            <p className="selection-description">Elige el formato más adecuado. Se generará automáticamente un borrador de correo que podrás revisar y editar antes de enviar.</p>

            <div className="format-options">
                <div
                    className="format-card formal-format"
                    onClick={() => handleFormatSelect('formal')}
                >
                    <h4>Formal</h4>
                    <p>Tono profesional y respetuoso. Ideal para comunicaciones más serias.</p>
                </div>

                <div
                    className="format-card intermedio-format"
                    onClick={() => handleFormatSelect('intermedio')}
                >
                    <h4>Intermedio</h4>
                    <p>Cercano y claro, manteniendo una comunicación profesional y amigable.</p>
                </div>

                <div
                    className="format-card informal-format"
                    onClick={() => handleFormatSelect('informal')}
                >
                    <h4>Informal</h4>
                    <p>Relajado y directo. Perfecto para mensajes simples y de trato más cercano.</p>
                </div>
            </div>

            <footer className="modal-footer footer-selection">
                <button
                    className="modal-button modal-button--cancel"
                    onClick={onClose}
                >
                    Cancelar
                </button>
            </footer>
        </div>
    );

    // RENDERIZADO DEL PASO DE VISTA PREVIA/EDICIÓN
    const renderPreviewEdit = () => (
        <>
            <div className="modal-body">
                {error && <p className="error-message">{error}</p>}

                <div className="format-info">
                    Formato Seleccionado: <span className={`format-tag format-tag--${selectedFormat}`}>{selectedFormat?.toUpperCase()}</span>
                </div>

                <textarea
                    className={`mail-textarea ${isEditing ? 'mail-textarea--editing' : ''}`}
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    readOnly={!isEditing}
                    disabled={isSending}
                />
            </div>

            <footer className="modal-footer">
                {/* Botón ENVIAR */}
                <button
                    className="modal-button modal-button--send"
                    onClick={handleSendMailMock} // <-- Usamos el MOCK
                    disabled={isSending || draftText.length < 10}
                >
                    {isSending ? 'Enviando...' : 'Enviar'}
                </button>

                {/* Botón EDITAR / GUARDAR */}
                <button
                    className="modal-button modal-button--edit"
                    onClick={handleEditToggle}
                    disabled={isSending}
                >
                    {isEditing ? 'Guardar Cambios' : 'Editar'}
                </button>

                {/* Botón VOLVER */}
                <button
                    className="modal-button modal-button--back"
                    onClick={handleGoBackToSelect}
                    disabled={isSending}
                >
                    Elegir Formato
                </button>

                {/* Botón CANCELAR */}
                <button
                    className="modal-button modal-button--cancel"
                    onClick={onClose}
                    disabled={isSending}
                >
                    Cerrar
                </button>
            </footer>
        </>
    );

    // ESTRUCTURA PRINCIPAL DEL MODAL 
    return (
        <div className="modal-overlay" onClick={isEditing ? null : onClose}>

            {/* Contenido del Modal */}
            <div className="modal-content" onClick={e => e.stopPropagation()}>

                <header className="modal-header">
                    <h3>Correo para {clientName}</h3>
                    <button className="modal-close-button" onClick={onClose} disabled={isEditing || isSending}>
                        x
                    </button>
                </header>

                {/* Renderizado condicional basado en el paso actual */}
                {currentStep === steps.select_format
                    ? renderFormatSelection()
                    : renderPreviewEdit()
                }

            </div>
        </div>
    );
};

export default ModalCorreo;