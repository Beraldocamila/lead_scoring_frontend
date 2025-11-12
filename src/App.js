import './App.css';
import './index.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DetalleCliente from './pages/DetalleCliente/DetalleCliente.jsx'; 
import Clientes from './pages/Clientes/Clientes.jsx';
import CorreosEnviados from "./pages/CorreosEnviados/CorreosEnviados.jsx";


function App() {


  return (

    <Router>
      <Routes>
        <Route path="/" element={<Clientes />} />
        <Route path="/DetalleCliente/:dni" element={<DetalleCliente />} />
        <Route path="/correos-enviados" element={<CorreosEnviados />} />

      </Routes>
    </Router>

  );
}

export default App;
