import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import './detalleCliente.css';
import ModalCorreo from '../../components/ModalCorreo'

// Íconos
import { FaRegHeart, FaRegUser, FaRegCheckCircle, FaRegEnvelope, FaArrowLeft } from 'react-icons/fa';
import { LiaBirthdayCakeSolid } from 'react-icons/lia';
import { MdAlternateEmail, MdOutlineWorkOutline, MdOutlineHealthAndSafety } from 'react-icons/md';
import { AiOutlineCar, AiOutlineHome } from 'react-icons/ai';

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

  // 🟣 Por ahora las interacciones son simuladas
  const [interacciones, setInteracciones] = useState([
    {
      tipo: "Mail Enviado",
      descripcion: "Propuesta Seguro de Salud",
      fecha: "1 de Julio 2024"
    }
  ]);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await api.get(`/predict/${dni}`);
        setClient(response.data);

        // 🔵 ACA SE DEBERÍA IMPLEMENTAR EL ENDPOINT DE REPORTES de correo  DEL BACK
        // Ejemplo futuro:
        // const resp = await api.get(`/reportes/interacciones/${dni}`);
        // setInteracciones(resp.data);

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
  let scoreColor;
  if (score >= 71) scoreColor = 'var(--score-verde)';
  else if (score >= 41) scoreColor = 'var(--score-naranja)';
  else scoreColor = 'var(--score-rojo)';

  const seguroIcons = {
    Hogar: AiOutlineHome,
    Auto: AiOutlineCar,
    Vida: FaRegHeart,
    Salud: MdOutlineHealthAndSafety,
  };

  const polizasActivas = Object.entries(features)
    .filter(([key, value]) => key.startsWith("tiene_") && value === 1)
    .map(([key]) => key.replace("tiene_", "").toUpperCase());

  return (
    <div className="page-container">
      <div className="main-content">
        {/* HEADER */}
        <div className="header-section">
          <div className="logo-section">
            <span className="material-symbols-outlined logo-icon">LD</span>
            <h1 className="logo-text">LeadScoring</h1>
          </div>
          <div className="page-title-group">
            <h2 className="header-page-title">
              CLIENTE - {features.nombre_completo || `${features.nombre} ${features.apellido}`}
            </h2>
          </div>
          <div className="container-menu">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="header-user-menu-button"
            >
              <img className="container-menu-img" src="/img/user.png" alt="Usuario" />
              <span>{isUserMenuOpen ? "▲" : "▼"}</span>
            </button>
            {isUserMenuOpen && (
              <div className="dropdown-menu">
                <a href="#" className="dropdown-item"><img src="/img/icono_personas.png" alt="" />CLIENTES</a>
                <a href="#" className="dropdown-item"><img src="/img/icono_mail.png" alt="" />CORREOS ENVIADOS</a>
                <a href="#" className="dropdown-item"><img src="/img/icono_editar.png" alt="" />EDITAR PRODUCTOS</a>
                <div style={{ borderTop: "1px solid #e5e7eb", margin: "0.25rem 0" }}></div>
                <a href="#" className="dropdown-item"><img src="/img/icono_cerrar_sesion.png" alt="" />CERRAR SESIÓN</a>
              </div>
            )}
          </div>
        </div>

        {/* CUERPO PRINCIPAL */}
        <div className="column-layout">
          {/* COLUMNA IZQUIERDA */}
          <div className="col-izquierda">
            {/* PERFIL Y CONTACTO */}
            <div className="info-card">
              <h3 className="info-card-title">PERFIL Y CONTACTO</h3>
              <div className="profile-grid">
                <ProfileItem icon={FaRegUser} title="Nombre" value={features.nombre_completo} />
                <ProfileItem icon={FaRegCheckCircle} title="DNI" value={dni} />
                <ProfileItem icon={MdAlternateEmail} title="Mail" value={features.email || `${features.nombre.toLowerCase()}@mail.com`} />
                <ProfileItem icon={LiaBirthdayCakeSolid} title="Edad" value={`${features.edad} años`} />
                <ProfileItem icon={MdOutlineWorkOutline} title="Ocupación" value={features.ocupacion || "No especificada"} />
                <ProfileItem icon={FaRegHeart} title="Estado Civil" value={features.estado_civil || "No especificado"} />
                <ProfileItem icon={MdOutlineHealthAndSafety} title="Provincia" value={features.provincia || "Sin dato"} />
                <ProfileItem icon={FaRegEnvelope} title="Score" value={`${score}/100 (${nivel})`} />
              </div>
            </div>

            {/* ESTADO DE SEGUROS */}
            <div className="info-card seguros-card">
              <h3 className="info-card-title">ESTADO DE SEGUROS</h3>
              <p className="seguros-subtitle">Pólizas activas</p>
              <div className="seguros-tags">
                {["Hogar", "Auto", "Vida", "Salud"].map((tipo) => {
                  const Icon = seguroIcons[tipo];
                  const activo = polizasActivas.includes(tipo.toUpperCase());
                  return (
                    <div key={tipo} className={`seguro-tag ${activo ? "seguro-tag--active" : "seguro-tag--inactive"}`}>
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
                  <p className={`metric-value ${features.cuotas_impagas > 0 ? "error-value" : ""}`}>
                    {features.cuotas_impagas}
                  </p>
                  <p className="metric-label">Cuotas Impagas</p>
                </div>
                <div>
                  <p className={`metric-value ${features.cantidad_siniestros > 0 ? "error-value" : ""}`}>
                    {features.cantidad_siniestros}
                  </p>
                  <p className="metric-label">Siniestros</p>
                </div>
              </div>

              {/* NUEVO BLOQUE DE COBERTURAS */}
              {features.polizas_detalle && features.polizas_detalle.length > 0 && (
                <div className="polizas-detalle-list">
                  <h4 style={{ marginTop: "1rem", fontWeight: 600 }}>Coberturas</h4>
                  {features.polizas_detalle.map((p, i) => (
                    <div key={i} className="poliza-item">
                      <p><strong>{p.tipo_seguro.toUpperCase()}:</strong> {p.cobertura}</p>
                      <p><strong>Suma asegurada:</strong> ${formatNumber(p.suma_asegurada)}</p>
                      <p><strong>Prima mensual:</strong> ${formatNumber(p.prima_pagada)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* INTERACCIONES */}
            <div className="info-card interacciones-card">
              <h3 className="info-card-title">INTERACCIONES</h3>
              {interacciones && interacciones.length > 0 ? (
                interacciones.map((interaccion, index) => (
                  <div key={index} className="interaccion-item">
                    <FaRegEnvelope className="interaccion-icon" />
                    <div className="interaccion-text">
                      <p>
                        <strong className="interaccion-type">{interaccion.tipo}</strong>: "{interaccion.descripcion}"
                      </p>
                      <span className="interaccion-date">{interaccion.fecha}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="interaccion-item">
                  <FaRegEnvelope className="interaccion-icon" />
                  <p>No se encontraron interacciones recientes.</p>
                </div>
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="col-derecha">
            <div className="score-card" style={{ borderColor: scoreColor, backgroundColor: `color-mix(in srgb, ${scoreColor} 10%, white)` }}>
              <h3 className="score-title" style={{ color: scoreColor }}>Score Actual</h3>
              <div className="score-bar-container">
                <div className="score-bar-fill" style={{ width: `${score}%`, backgroundColor: scoreColor }}></div>
              </div>
              <div className="score-value-container">
                <p className="score-value" style={{ color: scoreColor }}>{score.toFixed(0)}/100</p>
                <p className="score-rango" style={{ backgroundColor: scoreColor }}>{nivel}</p>
              </div>
              <p className="score-message">
                {nivel === "Alto" ? "Apto para Cross-Selling" : "No apto para Cross-Selling"}
              </p>
            </div>

            {nivel === "Alto" && (
              <button className="email-button" style={{ backgroundColor: scoreColor }}>
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
