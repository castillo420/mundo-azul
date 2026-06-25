import React from "react";
import "../styles/JuegosDetails.css";
function juegos1() {
  return (
    <div className="juego-detail-section">
      <div className="juego-detail-content">
        <h1 className="juego-detail-heading">Juego 1: LETRAS</h1>
        <p className="juego-detail-paragraph">
          EN ESTE JUEGO DEBES UNIR LAS LETRAS.
        </p>

        <img
          src={require("../img/pictograma1.png")}
          width="600"
          height="200"
          alt="Pictograma de unir letras"
          className="juego-detail-image pictograma"
        />

        <a
          href="https://scratch.mit.edu/explore/projects/all"
          className="juego-detail-link"
          target="_blanck"
        >
          ABRIR JUEGO 1 LETRAS
        </a>

        <img
          src={require("../img/Juego111.png")}
          width="650"
          height="400"
          alt="Captura del Juego 1"
          className="juego-detail-image captura"
        />
      </div>
    </div>
  );
}

export default juegos1;
