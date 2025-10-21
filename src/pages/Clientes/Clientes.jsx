import "./Clientes.css";
import clientesData from "../../data/mockClientes.json";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";



const Clientes = () => {
  const [filtro, setFiltro] = useState("");
  const [orden, setOrden] = useState("Nombre");
  const [filtroPoliza, setFiltroPoliza] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const clientesPorPagina = 10;
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);


  // Filtrado por nombre, DNI y poliza
  let clientesFiltrados = clientesData.filter(c =>
    (c.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      c.dni.includes(filtro)) &&
    (filtroPoliza === "" || (c.polizas_activas || []).includes(filtroPoliza))
  );

  // Orden
  if (orden === "Nombre") {
    clientesFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
  } else if (orden === "DNI") {
    clientesFiltrados.sort((a, b) => a.dni.localeCompare(b.dni));
  }

  // Paginación
  const indiceUltimo = paginaActual * clientesPorPagina;
  const indicePrimero = indiceUltimo - clientesPorPagina;
  const clientesMostrados = clientesFiltrados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);
  

  return (
    <div className="clientes-container">
      {/* HEADER */}
    <header className="clientes-header">
  <div className="logo-section">
    <div className="logo-icon">
      <span className="material-symbols-outlined">shield</span>
    </div>
    <h1 className="logo-text">LeadScoring</h1>
  </div>

  <h2 className="page-title">CLIENTES</h2>

<div className="profile-section">

  <div className="container-menu">
    <button 
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className="header-user-menu-button"
    >
        <img 
            className='container-menu-img'
            src="/img/user.png" 
            alt="Menú de Usuario"
        />
        <span>
            {isUserMenuOpen ? '▲' : '▼'}
        </span>
    </button>

    {isUserMenuOpen && (
        <div className="dropdown-menu">
            <div className="dropdown-item-header">
                <img src="/img/icono_user.png" alt="Perfil"/>
                <span>Usuario</span>
            </div>

            <a href="#" className="dropdown-item">
                <img src="/img/icono_personas.png" alt="Clientes" />
                CLIENTES
            </a>

            <a href="#" className="dropdown-item">
                <img src="./img/icono_mail.png" alt="Correos Enviados" />
                CORREOS ENVIADOS
            </a>

            <a href="#" className="dropdown-item">
                <img src="/img/icono_editar.png" alt="Editar Productos" />
                EDITAR PRODUCTOS
            </a>

            <div className="dropdown-separator"></div>

            <a href="#" className="dropdown-item">
                <img src="/img/icono_cerrar_sesion.png" alt="Cerrar Sesión" />
                CERRAR SESIÓN
            </a>
        </div>
    )}
  </div>
</div>
</header>


      {/* MAIN CONTENT */}
      <main className="clientes-main">
        <div className="filtros">
          <input
            type="text"
            className="busqueda"
            placeholder="Buscar por DNI o nombre..."
            value={filtro}
            onChange={e => {
              setFiltro(e.target.value);
              setPaginaActual(1);
            }}
          />

          <select
            className="ordenar"
            value={orden}
            onChange={e => setOrden(e.target.value)}
          >
            <option value="Nombre">Ordenar por: Nombre</option>
            <option value="DNI">Ordenar por: DNI</option>
          </select>

          <select
            className="filtrar"
            value={filtroPoliza}
            onChange={e => {
              setFiltroPoliza(e.target.value);
              setPaginaActual(1);
            }}
          >
            <option value="">--Filtrar por: Póliza</option>
            <option value="Auto">Auto</option>
            <option value="Hogar">Hogar</option>
            <option value="Vida">Vida</option>
          </select>
        </div>

        {/* TABLA DE CLIENTES */}
        <div className="tabla-container">
          <table className="clientes-tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>DNI</th>
                <th>Pólizas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientesMostrados.map((c, index) => (
                <tr key={index}>
                  <td>{c.nombre}</td>
                  <td>{c.dni}</td>
                  <td>
                    {Array.isArray(c.polizas_activas)
                      ? c.polizas_activas.join(", ")
                      : c.polizas_activas || ""}
                  </td>
                  <td>
                    <button className="accion-boton"
                     onClick={() => navigate(`/DetalleCliente/${c.dni}`)}
                    >

                      <span className="material-symbols-outlined">visibility</span>
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
            {Math.min(indiceUltimo, clientesFiltrados.length)} de{" "}
            {clientesFiltrados.length} resultados
          </p>
          <div className="paginacion-botones">
            <button
              onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1}
            >
              {"<"}
            </button>
            {Array.from({ length: totalPaginas }, (_, i) => (
              <button
                key={i}
                className={paginaActual === i + 1 ? "activo" : ""}
                onClick={() => setPaginaActual(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setPaginaActual(prev => Math.min(prev + 1, totalPaginas))
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

export default Clientes;
