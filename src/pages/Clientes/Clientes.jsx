import "./Clientes.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlinePlusCircle } from "react-icons/ai";
import api from "../../services/api"; // 👈 conexión con el backend
import Header from '../../components/Header/Header'

const Clientes = () => {
  const [clients, setClients] = useState([]); // clientes desde el backend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [orden, setOrden] = useState("Nombre");
  const [filtroProducto, setFiltroProducto] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const clientesPorPagina = 10;
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // ✅ Trae los clientes del backend (ya incluye productos)
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.get("/clientes");
        setClients(response.data);
      } catch (err) {
        console.error("Error al obtener clientes:", err);
        setError("No se pudieron cargar los clientes.");
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  if (loading) return <p>Cargando clientes...</p>;
  if (error) return <p>{error}</p>;

  // Obtener productos únicos para el filtro dinámico
  const uniqueProducts = Array.from(
    new Set(clients.flatMap((c) => c.productos || []))
  );

  // Filtrado por nombre, DNI y producto
  let clientesFiltrados = clients.filter(
    (c) =>
      (c.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
        c.dni?.includes(filtro)) &&
      (filtroProducto === "" || c.productos?.includes(filtroProducto))
  );

  // Ordenamiento
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
      <Header title="CLIENTES" />

      {/* MAIN CONTENT */}
      <main className="clientes-main">
        {/* FILTROS */}
        <div className="filtros">
          <input
            type="text"
            className="busqueda"
            placeholder="Buscar por DNI o nombre..."
            value={filtro}
            onChange={(e) => {
              setFiltro(e.target.value);
              setPaginaActual(1);
            }}
          />

          <select
            className="ordenar"
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
          >
            <option value="Nombre">Ordenar por: Nombre</option>
            <option value="DNI">Ordenar por: DNI</option>
          </select>

          <select
            className="filtrar"
            value={filtroProducto}
            onChange={(e) => {
              setFiltroProducto(e.target.value);
              setPaginaActual(1);
            }}
          >
            <option value="">Filtrar por: Producto</option>
            {uniqueProducts.map((p, i) => (
              <option key={i} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* TABLA DE CLIENTES */}
        <div className="tabla-container">
          <table className="clientes-tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>DNI</th>
                <th>Productos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientesMostrados.map((c, index) => (
                <tr key={index}>
                  <td>{c.nombre}</td>
                  <td>{c.dni}</td>
                  <td>{c.productos?.join(", ") || "-"}</td>
                  <td>
                    <button
                      className="accion-boton"
                      onClick={() => navigate(`/DetalleCliente/${c.dni}`)}
                    >
                      <AiOutlinePlusCircle className="material-symbols-outlined" />
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
              onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
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
