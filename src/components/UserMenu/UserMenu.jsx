import { useState } from "react";
import "./userMenu.css";
import { FiLogOut, FiEdit } from "react-icons/fi";
import { HiOutlineUsers } from "react-icons/hi2";
import { TfiEmail } from "react-icons/tfi";

import { FaUser } from "react-icons/fa";

import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const UserMenu = ({ isOpen, onClose }) => {

    const { user, logout } = useAuth(); //Obtenemos el nombre del usuario
    if (!isOpen) return null;

    return (
        <div className="container-menu">
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
                    {<Link to="/productos" className="dropdown-item">
                        <FiEdit className="dropdown-icon" />
                        EDITAR PRODUCTOS
                    </Link>}

                    <div className="dropdown-separator"></div>

                    {/* CERRAR SESION */}
                    <Link onClick={logout} className="dropdown-item logout-item">
                        <FiLogOut className="dropdown-icon logout-icon" />
                        CERRAR SESIÓN
                    </Link>
                </div>
        
        </div>
    );
};

export default UserMenu;
