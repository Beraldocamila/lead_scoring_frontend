import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import './detalleCliente.css';

// Importamos íconos
import { FaRegHeart, FaRegUser, FaRegCheckCircle, FaRegEnvelope, FaArrowLeft } from 'react-icons/fa';
import { LiaBirthdayCakeSolid } from 'react-icons/lia';
import { MdAlternateEmail, MdOutlineWorkOutline, MdOutlineHealthAndSafety } from 'react-icons/md';
import { AiOutlineCar, AiOutlineHome } from 'react-icons/ai';

// Componente para mostrar un item de perfil
const ProfileItem = ({ icon: Icon, title, value }) => (
  <div className="profile-item">
    <div className="profile-icon-wrapper">
      <Icon className="profile-icon" />
    </div>
    <div className="profile-text-group">
      <p className="profile-title">{title}</p>
      <p className="profile-value">{value}</p>
    </div>
  </div>
);

const DetalleCliente = () => {
  const { dni } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await api.get(`/predict/${dni}`);
        setClient(response.data);
      } catch (error) {
        console.error("Error al obtener datos del cliente:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClientData();
  }, [dni]);

  if (loading) return <p>Cargando información del cliente...</p>;
  if (!client) return <p>No se encontró información del cliente.</p>;

  const { score, nivel, features } = client;
  const formatNumber = (num) => (num || 0).toLocaleString('es-AR');

  // Colores del score
  let scoreTextColor, scoreBgColor, scoreBorderColor;
  if (score >= 71) {
    scoreTextColor = scoreBgColor = scoreBorderColor = 'var(--score-verde)';
  } else if (score >= 41) {
    scoreTextColor = scoreBgColor = scoreBorderColor = 'var(--score-naranja)';
  } else {
    scoreTextColor = scoreBgColor = scoreBorderColor = 'var(--score-rojo)';
  }

  const progress = `${score}%`;

  // Mapeo de iconos para pólizas activas
  const seguroIcons = {
    Hogar: AiOutlineHome,
    Auto: AiOutlineCar,
    Vida: FaRegHeart,
    Salud: MdOutlineHealthAndSafety,
  };

  // Determinar pólizas activas
  const polizasActivas = Object.entries(features)
    .filter(([key, value]) => key.startsWith("tiene_") && value === 1)
    .map(([key]) => key.replace("tiene_", "").toUpperCase());

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
            <h2 className="header-page-title">CLIENTE - {dni}</h2>
          </div>

          <div className="container-menu">
            <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="header-user-menu-button">
              <img className='container-menu-img' src="/img/user.png" alt="Menu de Usuario" />
              <span>{isUserMenuOpen ? '▲' : '▼'}</span>
            </button>
            {isUserMenuOpen && (
              <div className="dropdown-menu">
                <a href="#" className="dropdown-item"><img src="/img/icono_personas.png" alt="Clientes" />CLIENTES</a>
                <a href="#" className="dropdown-item"><img src="/img/icono_mail.png" alt="Correos Enviados" />CORREOS ENVIADOS</a>
                <a href="#" className="dropdown-item"><img src="/img/icono_editar.png" alt="Editar Productos" />EDITAR PRODUCTOS</a>
                <div style={{ borderTop: '1px solid #e5e7eb', margin: '0.25rem 0' }}></div>
                <a href="#" className="dropdown-item"><img src="/img/icono_cerrar_sesion.png" alt="Cerrar Sesion" />CERRAR SESION</a>
              </div>
            )}
          </div>
        </div>

        {/* Cuerpo principal */}
        <div className="column-layout">
          {/* Columna Izquierda */}
          <div className="col-izquierda">
            {/* Perfil */}
            <div className="info-card">
              <h3 className="info-card-title">PERFIL Y CONTACTO</h3>
              <div className="profile-grid">
                <ProfileItem icon={FaRegUser} title="DNI" value={dni} />
                <ProfileItem icon={LiaBirthdayCakeSolid} title="Edad" value={`${features.edad} años`} />
                <ProfileItem icon={MdOutlineWorkOutline} title="Ocupación" value={features.ocupacion || "No especificada"} />
                <ProfileItem icon={FaRegHeart} title="Estado Civil" value={features.estado_civil || "No especificado"} />
              </div>
            </div>

            {/* Estado de Seguros */}
            <div className="info-card seguros-card">
              <h3 className="info-card-title">ESTADO DE SEGUROS</h3>
              <p className="seguros-subtitle">Pólizas activas</p>
              <div className="seguros-tags">
                {["Hogar", "Auto", "Vida", "Salud"].map((tipo) => {
                  const Icon = seguroIcons[tipo];
                  const activo = polizasActivas.includes(tipo.toUpperCase());
                  const tagClass = activo ? 'seguro-tag--active' : 'seguro-tag--inactive';
                  return (
                    <div key={tipo} className={`seguro-tag ${tagClass}`}>
                      {Icon && <Icon />} {tipo}
                    </div>
                  );
                })}
              </div>

              <p className="seguros-antiguedad">
                Antigüedad del cliente: <strong>{features.antiguedad_cliente} meses</strong>
              </p>

              <div className="seguros-metrics-grid">
                <div>
                  <p className="metric-value">${formatNumber(features.suma_asegurada_total)}</p>
                  <p className="metric-label">Suma Asegurada Total</p>
                </div>
                <div>
                  <p className="metric-value">${formatNumber(features.costo_mensual_total_seguro)}</p>
                  <p className="metric-label">Costo Mensual Total</p>
                </div>
                <div>
                  <p className={`metric-value ${features.cuotas_impagas > 0 ? 'error-value' : ''}`}>
                    {features.cuotas_impagas}
                  </p>
                  <p className="metric-label">Cuotas Impagas</p>
                </div>
                <div>
                  <p className={`metric-value ${features.cantidad_siniestros > 0 ? 'error-value' : ''}`}>
                    {features.cantidad_siniestros}
                  </p>
                  <p className="metric-label">Siniestros</p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha */}
          <div className="col-derecha">
            {/* Score */}
            <div
              className="score-card"
              style={{ borderColor: scoreBorderColor, backgroundColor: `color-mix(in srgb, ${scoreBgColor} 10%, white)` }}
            >
              <h3 className="score-title" style={{ color: scoreTextColor }}>Score Actual</h3>
              <div className="score-bar-container">
                <div className="score-bar-fill" style={{ width: progress, backgroundColor: scoreBgColor }}></div>
              </div>
              <div className='score-value-container'>
                <p className="score-value" style={{ color: scoreTextColor }}>{score.toFixed(0)}/100</p>
                <p className="score-rango" style={{ backgroundColor: scoreBgColor }}>{nivel}</p>
              </div>
              <p className="score-message">
                {nivel === "Alto" ? "Apto para Cross-Selling" : "No apto para Cross-Selling"}
              </p>
            </div>

            {nivel === "Alto" && (
              <button className="email-button" style={{ backgroundColor: scoreBgColor }}>
                Visualizar Correo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Botón volver */}
      <div className="fixed-return-button" onClick={() => navigate('/')}>
        <FaArrowLeft className="return-icon" />
        <span className="return-text-hover">Volver a inicio</span>
      </div>
    </div>
  );
};

export default DetalleCliente;
