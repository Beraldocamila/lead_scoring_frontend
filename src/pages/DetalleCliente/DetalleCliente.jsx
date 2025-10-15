import React, { useState } from 'react';
import mockClientes from '../../data/mockClientes.json'; 
import './detalleCliente.css';

// Esto cambia. se conecta con el Back
const getClientData = (dni) => {
    return mockClientes.find(client => client.dni === dni);
};


const DetalleCliente = ({ dni: propDni }) => {

    const client = getClientData(propDni); 
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    // Score
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

    const primaryColor = 'var(--primary-blue)'; 

    return (
        <div className="page-container"> 
            
            {/* Contenedor principal de la pagina */}
            <div className="main-content">

                {/* Header */}
                <div className="header-section">
                    <div className="header-title-group">
                        {/* Icono Usuario */}
                        <img 
                            src="/img/icono_user.png" 
                            alt="Ícono de Usuario"
                            className="header-user-icon"
                        />
                        <h1 className="header-page-title">
                            {client.nombre}
                        </h1>
                    </div>
                    
                    {/* Menu */}
                    <div className="container-menu">
                        <button 
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="header-user-menu-button"
                        >
                            {/* Icono perfil*/}
                            <img 
                                className='container-menu-img'
                                src="/img/user.png" 
                                alt="Menu de Usuario"

                            />
                            <span>
                                {isUserMenuOpen ? '▲' : '▼'}
                            </span>
                        </button>
                        {isUserMenuOpen && (
                            <div className="dropdown-menu">
                                
                                {/*Encabezado menu user*/}
                                <div className="dropdown-item-header">
                                    <img src="/img/icono_user.png" alt="Perfil"/>
                                    <span>User</span>
                                </div>

                                {/* item: CLIENTES */}
                                <a href="#" className="dropdown-item">
                                    <img src="/img/icono_personas.png" alt="Clientes" />
                                    CLIENTES
                                </a>

                                {/* item: CORREOS ENVIADOS */}
                                <a href="#" className="dropdown-item">
                                    <img src="./img/icono_mail.png" alt="Correos Enviados" />
                                    CORREOS ENVIADOS
                                </a>

                                {/* item: EDITAR PRODUCTOS */}
                                <a href="#" className="dropdown-item">
                                    <img src="/img/icono_editar.png" alt="Editar Productos" />
                                    EDITAR PRODUCTOS
                                </a>

                                {/* Separador */}
                                <div style={{ borderTop: '1px solid #e5e7eb', margin: '0.25rem 0' }}></div>

                                {/* item: CERRAR SESION */}
                                <a href="#" className="dropdown-item">
                                    <img src="/img/icono_cerrar_sesion.png" alt="Cerrar Sesion" />
                                    CERRAR SESION
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* BODY */}
                <div className="column-layout">
                    
                    {/* Detalle Cliente*/}
                    <div className="col-izquierda">

                        {/* INFORMACIÓN PERSONAL */}
                        <div className="info-card">
                            <h3 className="info-card-title">
                                INFORMACIÓN PERSONAL
                            </h3>
                            <div className="info-card-content">
                                <p className="info-item-half"><strong>DNI:</strong> {client.dni}</p>
                                <p className="info-item-half"><strong >Edad:</strong> {client.edad} años</p>
                                <p className="info-item-full"><strong>Mail:</strong> {client.mail}</p>
                            </div>
                        </div>

                        {/* ESTADO DE SEGUROS */}
                        <div className="info-card">
                            <h3 className="info-card-title">
                                ESTADO DE SEGUROS
                            </h3>
                            <div className="info-card-content info-flex-stack">
                                <p><strong>Pólizas activas:</strong> {client.polizas_activas}</p>
                                <p><strong>Pagos:</strong> {client.pagos}</p>
                                <p><strong>Siniestros:</strong> {client.siniestros}</p>
                            </div>
                        </div>

                        {/* INTERACCIONES */}
                        <div className="info-card">
                            <h3 className="info-card-title">
                                INTERACCIONES
                            </h3>
                            <div className="info-card-content">
                                <p>{client.interacciones}</p>
                            </div>
                        </div>

                    </div>

                    {/* SCORE */}
                    <div className="col-derecha">

                        {/* Tarjeta SCORE ACTUAL */}
                        <div 
                            className="score-card"
                            style={{ borderColor: scoreBorderColor }} 
                        >
                            
                            <h3 className="score-title" style={{ color: scoreTextColor }}>
                                Score Actual
                            </h3>

                            {/* Barra */}
                            <div className="score-bar-container">
                                <div 
                                    className="score-bar-fill"
                                    style={{ width: progress, backgroundColor: scoreBgColor }}
                                ></div>
                            </div>
                            
                            {/* Puntaje y Rango */}
                            <p className="score-value" style={{ color: scoreTextColor }}>{client.score_actual}/100</p>
                            
                            <p className="score-rango" style={{ color: scoreTextColor }}>
                                {client.rango_score}
                            </p>
                            
                            {/* Mensaje Apto/No Apto */}
                            <p className="score-message" style={{ color: scoreTextColor }}>
                                {client.estado_cross_selling}
                            </p>

                        </div>
                            {/* Boton de Correo */}
                            {client.estado_cross_selling === 'Apto para Cross-Selling' && (
                                <button 
                                    onClick={() => console.log('Visualizar Correo')}
                                    className="email-button"
                                    style={{ backgroundColor: scoreBgColor }}
                                >
                                    Visualizar Correo
                                </button>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetalleCliente;