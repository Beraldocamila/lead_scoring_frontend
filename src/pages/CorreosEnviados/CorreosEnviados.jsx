import "./CorreosEnviados.css";
import correosData from "../../data/mockCorreos.json";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CorreosEnviados = () => {
  const [filtroDni, setFiltroDni] = useState("");
  const [filtroMail, setFiltroMail] = useState("");
  const [filtroPoliza, setFiltroPoliza] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const correosPorPagina = 10;
  const maxPaginasVisibles = 10;

  // Filtrado
  const correosFiltrados = correosData.filter((c) =>
  (filtroDni === "" || (c.dni && c.dni.toString().includes(filtroDni))) &&
  (filtroMail === "" || (c.mail && c.mail.toLowerCase().includes(filtroMail.toLowerCase()))) &&
  (filtroPoliza === "" || (c.poliza && c.poliza === filtroPoliza))
);

  // Paginación
  const totalPaginas = Math.ceil(correosFiltrados.length / correosPorPagina);
  const indiceUltimo = paginaActual * correosPorPagina;
  const indicePrimero = indiceUltimo - correosPorPagina;
  const correosMostrados = correosFiltrados.slice(indicePrimero, indiceUltimo);

  // Calcular rango visible de páginas
  const startPage = Math.max(
    1,
    paginaActual - Math.floor(maxPaginasVisibles / 2)
  );
  const endPage = Math.min(totalPaginas, startPage + maxPaginasVisibles - 1);
  const visiblePages = [];
  for (let i = startPage; i <= endPage; i++) visiblePages.push(i);

  return (
    <div className="correos-container">
      {/* HEADER */}
      <header className="correos-header">
        <div className="logo-section">
          <div className="logo-icon">
            <span className="material-symbols-outlined">Logo</span>
          </div>
          <h1 className="logo-text">LeadScoring</h1>
        </div>

        <h2 className="page-title">CORREOS ENVIADOS</h2>

        <div className="profile-section">
          <div className="container-menu">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="header-user-menu-button"
            >
              <img
                className="container-menu-img"
                src="/img/user.png"
                alt="Menú de Usuario"
              />
              <span>{isUserMenuOpen ? "▲" : "▼"}</span>
            </button>

            {isUserMenuOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-item-header">
                  <img src="/img/icono_user.png" alt="Perfil" />
                  <span>Usuario</span>
                </div>
                <a href="/" className="dropdown-item">
                  <img src="/img/icono_personas.png" alt="Clientes" />
                  CLIENTES
                </a>
                <a href="/correos-enviados" className="dropdown-item">
                  <img src="./img/icono_mail.png" alt="Correos Enviados" />
                  CORREOS ENVIADOS
                </a>
                <a href="#" className="dropdown-item">
                  <img src="/img/icono_editar.png" alt="Editar Productos" />
                  EDITAR PRODUCTOS
                </a>
                <div className="dropdown-separator"></div>
                <a href="#" className="dropdown-item">
                  <img
                    src="/img/icono_cerrar_sesion.png"
                    alt="Cerrar Sesión"
                  />
                  CERRAR SESIÓN
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="correos-main">
        <div className="filtros">
          <input
            type="text"
            className="busqueda"
            placeholder="Buscar por DNI..."
            value={filtroDni}
            onChange={(e) => {
              setFiltroDni(e.target.value);
              setPaginaActual(1);
            }}
          />
          <input
            type="text"
            className="busqueda"
            placeholder="Buscar por Mail..."
            value={filtroMail}
            onChange={(e) => {
              setFiltroMail(e.target.value);
              setPaginaActual(1);
            }}
          />
          <select
            className="filtrar"
            value={filtroPoliza}
            onChange={(e) => {
              setFiltroPoliza(e.target.value);
              setPaginaActual(1);
            }}
          >
            <option value="">--Filtrar por: Póliza</option>
            <option value="Auto">Auto</option>
            <option value="Hogar">Hogar</option>
            <option value="Vida">Vida</option>
            <option value="Salud">Salud</option>
          </select>
        </div>

        {/* TABLA */}
        <div className="tabla-container">
          <table className="correos-tabla">
            <thead>
              <tr>
                <th>Destinatario</th>
                <th>Asunto</th>
                <th>Fecha de Envío</th>
                <th>Ver Detalle</th>
              </tr>
            </thead>
            <tbody>
              {correosMostrados.map((c, index) => (
                <tr key={index}>
                  <td>{c.mail}</td>
                  <td>{c.asunto}</td>
                  <td>{c.fecha_envio}</td>
                  <td>
                    <button
                      className="accion-boton"
                      onClick={() => navigate(`/DetalleCorreo/${c.id}`)} //aca cambiarrr cuando este la pantalla de borrador de mails
                    >
                      <span className="material-symbols-outlined">
                        visibility
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        <div className="paginacion">
        <p>
            Mostrando {indicePrimero + 1}-
            {Math.min(indiceUltimo, correosFiltrados.length)} de{" "}
            {correosFiltrados.length} resultados
        </p>

        <div className="paginacion-botones">
            <button
            onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
            disabled={paginaActual === 1}
            >
            {"<"}
            </button>

            {Array.from({ length: Math.min(10, totalPaginas) }, (_, i) => {
            const pageNumber = i + 1 + Math.floor((paginaActual - 1) / 10) * 10;
            if (pageNumber > totalPaginas) return null;
            return (
                <button
                key={pageNumber}
                onClick={() => setPaginaActual(pageNumber)}
                className={pageNumber === paginaActual ? "activo" : ""}
                >
                {pageNumber}
                </button>
            );
            })}

            <button
            onClick={() =>
                setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
            }
            disabled={paginaActual === totalPaginas}
            >
            {">"}
            </button>
        </div>
     </div>

      </main>
    </div>
  );
};

export default CorreosEnviados;
