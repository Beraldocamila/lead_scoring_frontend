import { useState, useEffect, useMemo } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiX } from 'react-icons/fi';
import { AiOutlineCar, AiOutlineHome } from 'react-icons/ai';
import { FaRegHeart, FaArrowLeft } from 'react-icons/fa';
import { MdOutlineHealthAndSafety } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import NotificationToast from '../../components/NotificationToast/NotificationToast';
import ModalProductos from '../../components/ModalProductos/ModalProductos';
import BackButton from '../../components/BackButton/BackButton';
import './productos.css';

import useProducts from '../../hooks/useProducts';

// Skeleton para carga
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
    const { products, loadingProducts, getProducts, addProduct, updateProduct, deleteProduct } = useProducts();

    // Estados para Datos 
    const [processingAction, setProcessingAction] = useState(false);

    // Estados para filtrado y paginacion
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('Todos');
    const [sortBy, setSortBy] = useState('nombre_asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Estado para modal (Ahora simplificado)
    const [modalAbierto, setModalAbierto] = useState(false);
    const [productoEditando, setProductoEditando] = useState(null);

    // Estados de UI 
    const [notification, setNotification] = useState({ isVisible: false, type: 'success', message: '' });
    const [confirmDelete, setConfirmDelete] = useState({ isVisible: false, productoId: null, productoNombre: '' });

    const iconosPorTipo = {
        Auto: AiOutlineCar,
        Hogar: AiOutlineHome,
        Vida: FaRegHeart,
        Salud: MdOutlineHealthAndSafety
    };

    // Carga inicial
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                await getProducts();
            } catch (err) {
                console.error("Fallo la carga inicial de productos:", err);
                showToast('error', 'Error al cargar los productos iniciales.');
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterType, sortBy]);

    const showToast = (type, message) => {
        setNotification({ isVisible: true, type, message });
    };

    // pólizas disponibles para el filtro
    const availablePolizas = useMemo(() => {
        // Usamos la lista de productos del contexto
        if (!products || products.length === 0) return [];

        // Obtener productos únicos para el filtro dinámico
        return Array.from(new Set(
            products.map(p => p.tipo_producto).filter(Boolean)
        ));
    }, [products]);

    const productosProcesados = useMemo(() => {
        let result = [...products];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(p =>
                p.nombre.toLowerCase().includes(term) ||
                p.coberturas_incluidas.toLowerCase().includes(term)
            );
        }

        if (filterType !== 'Todos') {
            result = result.filter(p => p.tipo_producto === filterType);
        }

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
    }, [products, searchTerm, filterType, sortBy]);

    const totalPages = Math.ceil(productosProcesados.length / itemsPerPage);
    const paginatedProducts = productosProcesados.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalItems = productosProcesados.length;

    const abrirModalNuevo = () => {
        setProductoEditando(null);
        setModalAbierto(true);
    };

    const abrirModalEditar = (producto) => {
        setProductoEditando(producto);
        setModalAbierto(true);
    };


    // Aca se maneja el guardado (recibe datos del modal)
    const handleSaveProduct = async (formData) => {
        try {
            setProcessingAction(true);
            const dataToSend = { ...formData, prima_base: Number(formData.prima_base) };

            if (productoEditando) {
                // Usamos la función del contexto para actualizar
                await updateProduct(productoEditando.id_producto, dataToSend);
                showToast('success', 'Producto actualizado exitosamente');
            } else {
                // Usamos la función del contexto para crear
                await addProduct(dataToSend);
                showToast('success', 'Producto creado exitosamente');
            }

            // La llamada a getProducts() se maneja dentro de updateProduct/addProduct en el Context
            setModalAbierto(false);
        } catch (error) {
            console.error('Error al guardar:', error);
            const msg = error.response?.data?.detail || 'Error al guardar el producto.';
            showToast('error', msg);
        } finally {
            setProcessingAction(false);
        }
    };

    // Confirma la eliminación
    const confirmarEliminacion = async () => {
        try {
            setProcessingAction(true);

            // Usamos la función del contexto para eliminar
            await deleteProduct(confirmDelete.productoId);
            showToast('success', 'Producto eliminado exitosamente');

            // La llamada a getProducts() se maneja dentro de deleteProduct en el Context
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
            <NotificationToast
                isVisible={notification.isVisible}
                type={notification.type}
                message={notification.message}
                onClose={() => setNotification({ ...notification, isVisible: false })}
            />

            <Header title="GESTIÓN DE PRODUCTOS" />

            <main className="productos-main">
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

                    <div className="filter-date-button-wrapper">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="filter-select"
                        >
                            <option value="Todos">Todos los Tipos</option>
                            {availablePolizas.map((p, i) => (
                                <option key={i} value={p}>
                                    {p}
                                </option>
                            ))}
                        </select>

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

                <div className="productos-grid">
                    {loadingProducts ? (
                        [...Array(6)].map((_, i) => <ProductSkeleton key={i} />)
                    ) : products.length === 0 && !searchTerm && filterType === 'Todos' ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📄</div>
                            <p className="empty-state-text">No hay productos cargados en el sistema.</p>
                        </div>
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

                {!loadingProducts && totalPages > 1 && (
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

            <BackButton fallback="/clientes" />

            {/* Modal de productos*/}
            <ModalProductos
                isOpen={modalAbierto}
                onClose={() => setModalAbierto(false)}
                productoEditando={productoEditando}
                onSave={handleSaveProduct}
                processing={processingAction}
            />

            {/* Modal Confirmacion */}
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