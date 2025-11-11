import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import mockClientes from '../../data/mockClientes.json';
import './detalleCliente.css';
import ModalCorreo from '../../components/ModalCorreo'

// Importamos íconos
import { FaRegHeart, FaRegUser, FaRegCheckCircle, FaRegEnvelope, FaArrowLeft } from 'react-icons/fa';
import { LiaBirthdayCakeSolid } from 'react-icons/lia';
import { MdAlternateEmail, MdOutlineWorkOutline, MdOutlineHealthAndSafety } from 'react-icons/md';
import { AiOutlineCar, AiOutlineHome } from 'react-icons/ai';

// URL base de la API
// const API_URL =

// Función para buscar el cliente por DNI
const getClientData = (dni) => {
    // Convertimos ambos a String para la comparación
    return mockClientes.find((client) => String(client.dni) === String(dni));
};

// Componente para mostrar un item de perfil
const ProfileItem = ({ icon: Icon, title, value }) => (
    <div className="profile-item">
        <div className="profile-icon-wrapper">
            <Icon className="profile-icon" />
        </div>
        {/* Texto */}
        <div className="profile-text-group">
            <p className="profile-title">{title}</p>
            <p className="profile-value">{value}</p>
        </div>
    </div>
);


const DetalleCliente = () => {

    const { dni } = useParams();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showMailModal, setShowMailModal] = useState(false); // Estado del modal
    const [interacciones, setInteracciones] = useState([]); // Estado para interacciones

    // Función para formatear números a formato local (ej: 12.345.678)
    const formatNumber = (num) => (num || 0).toLocaleString('es-AR');

    useEffect(() => {
        const clientData = getClientData(dni);
        setClient(clientData);
        setInteracciones(clientData ? clientData.interacciones || [] : []);
        setLoading(false);
    }, [dni]);

    // FUNCIÓN PARA MANEJAR EL ENVÍO EXITOSO
    const handleSendSuccess = (mailBody) => {
        const newInteraction = {
            tipo: "Mail Enviado",
            descripcion: mailBody.substring(0, 50) + '...',
            fecha: new Date().toLocaleDateString('es-AR'),
        };
        // Agrega la nueva interacción al estado (simulando un POST exitoso al backend)
        setInteracciones(prev => [newInteraction, ...prev]);
    }

    if (loading) {
        return <p>Cargando datos del cliente...</p>;
    }


    if (!client) {
        return <p>No se encontró el cliente con DNI {dni}</p>;
    }

    // Lógica de Score
    const score = client.score_actual;
    let scoreTextColor;
    let scoreBgColor;
    let scoreBorderColor;
    const progress = `${score}%`;

    // Asignacion de variables CSS para el SCORE
    if (score >= 71) {
        scoreTextColor = 'var(--score-verde)';
        scoreBgColor = 'var(--score-verde)';
        scoreBorderColor = 'var(--score-verde)';
    } else if (score >= 41) {
        scoreTextColor = 'var(--score-naranja)';
        scoreBgColor = 'var(--score-naranja)';
        scoreBorderColor = 'var(--score-naranja)';
    } else {
        scoreTextColor = 'var(--score-rojo)';
        scoreBgColor = 'var(--score-rojo)';
        scoreBorderColor = 'var(--score-rojo)';
    }

    // Mapeo de iconos para los seguros activos
    const seguroIcons = {
        Hogar: AiOutlineHome, Auto: AiOutlineCar, Vida: FaRegHeart, Salud: MdOutlineHealthAndSafety,
    };
    // De esta manera podemos tomar el nombre de la poliza
    const polizas_map = [
        { key: 'poliza_hogar', nombre: 'Hogar' },
        { key: 'poliza_auto', nombre: 'Auto' },
        { key: 'poliza_vida', nombre: 'Vida' },
        { key: 'poliza_salud', nombre: 'Salud' },
    ];

    return (
        <div className="page-container">

            <div className="main-content">

                {/* Header */}
                <div className="header-section">

                    <div className="logo-section">
                        <span className="material-symbols-outlined logo-icon">LD</span>
                        <h1 className="logo-text">LeadScoring</h1>
                    </div>

                    <div className="page-title-group">
                        <h2 className="header-page-title">
                            CLIENTE - {client.nombre}
                        </h2>
                    </div>

                    <div className="container-menu">
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="header-user-menu-button"
                        >
                            <img className='container-menu-img' src="/img/user.png" alt="Menu de Usuario" />
                            <span>{isUserMenuOpen ? '▲' : '▼'}</span>
                        </button>
                        {isUserMenuOpen && (
                            <div className="dropdown-menu">
                                <div className="dropdown-item-header"><img src="/img/icono_user.png" alt="Perfil" /><span>User</span></div>
                                <a href="#" className="dropdown-item"><img src="/img/icono_personas.png" alt="Clientes" />CLIENTES</a>
                                <a href="#" className="dropdown-item"><img src="/img/icono_mail.png" alt="Correos Enviados" />CORREOS ENVIADOS</a>
                                <a href="#" className="dropdown-item"><img src="/img/icono_editar.png" alt="Editar Productos" />EDITAR PRODUCTOS</a>
                                <div style={{ borderTop: '1px solid #e5e7eb', margin: '0.25rem 0' }}></div>
                                <a href="#" className="dropdown-item"><img src="/img/icono_cerrar_sesion.png" alt="Cerrar Sesion" />CERRAR SESION</a>
                            </div>
                        )}
                    </div>
                </div>

                {/* BODY (LAYOUT DE DOS COLUMNAS) */}
                <div className="column-layout">

                    {/* COLUMNA IZQUIERDA */}
                    <div className="col-izquierda">

                        {/* 1 - PERFIL Y CONTACTO */}
                        <div className="info-card">
                            <h3 className="info-card-title">PERFIL Y CONTACTO</h3>
                            <div className="profile-grid">

                                <ProfileItem icon={FaRegUser} title="Nombres" value={client.nombre} />
                                <ProfileItem icon={FaRegCheckCircle} title="DNI" value={client.dni} />
                                <ProfileItem icon={LiaBirthdayCakeSolid} title="Edad" value={`${client.edad} años`} />
                                <ProfileItem icon={MdOutlineWorkOutline} title="Ocupacion" value={client.ocupacion} />
                                <ProfileItem icon={MdAlternateEmail} title="Mail" value={client.mail} />
                                <ProfileItem icon={FaRegHeart} title="Estado Civil" value={client.estado_civil} />
                            </div>
                        </div>

                        {/* 2 - ESTADO DE SEGUROS */}
                        <div className="info-card seguros-card">
                            <h3 className="info-card-title">ESTADO DE SEGUROS</h3>
                            <p className="seguros-subtitle">Pólizas activas</p>

                            {/* Polizas */}
                            <div className="seguros-tags">
                                {polizas_map.map((poliza) => {

                                    // Accede al valor de la propiedad del cliente usando poliza.key (ej: client['poliza_auto'])
                                    const tienePoliza = client[poliza.key] === 1;

                                    // Define el Icono y el Nombre a Mostrar
                                    const Icon = seguroIcons[poliza.nombre];

                                    // La clase se basa en si tiene la póliza
                                    const tagClass = tienePoliza ? 'seguro-tag--active' : 'seguro-tag--inactive';

                                    return (
                                        <div
                                            key={poliza.key}
                                            className={`seguro-tag ${tagClass}`}
                                        >
                                            {/* Renderiza el icono y el nombre */}
                                            {Icon && <Icon />} {poliza.nombre}
                                        </div>
                                    );
                                })}
                            </div>

                            <p className="seguros-antiguedad">Antigüedad del cliente: <strong>{client.antiguedad_meses} meses</strong></p>

                            <div className="seguros-metrics-grid">
                                <div>
                                    <p className="metric-value">${formatNumber(client.suma_asegurada)}</p>
                                    <p className="metric-label">Suma Asegurada Total</p>
                                </div>
                                <div>
                                    <p className="metric-value">${formatNumber(client.costo_mensual)}</p>
                                    <p className="metric-label">Costo Mensual Total</p>
                                </div>

                                <div>
                                    <p className={`metric-value ${client.cuotas_impagas > 0 ? 'error-value' : ''}`}>
                                        {client.cuotas_impagas}
                                    </p>
                                    <p className="metric-label">Cuotas Impagas</p>
                                </div>
                                <div>
                                    <p className={`metric-value ${client.siniestros > 0 ? 'error-value' : ''}`}>
                                        {client.siniestros}
                                    </p>
                                    <p className="metric-label">Siniestros</p>
                                </div>
                            </div>
                        </div>

                        {/* 3 - INTERACCIONES */}
                        {/* Esto va a cambiar. Al enviar mails se guardan y se cargan aca. */}
                        <div className="info-card interacciones-card">
                            <h3 className="info-card-title">INTERACCIONES</h3>

                            {(interacciones || []).map((interaccion, index) => (
                                <div key={index} className="interaccion-item">
                                    <FaRegEnvelope className="interaccion-icon" />
                                    <div className="interaccion-text">
                                        <p><strong className="interaccion-type">{interaccion.tipo}</strong>: "{interaccion.descripcion}"</p>
                                        <span className="interaccion-date">{interaccion.fecha}</span>
                                    </div>
                                </div>
                            ))}

                            {(!client.interacciones || client.interacciones.length === 0) && (
                                <div className="interaccion-item">No se encontraron interacciones recientes.</div>
                            )}
                        </div>

                    </div>

                    {/* COLUMNA DERECHA: SCORE */}
                    <div className="col-derecha">

                        {/* Tarjeta SCORE ACTUAL */}
                        <div
                            className="score-card"
                            style={{ borderColor: scoreBorderColor, backgroundColor: `color-mix(in srgb, ${scoreBgColor} 10%, white)` }}
                        >
                            <h3 className="score-title" style={{ color: scoreTextColor }}>
                                Score Actual
                            </h3>

                            {/* Barra de Progreso */}
                            <div className="score-bar-container">
                                <div
                                    className="score-bar-fill"
                                    style={{ width: progress, backgroundColor: scoreBgColor }}
                                ></div>
                            </div>

                            {/* Puntaje y Rango */}
                            <div className='score-value-container'>
                                <p className="score-value" style={{ color: scoreTextColor }}>{client.score_actual}/100</p>

                                <p className="score-rango" style={{ backgroundColor: scoreBgColor }}>
                                    {client.rango_score}
                                </p>
                            </div>

                            {/* Mensaje Apto/No Apto */}
                            <p className="score-message">
                                {client.estado_cross_selling}
                            </p>

                        </div>
                        
                        {/* Si el cliente es APTO aparece el boton */}
                        {(client.estado_cross_selling === 'Apto para Cross-Selling') && (
                            <button
                                onClick={() => setShowMailModal(true)} //con el click, habilita el modal
                                className="email-button"
                                style={{ backgroundColor: scoreBgColor }}
                            >
                                Enviar Correo
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="fixed-return-button" onClick={() => navigate('/')}>
                <FaArrowLeft className="return-icon" />
                <span className="return-text-hover">Volver a inicio</span>
            </div>

            {/* Renderizado del Modal */}
            <ModalCorreo
                isVisible={showMailModal} // se va a ver si esta en true
                onClose={() => setShowMailModal(false)}
                clientDni={client.dni}
                clientName={client.nombre}
                onSendSuccess={handleSendSuccess} // Cuando se conecte con el back, el mail va a ir a la DB
            />
        </div>
    );
};

export default DetalleCliente;