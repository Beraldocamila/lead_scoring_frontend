import { useState } from "react";
import "./userMenu.css";
import { FiLogOut, FiEdit } from "react-icons/fi";
import { HiOutlineUsers } from "react-icons/hi2";
import { TfiEmail } from "react-icons/tfi";
import { LuMenu } from "react-icons/lu";
import { RxCross1 } from "react-icons/rx";
import { FaUser } from "react-icons/fa";

import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const UserMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const { user, logout } = useAuth(); //Obtenemos el nombre del usuario

    return (
        <div className="container-menu">
            {/* BOTON DEL MENU */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="header-user-menu-button"
            >
                {isOpen ? (
                    <RxCross1 className="menu-icon" />
                ) : (
                    <LuMenu className="menu-icon" />
                )}
            </button>

            {/* DROPDOWN */}
            {isOpen && (
                <div className="dropdown-menu">
                    
                    {/* HEADER DEL USUARIO */}
                    <div className="dropdown-item-header">
                        <FaUser className="dropdown-icon user-icon" />
                        <span>{user?.username || "Usuario"}</span>
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
                    {/* <Link to="#" className="dropdown-item">
                        <FiEdit className="dropdown-icon" />
                        EDITAR PRODUCTOS
                    </Link> */}

                    <div className="dropdown-separator"></div>

                    {/* CERRAR SESION */}
                    <Link onClick={logout} className="dropdown-item logout-item">
                        <FiLogOut className="dropdown-icon logout-icon" />
                        CERRAR SESIÓN
                    </Link>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
