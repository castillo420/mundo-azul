import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import "../styles/Progreso.css";

function Progreso() {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <div className="spinner" />;

  // 2. Si no está autenticado, redirigimos
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="progreso-container">
      <h1 className="progreso-heading">
        📊 Progreso de {typeof user?.name === "string" ? user.name : "Usuario"}
      </h1>
      <p className="progreso-description">
        Bienvenido/a a tu panel de progreso. Aquí se registrarán tus logros en
        cada juego.
      </p>

      <div className="progreso-content">
        <div className="progreso-card">
          <h2>Juego 1: Unir Letras</h2>
          <p>Nivel Completado: 3 de 5</p>
          <p>Puntuación Más Alta: 85 puntos</p>
          <p>¡Sigue practicando para mejorar tu memoria!</p>
        </div>

        <div className="progreso-card">
          <h2>Juego 2: Reconocer Números</h2>
          <p>Nivel Completado: 5 de 10</p>
          <p>Intentos Totales: 22</p>
          <p>¡Estás cerca de alcanzar el siguiente desafío!</p>
        </div>
      </div>
    </div>
  );
}

export default Progreso;
