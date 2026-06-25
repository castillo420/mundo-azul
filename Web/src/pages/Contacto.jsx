import React from "react";
import "../styles/Contacto.css"; // Importamos los estilos

function Contacto() {
  // Manejador simple para prevenir el envío por defecto en React
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Formulario enviado (simulación).");
    // Aquí iría la lógica real para enviar los datos del formulario (ej. con fetch/axios)
  };

  return (
    <div className="contact-page-container">
      <main className="contact-main-content">
        <h1 className="contact-heading">Contacto</h1>
        <p className="contact-paragraph">
          Si tienes alguna pregunta o comentario, no dudes en contactarnos.
        </p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" required />
          </div>

          <div className="form-group">
            <label htmlFor="correo">Correo electrónico:</label>
            <input type="email" id="correo" name="correo" required />
          </div>

          <div className="form-group">
            <label htmlFor="mensaje">Mensaje:</label>
            <textarea id="mensaje" name="mensaje" required></textarea>
          </div>

          <div className="form-submit-group">
            <input type="submit" value="Enviar" className="btn-submit" />
          </div>
        </form>

        <ul className="contact-info-list">
          <li>
            <strong>Correo electrónico:</strong> mundoazul2024@gmail.com
          </li>
          <li>
            <strong>Teléfono:</strong> +54-3873-303781
          </li>
          <li>
            <strong>Dirección:</strong> Aguaray, Salta, Argentina
          </li>
          <li>
            <strong>Redes sociales:</strong>
            <ul className="social-list">
              <li>
                <a
                  href="https://facebook.com/MundoAzul2024"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook (Mundo Azul 2024)
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/Mundo_Azul"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter (Mundo_Azul)
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/Mundo_azul24"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram (Mundo_azul24)
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </main>
    </div>
  );
}

export default Contacto;
