import "./CorreosEnviados.css";
//import correosData from "../../data/mockCorreos.json";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"; // conexión con backend
import Header from '../../components/Header/Header'
import useAuth from "../../hooks/useAuth";
// SPINNER
import LoadingSpinner from '../../components/Spinner/Spinner';

//Libreria Fecha y Estilos
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CorreosEnviados = () => {
  const { user } = useAuth();
  const [mostrarMios, setMostrarMios] = useState(false); // para mostrar mis correos enviados
  const [correos, setCorreos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availablePolizas, setAvailablePolizas] = useState([]);
  const [filtroDni, setFiltroDni] = useState("");
  const [filtroMail, setFiltroMail] = useState("");
  const [filtroPoliza, setFiltroPoliza] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroFechaDate, setFiltroFechaDate] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const navigate = useNavigate();

  const correosPorPagina = 10;
  const maxPaginasVisibles = 10;


  // Traer TODOS los correos del Back
  useEffect(() => {
    const fetchCorreos = async () => {
      try {
        const response = await api.get("/correos/historial");
        setCorreos(response.data);
      } catch (err) {
        console.error("Error al obtener correos:", err);
        setError("No se pudo cargar el historial de correos.");
      } finally {
        setLoading(false);
      }
    };
    fetchCorreos();
  }, []);

  useEffect(() => {
    const fetchPolizas = async () => {
      try {
        const response = await api.get("/productos");

        // Obtener productos únicos para el filtro dinámico
        const uniqueTypes = Array.from(new Set(
          response.data.map(p => p.tipo_producto || [])
        ));

        setAvailablePolizas(uniqueTypes); // Guardamos la lista limpia en el nuevo estado
      } catch (err) {
        console.error("Error al obtener productos:", err);
      }
    };
    fetchPolizas();
  }, []);

  if (loading) return <LoadingSpinner text="Cargando correos..." />;
  if (error) return <p>{error}</p>;

  // Funcion de cambio de fecha para el DatePicker
  const handleFechaChange = (date) => {
    // 1. Actualiza el estado del objeto Date para el DatePicker
    setFiltroFechaDate(date);

    // 2. Formatea la fecha a la cadena "YYYY-MM-DD" para el filtrado
    if (date) {
      const formattedDate = date.toISOString().split('T')[0]; // Ejemplo: "2025-11-16"
      setFiltroFecha(formattedDate);
    } else {
      setFiltroFecha(""); // Si la fecha es null (borrar), limpia el filtro
    }
  };

  // Filtrado
  const correosFiltrados = correos.filter((c) =>
    (filtroDni === "" || (c.dni && c.dni.toString().includes(filtroDni))) &&
    (filtroMail === "" || (c.mail && c.mail.toLowerCase().includes(filtroMail.toLowerCase()))) &&
    (filtroPoliza === "" || (c.asunto && c.asunto.toLowerCase().includes(filtroPoliza.toLowerCase()))) &&
    (filtroFecha === "" || (c.fecha_envio && c.fecha_envio.startsWith(filtroFecha))) &&
    (!mostrarMios || (user && c.usuario === user.username))
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
          <div className="datepicker-wrapper">
            <DatePicker
              selected={filtroFechaDate} // La fecha seleccionada (objeto Date)
              onChange={handleFechaChange} // la funcion que definimos
              dateFormat="dd/MM/yyyy" // Formato de visualización
              placeholderText="dd/mm/aaaa" // Texto por defecto
              className="busqueda datepicker-input"
              isClearable // Permite borrar la selección
            />
          </div>
          <select
            className="filtrar"
            value={filtroPoliza}
            onChange={(e) => {
              setFiltroPoliza(e.target.value);
              setPaginaActual(1);
            }}
          >
            <option value="">Filtrar por: Póliza</option>
            {availablePolizas.map((p, i) => (
              <option key={i} value={p}>
                {p}
              </option>
            ))}
          </select>

          <label className="mostrar-mios">
            <input
              type="checkbox"
              checked={mostrarMios}
              onChange={(e) => setMostrarMios(e.target.checked)}
            />
            Mostrar Mis Correos
          </label>
        </div>

        {/* TABLA */}
        <div className="tabla-container">
          <table className="correos-tabla">
            <thead>
              <tr>
                <th>Destinatario</th>
                <th>Asunto</th>
                <th>Fecha de Envío</th>
                <th>Usuario</th>
                <th>Ver Detalle</th>
              </tr>
            </thead>
            <tbody>
              {correosMostrados.map((c, index) => (
                <tr key={index}>
                  <td>{c.mail}</td>
                  <td>{c.asunto}</td>
                  <td>{c.fecha_envio}</td>
                  <td>{c.usuario}</td>
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
