import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import { AiOutlineCar, AiOutlineHome } from 'react-icons/ai';
import { FaRegHeart, FaArrowLeft } from 'react-icons/fa';
import { MdOutlineHealthAndSafety } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import api from '../../services/api';
import './productos.css';

const Productos = () => {
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [productoEditando, setProductoEditando] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        tipo_producto: 'Auto',
        coberturas_incluidas: '',
        prima_base: ''
    });

    const iconosPorTipo = {
        Auto: AiOutlineCar,
        Hogar: AiOutlineHome,
        Vida: FaRegHeart,
        Salud: MdOutlineHealthAndSafety
    };

    // Cargar productos al montar el componente
    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        try {
        setLoading(true);
        const response = await api.get('/productos');
        console.log('Productos cargados:', response.data);
        setProductos(response.data);
        } catch (error) {
        console.error('Error al cargar productos:', error);
        alert('Error al cargar los productos. Por favor, intenta nuevamente.');
        } finally {
        setLoading(false);
        }
    };

    const abrirModalNuevo = () => {
        setProductoEditando(null);
        setFormData({
        nombre: '',
        tipo_producto: 'Auto',
        coberturas_incluidas: '',
        prima_base: ''
        });
        setModalAbierto(true);
    };

    const abrirModalEditar = (producto) => {
        setProductoEditando(producto);
        setFormData({
        nombre: producto.nombre,
        tipo_producto: producto.tipo_producto,
        coberturas_incluidas: producto.coberturas_incluidas || '',
        prima_base: producto.prima_base || ''
        });
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setProductoEditando(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
    };

    const handleSubmit = async () => {
        // Validamos
        if (!formData.nombre || !formData.coberturas_incluidas || !formData.prima_base) {
        alert('Por favor completa todos los campos obligatorios');
        return;
        }

        try {
        // Preparamos datos para enviar al backend
        const dataToSend = {
            nombre: formData.nombre,
            tipo_producto: formData.tipo_producto,
            coberturas_incluidas: formData.coberturas_incluidas,
            prima_base: Number(formData.prima_base)
        };

        if (productoEditando) {
            // Editar producto existente
            await api.put(`/productos/${productoEditando.id_producto}`, dataToSend);
            alert('Producto actualizado exitosamente');
        } else {
            // Crear nuevo producto
            await api.post('/productos', dataToSend);
            alert('Producto creado exitosamente');
        }

        // Recargar la lista de productos
        await fetchProductos();
        cerrarModal();
        } catch (error) {
        console.error('Error al guardar producto:', error);
        const errorMsg = error.response?.data?.detail || 'Error al guardar el producto. Por favor, intenta nuevamente.';
        alert(errorMsg);
        }
    };

    const eliminarProducto = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) {
        return;
        }

        try {
        const response = await api.delete(`/productos/${id}`);
        alert(response.data.mensaje || 'Producto eliminado exitosamente');
        // Recargar la lista de productos
        await fetchProductos();
        } catch (error) {
        console.error('Error al eliminar producto:', error);
        const errorMsg = error.response?.data?.detail || 'Error al eliminar el producto. Por favor, intenta nuevamente.';
        alert(errorMsg);
        }
    };

    const formatNumber = (num) => {
        if (!num) return '0';
        return num.toLocaleString('es-AR');
    };

    if (loading) {
        return (
        <div className="page-container">
            <div className="main-content">
            <Header title="GESTIÓN DE PRODUCTOS" />
            <div className="productos-content">
                <p style={{ textAlign: 'center', padding: '40px', fontSize: '1.1rem', color: 'var(--color-gray-text)' }}>
                Cargando productos...
                </p>
            </div>
            </div>
        </div>
        );
    }

    return (
        <div className="page-container">
        <div className="main-content">
            {/* HEADER */}
            <Header title="GESTIÓN DE PRODUCTOS" />

            {/* CUERPO PRINCIPAL */}
            <div className="productos-content">
            <div className="productos-header">
                <h2 className="productos-subtitle">Catálogo de Seguros</h2>
                <button onClick={abrirModalNuevo} className="btn-add-product">
                <FiPlus /> Nuevo Producto
                </button>
            </div>

            {productos.length === 0 ? (
                <div className="empty-state">
                <div className="empty-state-icon">📦</div>
                <p className="empty-state-text">No hay productos registrados. ¡Crea el primero!</p>
                </div>
            ) : (
                <div className="productos-grid">
                {productos.map(producto => {
                    const IconoTipo = iconosPorTipo[producto.tipo_producto];
                    
                    return (
                    <div key={producto.id_producto} className="producto-card">
                        <div className="producto-header">
                        <div className="producto-icon-title">
                            {IconoTipo && <IconoTipo className="producto-icon" />}
                            <h3 className="producto-nombre">{producto.nombre}</h3>
                        </div>
                        <div className="producto-actions">
                            <button 
                            onClick={() => abrirModalEditar(producto)}
                            className="btn-icon"
                            title="Editar"
                            >
                            <FiEdit />
                            </button>
                            <button 
                            onClick={() => eliminarProducto(producto.id_producto)}
                            className="btn-icon btn-delete"
                            title="Eliminar"
                            >
                            <FiTrash2 />
                            </button>
                        </div>
                        </div>

                        <div className="producto-info">
                        <div className="info-row">
                            <span className="info-label">Tipo:</span>
                            <span className="info-value">{producto.tipo_producto || 'No especificado'}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Coberturas:</span>
                            <span className="info-value">{producto.coberturas_incluidas || 'No especificadas'}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Prima Base:</span>
                            <span className="info-value">${formatNumber(producto.prima_base)}</span>
                        </div>
                        </div>
                    </div>
                    );
                })}
                </div>
            )}
            </div>
        </div>

        {/* Volver */}
        <div className="fixed-return-button" onClick={() => navigate('/clientes')}>
            <FaArrowLeft className="return-icon" />
            <span className="return-text-hover">Volver a inicio</span>
        </div>

        {/* MODAL */}
        {modalAbierto && (
            <div className="modal-overlay" onClick={cerrarModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                <h2 className="modal-title">
                    {productoEditando ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <button onClick={cerrarModal} className="btn-close-modal">
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
                    className="form-input"
                    placeholder="ej: Seguro de Auto Premium"
                    />
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
                    className="form-input"
                    placeholder="ej: Todo Riesgo, Responsabilidad Civil"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Prima Base (ARS) *</label>
                    <input
                    type="number"
                    name="prima_base"
                    value={formData.prima_base}
                    onChange={handleInputChange}
                    className="form-input"
                    min="0"
                    step="0.01"
                    placeholder="15000"
                    />
                </div>
                </div>

                <div className="modal-footer">
                <button onClick={cerrarModal} className="btn-cancel">
                    Cancelar
                </button>
                <button onClick={handleSubmit} className="btn-submit">
                    {productoEditando ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
                </div>
            </div>
            </div>
        )}
        </div>
    );
};

export default Productos;