import "./CorreosEnviados.css";
import { useState, useEffect } from "react";
import Header from '../../components/Header/Header'
import useAuth from "../../hooks/useAuth";
import useMails from "../../hooks/useMails";
import useProducts from "../../hooks/useProducts";

import ModalVistaCorreo from '../../components/ModalVistaCorreo/ModalVistaCorreo';
// SPINNER
import LoadingSpinner from '../../components/Spinner/Spinner';
import { FaRegEye } from "react-icons/fa";
import { FiSearch } from 'react-icons/fi';

//Libreria Fecha y Estilos
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CorreosEnviados = () => {
  const { user } = useAuth();
  const { mails, loadingMails, mailError, getMailsContext } = useMails();
  const { products } = useProducts();

  const [mostrarMios, setMostrarMios] = useState(false); // para mostrar mis correos enviados
  const [filtro, setFiltro] = useState("");
  const [filtroPoliza, setFiltroPoliza] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroFechaDate, setFiltroFechaDate] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);

  //Estados para ver el mail enviado
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [emailToView, setEmailToView] = useState(null);
  const correosPorPagina = 10;
  const maxPaginasVisibles = 10;

  //Trae todos los mails

  useEffect(() => {
    getMailsContext();
  }, []);

  if (loadingMails) return <LoadingSpinner text="Cargando correos..." />;
  if (mailError) return <p>{mailError}</p>;

  // Obtener productos únicos para el filtro dinámico
  const uniqueProducts = Array.from(
    new Set(products.map((p) => p.tipo_producto))
  );

  // Funcion para manejar modal de mail
  const handleViewEmail = (email) => {
    setEmailToView(email);
    setIsViewModalVisible(true);
  };

  // Funcion para cerrar el modal
  const handleCloseViewModal = () => {
    setIsViewModalVisible(false);
    setEmailToView(null);
  };

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
  const mailsFiltrados = mails.filter((m) =>
    (!filtro ||
      (m.dni && m.dni.toString().includes(filtro)) ||
      (m.mail && m.mail.toLowerCase().includes(filtro.toLowerCase()))
    ) &&
    (filtroPoliza === "" ||
      (() => {
        const prod = products.find(p => p.id_producto === m.id_producto);
        return prod && prod.tipo_producto.toLowerCase().includes(filtroPoliza.toLowerCase());
      })()
    ) &&
    (filtroFecha === "" || (m.fecha_envio && m.fecha_envio.startsWith(filtroFecha))) &&
    (!mostrarMios || (user && m.usuario === user.username))
  );

  // Paginación
  const totalPaginas = Math.ceil(mailsFiltrados.length / correosPorPagina);
  const indiceUltimo = paginaActual * correosPorPagina;
  const indicePrimero = indiceUltimo - correosPorPagina;
  const correosMostrados = mailsFiltrados.slice(indicePrimero, indiceUltimo);


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

        {/* FILTRO */}
        <div className="toolbar-container">
          {/* Busqueda */}
          <div className="search-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por DNI, Mail, o contenido..."
              value={filtro}
              onChange={(e) => {
                setFiltro(e.target.value);
                setPaginaActual(1);
              }}
            />
          </div>
          
          {/* Filtro Poliza, Fecha y Checkbox mios*/}
          <div className="filtros-secundarios">
            <div className="filtro-item">
              <DatePicker
                selected={filtroFechaDate}
                onChange={handleFechaChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="Fecha (dd/mm/aaaa)"
                className="datepicker-input"
                isClearable
              />
            </div>

            <div className="filtro-item">
              <select
                className="filter-select"
                value={filtroPoliza}
                onChange={(e) => setFiltroPoliza(e.target.value)}
              >
                <option value="">Todos los Tipos</option>
                {uniqueProducts.map((p, i) => (
                  <option key={i} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <label className="filtro-item checkbox-mios">
              <input
                type="checkbox"
                checked={mostrarMios}
                onChange={(e) => setMostrarMios(e.target.checked)}
              />
              Mostrar Mis Correos
            </label>
          </div>

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
                      onClick={() => handleViewEmail(c)} // Llama a la función del modal
                    >
                      <FaRegEye className="material-symbols-outlined" />
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
            {Math.min(indiceUltimo, mailsFiltrados.length)} de{" "}
            {mailsFiltrados.length} resultados
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

      {/* MODAL VISTA CORREO */}
      <ModalVistaCorreo
        isVisible={isViewModalVisible}
        emailData={emailToView}
        onClose={handleCloseViewModal}
      />
    </div>
  );
};

export default CorreosEnviados;
