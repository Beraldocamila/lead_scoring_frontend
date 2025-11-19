import UserMenu from "../UserMenu/UserMenu";
import "./header.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { LuMenu } from "react-icons/lu";
import { RxCross1 } from "react-icons/rx";
const Header = ({ title }) => {
    const [showMenu, setShowMenu] = useState(false);
    return (
        <header className="header-section">

            {/* IZQUIERDA - Logo */}
            <Link to="/clientes" className="logo-section">
                <h1 className="logo-icon">BDT</h1>
                <h2 className="logo-text">LeadScoring</h2>
            </Link>

            {/* CENTRO - Título */}
            <h2 className="header-page-title">{title}</h2>

            {/* DERECHA - Menu */}
            <div className="header-menu">
                <button
                    onClick={() => setShowMenu(prev => !prev)}
                    className={`header-user-menu-button ${showMenu ? "menu-open" : ""}`}
                >
                    {showMenu ? (
                        <RxCross1 className="menu-icon" />
                    ) : (
                        <LuMenu className="menu-icon" />
                    )}
                </button>

            {/* MENÚ */}
            <UserMenu isOpen={showMenu} onClose={() => setShowMenu(false)} />
            </div>

        </header>
    );
};

export default Header;