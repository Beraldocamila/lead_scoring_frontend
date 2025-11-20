import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import './modalProductos.css';

const ModalProductos = ({ isOpen, onClose, productoEditando, onSave, processing }) => {
    // Estado local del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        tipo_producto: 'Auto',
        coberturas_incluidas: '',
        prima_base: ''
    });

    // Estado para validacion visual
    const [touchedFields, setTouchedFields] = useState({});

    // Efecto para cargar datos cuando se abre para editar, o resetear si es nuevo
    useEffect(() => {
        if (isOpen) {
            if (productoEditando) {
                setFormData({
                    nombre: productoEditando.nombre,
                    tipo_producto: productoEditando.tipo_producto,
                    coberturas_incluidas: productoEditando.coberturas_incluidas || '',
                    prima_base: productoEditando.prima_base || ''
                });
            } else {
                // Reset para nuevo producto
                setFormData({ nombre: '', tipo_producto: 'Auto', coberturas_incluidas: '', prima_base: '' });
            }
            setTouchedFields({}); // Limpiar errores visuales previos
        }
    }, [isOpen, productoEditando]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouchedFields(prev => ({ ...prev, [name]: true }));
    };

    const isFieldInvalid = (name) => {
        return touchedFields[name] && !formData[name];
    };

    const handleSubmit = () => {
        // Marcar todos como tocados para mostrar errores si faltan datos
        setTouchedFields({ nombre: true, coberturas_incluidas: true, prima_base: true });

        if (!formData.nombre || !formData.coberturas_incluidas || !formData.prima_base) {
            return; // La validacion visual se encarga de mostrar lo que falta
        }

        // Enviamos los datos al padre
        onSave(formData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {productoEditando ? 'Editar Producto' : 'Nuevo Producto'}
                    </h2>
                    <button onClick={onClose} className="btn-close-modal">
                        <FiX />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="form-group">
                        <label className="form-label">Nombre del Producto *</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={`form-input ${isFieldInvalid('nombre') ? 'input-error' : ''}`}
                            placeholder="ej: Seguro Total"
                        />
                        {isFieldInvalid('nombre') && <span className="error-msg">Este campo es requerido</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Tipo de Seguro *</label>
                        <select
                            name="tipo_producto"
                            value={formData.tipo_producto}
                            onChange={handleInputChange}
                            className="form-select"
                        >
                            <option value="Auto">Auto</option>
                            <option value="Hogar">Hogar</option>
                            <option value="Vida">Vida</option>
                            <option value="Salud">Salud</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Coberturas Incluidas *</label>
                        <input
                            type="text"
                            name="coberturas_incluidas"
                            value={formData.coberturas_incluidas}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={`form-input ${isFieldInvalid('coberturas_incluidas') ? 'input-error' : ''}`}
                            placeholder="ej: Granizo, Robo..."
                        />
                        {isFieldInvalid('coberturas_incluidas') && <span className="error-msg">Este campo es requerido</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Prima Base (ARS) *</label>
                        <input
                            type="number"
                            name="prima_base"
                            value={formData.prima_base}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={`form-input ${isFieldInvalid('prima_base') ? 'input-error' : ''}`}
                            min="0"
                            step="0.01"
                        />
                        {isFieldInvalid('prima_base') && <span className="error-msg">Este campo es requerido</span>}
                    </div>
                </div>

                <div className="modal-footer">
                    <button onClick={onClose} className="btn-cancel">
                        Cancelar
                    </button>
                    <button onClick={handleSubmit} className="btn-submit" disabled={processing}>
                        {processing ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalProductos;