import "../styles/Navbar.css";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div>
      <div className="header">
        <nav className="navbar">
          <div className="div-logo">
            <Link to="/" className="logo">
              Mundo Azul
            </Link>
          </div>

          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/juegos" className="btn-navbar">
                Juegos
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/sobrenosotros" className="btn-navbar">
                Sobre Nosotros
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contacto" className="btn-navbar">
                Contacto
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link to="/profile" className="btn-navbar">
                    Perfil de {user?.name}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/paneldecontrol" className="btn-navbar">
                    Panel de control
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/progreso" className="btn-navbar">
                    Progreso
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/"
                    onClick={() => {
                      logout();
                    }}
                    className="btn-navbar"
                  >
                    Salir
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="btn-navbar">
                    Iniciar Sesión
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="btn-navbar">
                    Registrarte
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
