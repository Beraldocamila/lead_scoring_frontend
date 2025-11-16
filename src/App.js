import './App.css';
import './index.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 
// Componentes de Páginas
import DetalleCliente from './pages/DetalleCliente/DetalleCliente.jsx';
import Clientes from './pages/Clientes/Clientes.jsx';
import CorreosEnviados from "./pages/CorreosEnviados/CorreosEnviados.jsx";
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import Productos from './pages/Productos/Productos.jsx';


// Componentes de Autenticación
import { AuthProvider } from './contexts/AuthContext'; // Proveedor del Contexto
import useAuth from './hooks/useAuth.js'; // Hook para acceder al Contexto


// Este componente decide si el usuario puede acceder a una ruta.
const PrivateRoute = ({ element: Element, ...rest }) => {
  // Se usa el hook para obtener el estado de autenticación
  const { isLoggedIn, loading } = useAuth();

  // Muestra el estado de carga mientras se verifica el token inicial
  if (loading) {
    return <div className="loading-state">Verificando sesión...</div>;
  }

  // Si está autenticado, renderiza el componente (Clientes, DetalleCliente, etc.)
  // Si NO está autenticado, redirige al login ('/')
  return isLoggedIn
    ? <Element {...rest} />
    : <Navigate to="/" replace />;
};


function App() {
  return (
    // Se envuelve toda la aplicación con el AuthProvider para que el contexto esté disponible
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas accesibles sin estar logueado */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} /> 

          {/* Rutas que Requieren autenticación */}
          <Route
            path="/clientes"
            element={<PrivateRoute element={Clientes} />}
          />
          <Route
            path="/DetalleCliente/:dni"
            element={<PrivateRoute element={DetalleCliente} />}
          />
          <Route
            path="/correos-enviados"
            element={<PrivateRoute element={CorreosEnviados} />}
          />

          <Route 
          path="/productos" 
          element={<PrivateRoute element={Productos} />} 
          />


        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;