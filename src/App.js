import './App.css';
import './index.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DetalleCliente from './pages/DetalleCliente/DetalleCliente.jsx'; 
import Clientes from './pages/Clientes/Clientes.jsx';

function App() {

  // '12345678' = Juan Gomez (ALTO score - Verde)
  // '87654321' = María Lopez (BAJO score - Rojo)
  // '23456789' = Carlos Pérez (MEDIO score - Naranja)
  // const prueba_Dni = '12345678'; 

  return (
     // <Clientes /> 

    <Router>
      <Routes>
        <Route path="/" element={<Clientes />} />
        <Route path="/DetalleCliente/:dni" element={<DetalleCliente />} />
      </Routes>
    </Router>


   // <DetalleCliente 
   //     dni={prueba_Dni} 
   //   />
  );
}

export default App;
