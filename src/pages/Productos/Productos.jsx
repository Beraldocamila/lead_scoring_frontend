import React, { useState, useEffect, useMemo } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiX, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { AiOutlineCar, AiOutlineHome } from 'react-icons/ai';
import { FaRegHeart, FaArrowLeft } from 'react-icons/fa';
import { MdOutlineHealthAndSafety } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import api from '../../services/api';
import NotificationToast from '../../components/NotificationToast/NotificationToast'; 
import './productos.css';

// Pruebas sugeridas con componente Skeleton para carga
const ProductSkeleton = () => (
    <div className="producto-card skeleton-card">
        <div className="skeleton-header">
            <div className="skeleton-circle"></div>
            <div className="skeleton-title"></div>
        </div>
        <div className="skeleton-body">
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
        </div>
    </div>
);

const Productos = () => {
    const navigate = useNavigate();
    
    // Estados para Datos 
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingAction, setProcessingAction] = useState(false);

    // Estados para filtrado y paginacion
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('Todos');
    const [sortBy, setSortBy] = useState('nombre_asc'); // Opciones: nombre_asc, nombre_desc, prima_asc, prima_desc
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // Cantidad de tarjetas por pagina

    // Estados para modal y formulario
    const [modalAbierto, setModalAbierto] = useState(false);
    const [productoEditando, setProductoEditando] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        tipo_producto: 'Auto',
        coberturas_incluidas: '',
        prima_base: ''
    });
    
    // Estado para validacion visual ("touched" indica si el usuario ya interactuo con el campo)
    const [touchedFields, setTouchedFields] = useState({});

    // Estados de UI (Notificaciones y confirmaciones)
    const [notification, setNotification] = useState({ isVisible: false, type: 'success', message: '' });
    const [confirmDelete, setConfirmDelete] = useState({ isVisible: false, productoId: null, productoNombre: '' });

    const iconosPorTipo = {
        Auto: AiOutlineCar,
        Hogar: AiOutlineHome,
        Vida: FaRegHeart,
        Salud: MdOutlineHealthAndSafety
    };

    // Carga inicial de datos
    useEffect(() => {
        fetchProductos();
    }, []);

    // Resetear a la pagina 1 cuando cambian los filtros para evitar quedar en una pagina vacia
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterType, sortBy]);

    const fetchProductos = async () => {
        try {
            setLoading(true);
            const response = await api.get('/productos');
            setProductos(response.data);
        } catch (error) {
            console.error('Error al cargar:', error);
            showToast('error', 'Error al cargar los productos. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (type, message) => {
        setNotification({ isVisible: true, type, message });
    };

    // Logica de Filtrado y Ordenamiento (Optimizada con useMemo)
    const productosProcesados = useMemo(() => {
        let result = [...productos];

        // Filtro por busqueda (Nombre o Coberturas)
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(p => 
                p.nombre.toLowerCase().includes(term) || 
                p.coberturas_incluidas.toLowerCase().includes(term)
            );
        }

        // Filtro por tipo de producto
        if (filterType !== 'Todos') {
            result = result.filter(p => p.tipo_producto === filterType);
        }

        // Forma de ordenamiento
        result.sort((a, b) => {
            switch (sortBy) {
                case 'nombre_asc': return a.nombre.localeCompare(b.nombre);
                case 'nombre_desc': return b.nombre.localeCompare(a.nombre);
                case 'prima_asc': return a.prima_base - b.prima_base;
                case 'prima_desc': return b.prima_base - a.prima_base;
                default: return 0;
            }
        });

        return result;
    }, [productos, searchTerm, filterType, sortBy]);

    // Logica de paginacion
    const totalPages = Math.ceil(productosProcesados.length / itemsPerPage);
    const paginatedProducts = productosProcesados.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalItems = productosProcesados.length;

    // Manejo de formulario
    const abrirModalNuevo = () => {
        setProductoEditando(null);
        setFormData({ nombre: '', tipo_producto: 'Auto', coberturas_incluidas: '', prima_base: '' });
        setTouchedFields({}); // Reseteamos validaciones visuales
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
        setTouchedFields({});
        setModalAbierto(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Marca el campo como "tocado" cuando el usuario sale del input (onBlur)
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouchedFields(prev => ({ ...prev, [name]: true }));
    };

    // Verifica si un campo es invalido para mostrar borde rojo
    const isFieldInvalid = (name) => {
        return touchedFields[name] && !formData[name];
    };

    const handleSubmit = async () => {
        // Validar todos los campos al intentar enviar (simula que el usuario tocó todo)
        setTouchedFields({ nombre: true, coberturas_incluidas: true, prima_base: true });

        if (!formData.nombre || !formData.coberturas_incluidas || !formData.prima_base) {
            showToast('error', 'Por favor completa todos los campos requeridos');
            return;
        }

        try {
            setProcessingAction(true);
            const dataToSend = { ...formData, prima_base: Number(formData.prima_base) };

            if (productoEditando) {
                await api.put(`/productos/${productoEditando.id_producto}`, dataToSend);
                showToast('success', 'Producto actualizado exitosamente');
            } else {
                await api.post('/productos', dataToSend);
                showToast('success', 'Producto creado exitosamente');
            }

            await fetchProductos();
            setModalAbierto(false);
        } catch (error) {
            console.error('Error al guardar:', error);
            const msg = error.response?.data?.detail || 'Error al guardar el producto.';
            showToast('error', msg);
        } finally {
            setProcessingAction(false);
        }
    };

    const confirmarEliminacion = async () => {
        try {
            setProcessingAction(true);
            await api.delete(`/productos/${confirmDelete.productoId}`);
            showToast('success', 'Producto eliminado exitosamente');
            await fetchProductos();
        } catch (error) {
            console.error('Error al eliminar:', error);
            const msg = error.response?.data?.detail || 'Error al eliminar.';
            showToast('error', msg);
        } finally {
            setProcessingAction(false);
            setConfirmDelete({ isVisible: false, productoId: null, productoNombre: '' });
        }
    };

    const formatNumber = (num) => num ? num.toLocaleString('es-AR') : '0';

    return (
        <div className="productos-container">
            {/* Notificaciones Toast*/}
            <NotificationToast 
                isVisible={notification.isVisible}
                type={notification.type}
                message={notification.message}
                onClose={() => setNotification({ ...notification, isVisible: false })}
            />

            {/* HEADER */}
            <Header title="GESTIÓN DE PRODUCTOS" />

            <main className="productos-main">
                {/* BARRA DE HERRAMIENTAS: Busqueda, filtros y boton */}
                <div className="toolbar-container">
                    <div className="search-wrapper">
                        <FiSearch className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Buscar por nombre o cobertura..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    
                    <div className="filters-wrapper">
                        {/* Filtro por tipo */}
                        <select 
                            value={filterType} 
                            onChange={(e) => setFilterType(e.target.value)}
                            className="filter-select"
                        >
                            <option value="Todos">Todos los Tipos</option>
                            <option value="Auto">Auto</option>
                            <option value="Hogar">Hogar</option>
                            <option value="Vida">Vida</option>
                            <option value="Salud">Salud</option>
                        </select>

                        {/* Filtro de ordenamiento */}
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="filter-select"
                        >
                            <option value="nombre_asc">Nombre (A-Z)</option>
                            <option value="nombre_desc">Nombre (Z-A)</option>
                            <option value="prima_asc">Menor Precio</option>
                            <option value="prima_desc">Mayor Precio</option>
                        </select>

                        <button onClick={abrirModalNuevo} className="btn-add-product">
                            <FiPlus /> <span className="btn-text">Nuevo</span>
                        </button>
                    </div>
                </div>

                {/* GRID DE PRODUCTOS */}
                <div className="productos-grid">
                    {loading ? (
                        // Mostramos Skeletons mientras carga
                        [...Array(6)].map((_, i) => <ProductSkeleton key={i} />)
                    ) : paginatedProducts.length > 0 ? (
                        paginatedProducts.map(producto => {
                            const IconoTipo = iconosPorTipo[producto.tipo_producto];
                            return (
                                <div key={producto.id_producto} className="producto-card">
                                    <div className="producto-header">
                                        <div className="producto-icon-title">
                                            {IconoTipo && <IconoTipo className="producto-icon" />}
                                            <h3 className="producto-nombre" title={producto.nombre}>
                                                {producto.nombre}
                                            </h3>
                                        </div>
                                        <div className="producto-actions">
                                            <button onClick={() => abrirModalEditar(producto)} className="btn-icon" title="Editar">
                                                <FiEdit />
                                            </button>
                                            <button onClick={() => setConfirmDelete({ isVisible: true, productoId: producto.id_producto, productoNombre: producto.nombre })} className="btn-icon btn-delete" title="Eliminar">
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="producto-info">
                                        <div className="info-row">
                                            <span className="info-label">Tipo:</span>
                                            <span className="info-tag">{producto.tipo_producto}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Coberturas:</span>
                                            <span className="info-value truncate" title={producto.coberturas_incluidas}>
                                                {producto.coberturas_incluidas}
                                            </span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Prima Base:</span>
                                            <span className="info-value price">${formatNumber(producto.prima_base)}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">🔍</div>
                            <p className="empty-state-text">No se encontraron productos con esos filtros.</p>
                        </div>
                    )}
                </div>

                {/* PAGINACION */}
                {!loading && totalPages > 1 && (
                    <div className="paginacion">
                        <p>
                            Mostrando {Math.min(indexOfFirstItem + 1, totalItems)}-
                            {Math.min(indexOfLastItem, totalItems)} de{" "}
                            {totalItems} resultados
                        </p>
                        <div className="paginacion-botones">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                {"<"}
                            </button>
                            
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    className={currentPage === i + 1 ? "activo" : ""}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                {">"}
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* BOTON VOLVER */}
            <div className="fixed-return-button" onClick={() => navigate('/clientes')}>
                <FaArrowLeft className="return-icon" />
                <span className="return-text-hover">Volver a inicio</span>
            </div>

            {/* MODAL EDICION/CREACION */}
            {modalAbierto && (
                <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {productoEditando ? 'Editar Producto' : 'Nuevo Producto'}
                            </h2>
                            <button onClick={() => setModalAbierto(false)} className="btn-close-modal">
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
                            <button onClick={() => setModalAbierto(false)} className="btn-cancel">
                                Cancelar
                            </button>
                            <button onClick={handleSubmit} className="btn-submit">
                                {processingAction ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL CONFIRMACION */}
            {confirmDelete.isVisible && (
                <div className="modal-overlay" onClick={() => setConfirmDelete({ ...confirmDelete, isVisible: false })}>
                    <div className="modal-content modal-confirm" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Confirmar Eliminación</h2>
                            <button onClick={() => setConfirmDelete({ ...confirmDelete, isVisible: false })} className="btn-close-modal">
                                <FiX />
                            </button>
                        </div>

                        <div className="modal-body">
                            <p className="confirm-message">
                                ¿Estás seguro de que deseas eliminar <strong>{confirmDelete.productoNombre}</strong>?
                            </p>
                            <p className="confirm-warning">
                                Esta acción no se puede deshacer.
                            </p>
                        </div>

                        <div className="modal-footer">
                            <button onClick={() => setConfirmDelete({ ...confirmDelete, isVisible: false })} className="btn-cancel">
                                Cancelar
                            </button>
                            <button onClick={confirmarEliminacion} className="btn-confirm-delete">
                                {processingAction ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Productos;