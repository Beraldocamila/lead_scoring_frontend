import React, { useState, useEffect } from 'react';
import './modalCorreo.css';
import api from "../../services/api";

// URL base para la API de envío de correos
// const API_MAIL_ENDPOINT = ; 

// Definimos los pasos del modal. Primero inicia con la Seleccion del Formato, luego con la vista/edicion.
const steps = {
    select_format: 'select_format',
    preview_edit: 'preview_edit',
};


const ModalCorreo = ({ isVisible, clientDni, onClose, clientName, clientId, idProducto, onSendSuccess, showToast }) => {

    // primer modal en select_format para forzar la elección
    const [currentStep, setCurrentStep] = useState(steps.select_format); // primero inicia en "definir formato" despues puede cambiar a editar
    const [isSending, setIsSending] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // controla el modo para editar. 
    const [draftSubject, setDraftSubject] = useState('');
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
const toneMap = {
  formal: "muy_formal",
  intermedio: "neutral",
  informal: "informal"
};


    // Función que se llama al elegir un formato
const handleFormatSelect = async (format) => {
    setSelectedFormat(format);
    setError(null);

    try {
        const backendTone = toneMap[format];

        const response = await api.post("/correos/ia/generar-borrador", {
            id_persona: clientId || 0,
            id_producto: idProducto || 1,
            etapa_relacion: "prospecto",
            formalidad: backendTone
        });

        const { cuerpo_sugerido, asunto_sugerido } = response.data;

        // Pasar HTML → texto plano
        const plainText = cuerpo_sugerido
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<\/p>/gi, "\n\n")
            .replace(/<[^>]*>?/gm, "");

        setDraftText(plainText);
        setDraftSubject(asunto_sugerido || "");
        setCurrentStep(steps.preview_edit);
    } catch (err) {
        console.error(err);
        setError("Error generando el borrador.");
    }
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

const handleSendMail = async () => {
  try {
    setIsSending(true);

    const response = await api.post("/correos/ia/enviar-correo", {
      id_persona: clientId,
      id_producto: idProducto || 1,
      asunto: draftSubject,
      cuerpo: draftText,
    });

    // El backend devuelve status, mensaje, id_correo_log
    onSendSuccess(response.data.mensaje);

    showToast("success", `Correo enviado con éxito a ${clientName}!`);
    
    // Reset de estados
    setIsSending(false);
    onClose();
    setCurrentStep(steps.select_format);
    setDraftText('');
    setSelectedFormat(null);

  } catch (error) {
    console.error("Error al enviar correo:", error);

    let errMsg = error?.response?.data?.detail || "Error desconocido";
    showToast("error", "Error al enviar correo: " + errMsg);

    setIsSending(false);
  }
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

                <input
                    className="mail-subject-input"
                    value={draftSubject}
                    onChange={(e) => setDraftSubject(e.target.value)}
                    placeholder="Asunto del correo"
                    readOnly={!isEditing}
                    disabled={isSending}
                    style={{ marginBottom: "10px", width: "100%" }}
                />

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
                    onClick={handleSendMail} // <-- Usamos el MOCK
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