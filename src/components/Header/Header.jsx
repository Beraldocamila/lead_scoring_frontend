import UserMenu from "../UserMenu/UserMenu";
import "./header.css";


const Header = ({ title }) => {
    return (
        <header className="header-section">

            {/* IZQUIERDA - Logo */}
            <div className="logo-section">
                <span className="material-symbols-outlined logo-icon">LD</span>
                <h1 className="logo-text">LeadScoring</h1>
            </div>

            {/* CENTRO - Título */}
            <h2 className="header-page-title">{title}</h2>

            {/* DERECHA - Menu */}
            <UserMenu />

        </header>
    );
};

export default Header;