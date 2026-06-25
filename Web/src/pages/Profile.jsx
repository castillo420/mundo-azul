import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import axios from "../api/axios";
import "../styles/Profile.css";

function Profile() {
  const { user, isAuthenticated, loading } = useAuth(); // Asumiendo que setUser actualiza el contexto
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    password: "",
    confirmPassword: "",
  });

  if (loading)
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return alert("Las contraseñas no coinciden");
    }

    try {
      await axios.put("/register/update-profile", {
        name: formData.name,
        password: formData.password,
      });
      alert(
        "Perfil actualizado. Los cambios se verán al reiniciar sesión o actualizar."
      );
      setIsEditing(false);
      // Opcional: recargar datos del usuario o actualizar contexto
    } catch (error) {
      alert("Error al actualizar el perfil");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header-design"></div>
        <div className="avatar-large">{user.name?.charAt(0)}</div>

        <h1 className="profile-heading">Configuración de Perfil</h1>

        {!isEditing ? (
          <div className="profile-details">
            <div className="detail-item">
              <label>Nombre</label>
              <span>{user.name}</span>
            </div>
            <div className="detail-item">
              <label>Email</label>
              <span>{user.email}</span>
            </div>
            <div className="detail-item">
              <label>Rol</label>
              <span className={`rol-badge ${user.nombre_rol}`}>
                {user.nombre_rol}
              </span>
            </div>
            <button
              className="btn-edit-toggle"
              onClick={() => setIsEditing(true)}
            >
              Editar Datos
            </button>
          </div>
        ) : (
          <form className="profile-form" onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Nuevo Nombre:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Nueva Contraseña (dejar en blanco para no cambiar):</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Confirmar Contraseña:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
            <div className="profile-form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-save">
                Guardar Cambios
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;
