import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import './detalleCliente.css';
import ModalCorreo from '../../components/ModalCorreo/ModalCorreo'
import Header from '../../components/Header/Header'
import NotificationToast from '../../components/NotificationToast/NotificationToast';
// Íconos
import { FaRegHeart, FaRegUser, FaRegEnvelope, FaArrowLeft,FaRegCheckCircle } from 'react-icons/fa';
import { LiaBirthdayCakeSolid } from 'react-icons/lia';
import { MdAlternateEmail, MdOutlineWorkOutline, MdOutlineHealthAndSafety } from 'react-icons/md';
import { AiOutlineCar, AiOutlineHome } from 'react-icons/ai';
import { IoLocationOutline } from "react-icons/io5";
import { BiIdCard } from "react-icons/bi";
import { RiBarChartFill } from "react-icons/ri";


//Spinner
import LoadingSpinner from '../../components/Spinner/Spinner';

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

  const [showMailModal, setShowMailModal] = useState(false);
  const [interacciones, setInteracciones] = useState([]);

  const [toast, setToast] = useState({visible: false, type: "success", message: ""});

  const handleSendSuccess = (mailBody) => {
    const newInteraction = {
      tipo: "Mail Enviado",
      descripcion: mailBody.substring(0, 50) + '...',
      fecha: new Date().toLocaleDateString('es-AR'),
    };
    setInteracciones((prev) => [newInteraction, ...prev]);
  };

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await api.get(`/predict/${dni}`);
        setClient(response.data);

        setInteracciones([
          {
            tipo: "Mail Enviado",
            descripcion: "Propuesta Seguro de Salud",
            fecha: "1 de Julio 2024"
          }
        ]);
      } catch (error) {
        console.error("Error al obtener datos del cliente:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClientData();
  }, [dni]);

  const showToast = (type, message) => {
  setToast({
    visible: true,
    type,
    message
  });
};

  // SPINNER MIENTRAS CARGA
  if (loading) return <LoadingSpinner text="Cargando información del cliente." />;
  if (!client) return <p>No se encontró información del cliente.</p>;

  const { score, nivel, features, productos_recomendados } = client;
  const formatNumber = (num) => (num || 0).toLocaleString('es-AR');

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
        <Header title={`CLIENTE - ${features.nombre_completo || features.nombre + " " + features.apellido}`} />

        <div className="column-layout">
          
          {/* COLUMNA IZQUIERDA */}
          <div className="col-izquierda">

            {/* PERFIL */}
            <div className="info-card">
              <h3 className="info-card-title">PERFIL Y CONTACTO</h3>
              <div className="profile-grid">
                <ProfileItem icon={FaRegUser} title="Nombre" value={features.nombre_completo} />
                <ProfileItem icon={BiIdCard} title="DNI" value={dni} />
                <ProfileItem icon={MdAlternateEmail} title="Mail" value={features.email || `${features.nombre.toLowerCase()}@mail.com`} />
                <ProfileItem icon={LiaBirthdayCakeSolid} title="Edad" value={`${features.edad} años`} />
                <ProfileItem icon={MdOutlineWorkOutline} title="Ocupación" value={features.ocupacion || "No especificada"} />
                <ProfileItem icon={FaRegHeart} title="Estado Civil" value={features.estado_civil || "No especificado"} />
                <ProfileItem icon={IoLocationOutline} title="Provincia" value={features.provincia || "Sin dato"} />
                <ProfileItem icon={RiBarChartFill} title="Score" value={`${score}/100 (${nivel})`} />
              </div>
            </div>

            {/* SEGUROS */}
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
              <div className="polizas-detalle-list">
                <h4>Coberturas</h4>

                {features.polizas_detalle.map((p, i) => (
                  <div key={i} className="poliza-item">

                    <span className="poliza-chip">
                      {p.tipo_seguro.toUpperCase()}
                    </span>

                    <div className="poliza-info">
                      <span><strong>Cobertura:</strong> {p.cobertura}</span>
                      <span><strong>Suma:</strong> ${formatNumber(p.suma_asegurada)}</span>
                      <span><strong>Prima:</strong> ${formatNumber(p.prima_pagada)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* INTERACCIONES */}
            <div className="info-card interacciones-card">
              <h3 className="info-card-title">INTERACCIONES</h3>
              {interacciones.length > 0 ? (
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


            {/* PRODUCTO RECOMENDADO */}
            {productos_recomendados && productos_recomendados.length > 0 && (
              <div className="info-card seguros-card">
                <h3 className="info-card-title">PRODUCTO RECOMENDADO</h3>

                <p className="seguros-subtitle">Basado en el análisis del perfil del cliente </p>

              <div className="seguros-tags">
                {productos_recomendados.map((prod, i) => {
                  const tipo = prod.valor.charAt(0).toUpperCase() + prod.valor.slice(1);
                  const Icon = seguroIcons[tipo] || FaRegCheckCircle;

                  return (
                    <div key={i} className="seguro-tag seguro-tag--active">
                      <Icon /> {tipo}
                    </div>
                  );
                })}
              </div>
              </div>
            )}

            {/* BOTÓN SI ES ALTO */}
            {nivel === "Alto" && (
              <button
                onClick={() => setShowMailModal(true)}
                className="email-button"
                style={{ backgroundColor: scoreColor }}
              >
                Enviar Correo
              </button>
            )}

            {/* BOTÓN SI ES MEDIO */}
            {nivel === "Medio" && (
              <div className="info-card" style={{ padding: "1.2rem", marginTop: "1rem" }}>
                <p style={{ fontSize: "0.95rem", marginBottom: "1rem" }}>
                  El nivel de este cliente es  <strong> MEDIO</strong>.  
                  ¿Querés enviar una recomendación de todas formas?
                </p>

                <button
                  onClick={() => setShowMailModal(true)}
                  className="email-button"
                  style={{ backgroundColor: scoreColor }}
                >
                  Enviar Correo
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Botón volver */}
      <div className="fixed-return-button" onClick={() => navigate('/clientes')}>
        <FaArrowLeft className="return-icon" />
        <span className="return-text-hover">Volver a inicio</span>
      </div>

      {/* MODAL */}
      <ModalCorreo
        isVisible={showMailModal}
        onClose={() => setShowMailModal(false)}
        clientId ={features.id}
        clientDni={dni}
        clientName={features.nombre_completo || `${features.nombre} ${features.apellido}`}
        onSendSuccess={handleSendSuccess}
        idProducto={(productos_recomendados.length > 0 && productos_recomendados?.[0].id) ?? null}
        showToast= {showToast}
      />

      <NotificationToast
          isVisible={toast.visible}
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
};

export default DetalleCliente;
