import "./Clientes.css";
import clientesData from "../../data/mockClientes.json";
import React, { useState, useEffect } from "react";



function Clientes() {
  const clientes = clientesData;
  const [filtro, setFiltro] = useState("");
  const clientesFiltrados = clientes.filter(
  (c) =>
    c.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    c.dni.includes(filtro)
);
  const [menuAbierto, setMenuAbierto] = useState(false);

      useEffect(() => {
    document.title = "Clientes - BDT";
  }, []);

  return (
    <div className="clientes-container">
      <header className="clientes-header">

        <div className="logo">LOGO</div>
        <h1 className="titulo-principal">Clientes</h1>
          <div className="perfil" onClick={() => setMenuAbierto(!menuAbierto)}>
           <span className="emoji">👨‍💼</span>
          {menuAbierto && (
            <div className="menu-flotante">
                <p><strong>Usuario: prueba</strong></p>
                <ul>
                <li>Correos enviados</li>
                <li>Editar productos</li>
                <li>Cerrar sesión</li>
                </ul>
            </div>
            )}
      </div>
      </header>

 {/*busqueda*/}
      <div className="clientes-busqueda">
        <div className="buscador">
         <input
          type="text" 
           placeholder="Insertar DNI o Nombre"
             value={filtro}                        
            onChange={(e) => setFiltro(e.target.value)} 
        />

          <button>Buscar</button> {/*el boton esta de adorno*/}
        </div>

        <div className="acciones">
          <select>
            <option>Ordenar por</option>
          </select>
          <button className="filtrar">Filtrar</button>
        </div>
      </div>


{/*grilla*/}
      <div className="clientes-grid">
       {clientesFiltrados.map((c, index) => (
     <div className="cliente-card" key={index}> 
       <h3>{c.nombre}</h3>
       <p>DNI – {c.dni}</p>
       <button className="add-btn">+</button>
     </div>
    ))}

      </div>
    </div>
  );
}

export default Clientes;
