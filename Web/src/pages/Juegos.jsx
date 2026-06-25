import "../styles/Juegos.css";
import { Link } from "react-router-dom";
function Juegos() {
  return (
    <div className="juegos-section">
      <div className="juegos-content">
        <h1 className="juegos-heading">JUEGOS</h1>
        <p className="juegos-paragraph">
          EN ESTA SECCIÓN ENCONTRARAS LOS JUEGOS DISPONIBLES
        </p>

        <ul className="juegos-list">
          <li className="juegos-item">
            <Link to="/juego1" className="juegos-link">
              JUEGO 1: UNIR LETRAS
            </Link>
          </li>
          <img
            src={require("../img/Juego111.png")}
            width="650"
            height="400"
            alt="Captura de pantalla del Juego 1: Unir Letras"
            className="juego-imagen"
          />

          <li className="juegos-item">
            <Link to="/juego2" className="juegos-link">
              JUEGO 2: RECONOCER NÚMEROS
            </Link>
          </li>
          <img
            src={require("../img/captura del juego.png")}
            width="650"
            height="400"
            alt="Captura de pantalla del Juego 2: Reconocer Números"
            className="juego-imagen"
          />
        </ul>
      </div>
    </div>
  );
}

export default Juegos;
