import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/PanelDeControl.css";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import axios from "../api/axios";

function PanelDeControl() {
  const { user, isAuthenticated, loading } = useAuth();
  const [totalUsuarios, setTotalUsuarios] = useState("...");
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState("");

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const res = await axios.get("/register/count");
        if (res.data && res.data.body) {
          setTotalUsuarios(res.data.body.count);
        }
      } catch (error) {
        console.error("Error al contar usuarios", error);
        setTotalUsuarios("Error");
      }
    };
    if (isAuthenticated) fetchUserCount();
  }, [isAuthenticated]);

  const enviarSolicitudArea = async () => {
    try {
      await axios.post("/register/solicitar-area", {
        especialidad: nuevaEspecialidad,
      });
      alert("Solicitud de área técnica enviada con éxito.");
      window.location.reload();
    } catch (error) {
      alert("Error: " + (error.response?.data?.body || error.message));
    }
  };

  const solicitarSerEspecialista = async () => {
    if (window.confirm("¿Deseas enviar una solicitud para ser Especialista?")) {
      try {
        await axios.post("/register/solicitar-especialista");
        alert("Solicitud enviada. Un administrador la revisará pronto.");
      } catch (error) {
        alert("Error al enviar la solicitud.");
      }
    }
  };

  const formatearFecha = (fechaISO) => {
    if (!fechaISO || fechaISO === "No disponible") return "No disponible";
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading)
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const nombreUsuario = typeof user === "object" ? user?.name : user;
  const rolUsuario = user?.nombre_rol;
  const fechaRegis = user?.fecha_regis || "No disponible";

  // Capturamos la especialidad actual aprobada
  const especialidadAprobada = user?.especialidad;

  return (
    <div className="panel-container">
      <header className="panel-header">
        <h1>Bienvenido/a, {nombreUsuario}</h1>

        {/* Usamos la clase .panel-rol para mantener el estilo de tu CSS */}
        <p className="panel-rol">
          <strong>Rol:</strong> {rolUsuario}
        </p>

        {/* Mostramos la especialidad si el usuario ya la tiene aprobada */}
        {especialidadAprobada && (
          <p className="panel-rol">
            <strong>Especialidad:</strong>{" "}
            <span style={{ color: "#070bff", fontWeight: "bold" }}>
              {especialidadAprobada}
            </span>
          </p>
        )}

        <p className="panel-rol">
          <strong>Miembro desde:</strong> {formatearFecha(fechaRegis)}
        </p>
      </header>

      <section className="panel-widgets">
        <h2>Resumen Rápido</h2>
        <div className="widgets-grid">
          <div className="widget-card">
            <span className="widget-icon">👥</span>
            <p className="widget-value">{totalUsuarios}</p>
            <p className="widget-title">Usuarios Registrados</p>
          </div>
        </div>
      </section>

      <section className="panel-acciones">
        <h2>Acciones Principales</h2>
        <div className="acciones-grid">
          {/* Bloque para definir el área: solo si es especialista y NO tiene área aún */}
          {rolUsuario === "especialista" && !especialidadAprobada && (
            <div
              className="accion-card info-action"
              style={{
                border: "2px solid #070bff",
                backgroundColor: "#fff",
                color: "#333",
              }}
            >
              <h3 style={{ color: "#070bff" }}>🛠️ Definir Área Técnica</h3>
              {user?.estado_especialidad === "pendiente" ? (
                <p>
                  Tu solicitud para <strong>{user.especialidad}</strong> está
                  bajo revisión.
                </p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >
                  <select
                    className="RegisterForm"
                    value={nuevaEspecialidad}
                    onChange={(e) => setNuevaEspecialidad(e.target.value)}
                    style={{
                      padding: "8px",
                      borderRadius: "5px",
                      border: "1px solid #ddd",
                    }}
                  >
                    <option value="">Selecciona tu especialidad...</option>
                    <option value="Psicopedagogo/a">Psicopedagogo/a</option>
                    <option value="Psicologo/a">Psicologo/a</option>
                    <option value="Acompañante Terapéutico">
                      Acompañante Terapéutico
                    </option>
                  </select>
                  <button
                    onClick={enviarSolicitudArea}
                    className="btn-register"
                    disabled={!nuevaEspecialidad}
                    style={{
                      backgroundColor: "#070bff",
                      color: "white",
                      padding: "10px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Enviar Solicitud
                  </button>
                </div>
              )}
            </div>
          )}

          <Link to="/progreso" className="accion-card primary-action">
            <h3>
              📈{" "}
              {rolUsuario === "niño" ? "Ver Mi Progreso" : "Revisar Progresos"}
            </h3>
            <p>
              {rolUsuario === "niño"
                ? "Mira tus puntuaciones y avances."
                : "Analiza el desempeño de los niños."}
            </p>
          </Link>

          {rolUsuario !== "niño" && (
            <Link
              to="/gestion-usuarios"
              className="accion-card secondary-action"
            >
              <h3>
                {rolUsuario === "administrador"
                  ? "⚙️ Gestión Global"
                  : "👨‍🎓 Mis Alumnos"}
              </h3>
              <p>
                {rolUsuario === "administrador"
                  ? "Administra roles y solicitudes."
                  : "Gestiona los niños a tu cargo."}
              </p>
            </Link>
          )}

          {rolUsuario === "niño" && (
            <div
              className="accion-card secondary-action"
              onClick={solicitarSerEspecialista}
              style={{ cursor: "pointer" }}
            >
              <h3>🎓 ¿Eres Especialista?</h3>
              <p>
                Envía una solicitud para que un administrador valide tu perfil.
              </p>
            </div>
          )}

          <Link to="/juegos" className="accion-card tertiary-action">
            <h3>🎮 Ir a Juegos</h3>
            <p>Explora y gestiona los recursos educativos disponibles.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default PanelDeControl;
