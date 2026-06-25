import React from "react";
import "../styles/SobreNosotros.css";

function SobreNosotros() {
  return (
    <div className="sobre-nosotros-page">
      <main className="sobre-nosotros-main-content">
        <h1 className="about-heading">Sobre Nosotros</h1>
        <p className="about-paragraph">
          Bienvenido a Mundo Azul, un sitio web dedicado a la creación de juegos
          y recursos educativos para niños autistas.
        </p>
        <p className="about-paragraph">
          En Mundo Azul, creemos que todos los niños merecen tener acceso a
          educación y recursos de alta calidad, independientemente de sus
          necesidades o habilidades.
        </p>

        <video width="640" height="480" controls loop className="about-video">
          <source
            src={require("../vid/VID-20241120-WA0110.mp4")}
            type="video/mp4"
          />
          Tu navegador no soporta la etiqueta de video.
        </video>

        <h2 className="about-subheading">Objetivo General</h2>
        <p className="about-paragraph">
          Nuestra página web “Mundo Azul” está diseñada específicamente para
          niños con autismo, con el objetivo de proporcionar una herramienta
          educativa y divertida para su desarrollo cognitivo y socioemocional.
        </p>

        <h2 className="about-subheading">Objetivos específicos</h2>
        <ul className="about-list">
          <li className="about-list-item">
            Brindar una herramienta de acompañamiento de desarrollo cognitivo.
          </li>
          <li className="about-list-item">
            Fomentar la atención y concentracion.
          </li>
          <li className="about-list-item">
            Mejorar la comunicación y expresion.
          </li>
          <li className="about-list-item">
            Desarrollar habilidades de memoria.
          </li>
        </ul>
      </main>
    </div>
  );
}

export default SobreNosotros;
