import "./userMenu.css";
import { FiLogOut, FiEdit, FiMoon, FiSun } from "react-icons/fi";
import { HiOutlineUsers } from "react-icons/hi2";
import { TfiEmail } from "react-icons/tfi";
import { FaUser } from "react-icons/fa";

import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";
import { Link } from "react-router-dom";

const UserMenu = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth(); //Obtenemos el nombre del usuario
    const [theme, setTheme] = useTheme();

    if (!isOpen) return null;

    const toggleTheme = () => {
        setTheme(prev => prev === "light" ? "dark" : "light");
    };

    return (
        <div className="container-menu">
            <div className="dropdown-menu">
                {/* HEADER DEL USUARIO */}
                <div className="dropdown-item-header">
                    <FaUser className="dropdown-icon user-icon" />
                    <span className="truncate-name">{user?.username || "Usuario"}</span>
                </div>

                {/* CLIENTES */}
                <Link to="/clientes" className="dropdown-item">
                    <HiOutlineUsers className="dropdown-icon" />
                    CLIENTES
                </Link>

                {/* CORREOS ENVIADOS */}
                <Link to="/correos-enviados" className="dropdown-item">
                    <TfiEmail className="dropdown-icon" />
                    CORREOS ENVIADOS
                </Link>

                {/* EDITAR PRODUCTOS */}
                <Link to="/productos" className="dropdown-item">
                    <FiEdit className="dropdown-icon" />
                    EDITAR PRODUCTOS
                </Link>

                <div className="dropdown-separator"></div>

                {/* MODO OSCURO */}
                <button onClick={toggleTheme} className="dropdown-item theme-item">
                    {theme === "dark" ? (
                        <>
                            <FiSun className="dropdown-icon" /> 
                            MODO CLARO
                        </>
                    ) : (
                        <>
                            <FiMoon className="dropdown-icon" /> 
                            MODO OSCURO
                        </>
                    )}
                </button>

                <div className="dropdown-separator"></div>

                {/* CERRAR SESION */}
                <button onClick={logout} className="dropdown-item logout-item">
                    <FiLogOut className="dropdown-icon logout-icon" />
                    CERRAR SESIÓN
                </button>
            </div>
        </div>
    );
}

export default UserMenu;