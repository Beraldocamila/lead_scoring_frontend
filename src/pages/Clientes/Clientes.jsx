import "./Clientes.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FiSearch } from 'react-icons/fi';
import Header from '../../components/Header/Header'
import LoadingSpinner from "../../components/Spinner/Spinner";
import useClients from "../../hooks/useClients";
import useProducts from "../../hooks/useProducts";

const Clientes = () => {
  const { clients, loadingClients, clientError, getClients } = useClients();
  const { products, getProducts } = useProducts();

  const [filtro, setFiltro] = useState("");
  const [orden, setOrden] = useState("Nombre");
  const [filtroProducto, setFiltroProducto] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const clientesPorPagina = 10;
  const navigate = useNavigate();

  useEffect(() => {
    getClients();
    getProducts();
  }, []);

  // SPINNER MIENTRAS CARGA
  if (loadingClients) return <LoadingSpinner text="Cargando clientes." />;
  if (clientError) return <p>{clientError}</p>;

  // Obtener productos únicos para el filtro dinámico
  const uniqueProducts = Array.from(
    new Set(products.map((p) => p.tipo_producto))
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
        <div className="toolbar-container">
          <div className="search-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por DNI o nombre..."
              value={filtro}
              onChange={(e) => {
                setFiltro(e.target.value);
                setPaginaActual(1);
              }}
            />
          </div>

          {/* Ordenar y Filtrar */}
          <div className="filter-order-wrapper">

            {/* Selector de Ordenar */}
            <select
              className="filter-select"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
            >
              <option value="Nombre">Nombre ( A - Z )</option>
              <option value="DNI">DNI ( Menor a Mayor )</option>
            </select>


            {/* Selector de Filtrar */}
            <select
              className="filter-select"
              value={filtroProducto}
              onChange={(e) => {
                setFiltroProducto(e.target.value);
                setPaginaActual(1);
              }}
            >
              <option value="">Todos los Tipos</option>
              {uniqueProducts.map((p, i) => (
                <option key={i} value={p}>{p}</option>
              ))}
            </select>
          </div>
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