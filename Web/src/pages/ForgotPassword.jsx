import "../styles/Login.css";
import { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [pregunta, setPregunta] = useState("");
  const [datos, setDatos] = useState({ respuesta: "", newPassword: "" });
  const navigate = useNavigate();

  const handleGetQuestion = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/register/forgot-password/get-question", {
        email,
      });
      setPregunta(res.data.body.pregunta_seguridad);
      setStep(2);
    } catch (error) {
      alert("El correo electrónico no está registrado.");
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/register/forgot-password/reset", {
        email,
        respuesta: datos.respuesta,
        newPassword: datos.newPassword,
      });
      alert("Contraseña actualizada correctamente.");
      navigate("/login");
    } catch (error) {
      alert("La respuesta es incorrecta.");
    }
  };

  return (
    <div className="login-from-div">
      <section className="login-form">
        <h3 className="heading-login">Recuperar Cuenta</h3>

        {step === 1 ? (
          <form onSubmit={handleGetQuestion}>
            <div className="login">
              <div className="login-field">
                <label>Ingresa tu Email:</label>
                <input
                  type="email"
                  className="loginForm"
                  placeholder="ejemplo@correo.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="login-button">
                <button type="submit" className="btn-login">
                  Buscar Pregunta
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleReset}>
            <div className="login">
              <p style={{ marginBottom: "15px", color: "#555" }}>
                <strong>Pregunta:</strong> {pregunta}
              </p>
              <div className="login-field">
                <label>Tu Respuesta:</label>
                <input
                  type="text"
                  className="loginForm"
                  placeholder="Escribe tu respuesta"
                  onChange={(e) =>
                    setDatos({ ...datos, respuesta: e.target.value })
                  }
                  required
                />
              </div>
              <div className="login-field">
                <label>Nueva Contraseña:</label>
                <input
                  type="password"
                  className="loginForm"
                  placeholder="Mínimo 6 caracteres"
                  onChange={(e) =>
                    setDatos({ ...datos, newPassword: e.target.value })
                  }
                  required
                />
              </div>
              <div className="login-button">
                <button type="submit" className="btn-login">
                  Cambiar Contraseña
                </button>
              </div>
            </div>
          </form>
        )}

        <p className="not-count">
          <Link to="/login" className="nc-t">
            Volver al Login
          </Link>
        </p>
      </section>
    </div>
  );
}

export default ForgotPassword;
