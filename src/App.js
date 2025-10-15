import './App.css';
import './index.css';
import React from 'react';
import DetalleCliente from './pages/DetalleCliente/DetalleCliente.jsx'; 

function App() {

  // '12345678' = Juan Gomez (ALTO score - Verde)
  // '87654321' = María Lopez (BAJO score - Rojo)
  // '23456789' = Carlos Pérez (MEDIO score - Naranja)
  const prueba_Dni = '12345678'; 

  return (
    <DetalleCliente 
        dni={prueba_Dni} 
      />
  );
}

export default App;
