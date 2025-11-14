import "./CorreosEnviados.css";
import correosData from "../../data/mockCorreos.json";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../../components/Header/Header'

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
      <Header title="CORREOS ENVIADOS" />

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
