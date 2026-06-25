import React, { useState, useEffect, useCallback } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "../styles/GestionUsuarios.css";

function GestionUsuarios() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("todos");

  const [showModal, setShowModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState("");

  const isAdmin = user?.nombre_rol === "administrador";


const fetchUsers = useCallback(async () => {
  setLoading(true);
  try {
    const endpoint = isAdmin ? "/register" : "/register/mis-ninos";
    const res = await axios.get(endpoint);
    setUsuarios(res.data.body || []);
  } catch (error) {
    console.error("Error al obtener usuarios", error);
  } finally {
    setLoading(false);
  }
}, [isAdmin]);
useEffect(() => {
  fetchUsers();
}, [fetchUsers]);

  const manejarAprobacion = async (id) => {
    if (
      !window.confirm(
        "¿Confirmas que quieres convertir a este usuario en Especialista?",
      )
    )
      return;
    try {
      await axios.put(`/register/aprobar-especialista/${id}`);
      alert("Usuario aprobado con éxito.");
      fetchUsers();
    } catch (error) {
      alert("Hubo un error al procesar la solicitud.");
    }
  };

  const manejarDesvinculacion = async (id_nino) => {
    if (!window.confirm("¿Estás seguro de quitarle el especialista asignado?"))
      return;
    try {
      await axios.delete(`/register/desvincular/${id_nino}`);
      alert("Asignación eliminada.");
      fetchUsers();
    } catch (error) {
      alert("Error al desvincular");
    }
  };

  const abrirModalAsignacion = (nino) => {
    setSelectedChild(nino);
    setShowModal(true);
  };

  const guardarAsignacion = async () => {
    if (!selectedSpecialist)
      return alert("Por favor selecciona un especialista");
    try {
      await axios.post("/register/asignar-nino", {
        id_especialista: selectedSpecialist,
        id_ninos: selectedChild.id_usuario,
      });
      alert(`Asignación exitosa.`);
      setShowModal(false);
      setSelectedSpecialist("");
      fetchUsers();
    } catch (error) {
      alert("Error al asignar");
    }
  };

  const handleAprobarArea = async (id) => {
    if (
      !window.confirm(
        "¿Aprobar el área técnica seleccionada por el especialista?",
      )
    )
      return;
    try {
      await axios.put(`/register/aprobar-area/${id}`);
      alert("Área aprobada con éxito");
      fetchUsers();
    } catch (error) {
      alert("Error al aprobar el área.");
      console.error(error);
    }
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const name = u.name || "";
    const email = u.email || "";
    const coincideBusqueda =
      name.toLowerCase().includes(busqueda.toLowerCase()) ||
      email.toLowerCase().includes(busqueda.toLowerCase());

    if (tab === "pendientes") {
      return (
        coincideBusqueda &&
        (u.estado_solicitud === "pendiente" ||
          u.estado_especialidad === "pendiente")
      );
    }
    return coincideBusqueda;
  });

  if (loading)
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );

  return (
    <div className="gestion-page">
      <div className="gestion-card">
        <header className="gestion-header">
          <h1>{isAdmin ? "Gestión de Usuarios" : "Mis Niños Asignados"}</h1>
          <p>Administra perfiles, roles y vinculaciones terapéuticas.</p>
        </header>

        <div className="gestion-controles">
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            className="search-input"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          {isAdmin && (
            <div className="tab-buttons">
              <button
                className={tab === "todos" ? "active" : ""}
                onClick={() => setTab("todos")}
              >
                Todos
              </button>
              <button
                className={tab === "pendientes" ? "active" : ""}
                onClick={() => setTab("pendientes")}
              >
                Solicitudes Pendientes
                {usuarios.some(
                  (u) =>
                    u.estado_solicitud === "pendiente" ||
                    u.estado_especialidad === "pendiente",
                ) && <span className="dot"></span>}
              </button>
            </div>
          )}
        </div>

        <div className="table-wrapper">
          <table className="gestion-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol / Especialidad</th>
                {isAdmin && <th>Info. Solicitud</th>}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((u) => (
                <tr key={u.id_usuario}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {u.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <strong>{u.name}</strong>
                        <br />
                        <small>{u.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    {/* SECCIÓN MODIFICADA: Agrupamos Rol y Especialidad */}
                    <div className="rol-column">
                      <span className={`rol-tag ${u.nombre_rol || "niño"}`}>
                        {u.nombre_rol || "Niño"}
                      </span>
                      {u.nombre_rol === "especialista" && (
                        <span className="especialidad-text">
                          {u.especialidad || "Sin área asignada"}
                        </span>
                      )}
                    </div>
                  </td>

                  {isAdmin && (
                    <td>
                      {u.estado_solicitud === "pendiente" && (
                        <span className="status-wait">
                          Solicita ser Especialista
                        </span>
                      )}
                      {u.estado_especialidad === "pendiente" && (
                        <div className="solicitud-area">
                          <span className="status-wait">
                            Área: {u.especialidad}
                          </span>
                        </div>
                      )}
                      {!u.estado_solicitud && !u.estado_especialidad && "-"}
                    </td>
                  )}

                  <td className="actions-cell">
                    {isAdmin && u.estado_solicitud === "pendiente" && (
                      <button
                        className="btn-approve"
                        onClick={() => manejarAprobacion(u.id_usuario)}
                      >
                        Aprobar Rol
                      </button>
                    )}

                    {isAdmin && u.estado_especialidad === "pendiente" && (
                      <button
                        className="btn-approve"
                        onClick={() => handleAprobarArea(u.id_usuario)}
                        style={{ backgroundColor: "#070bff" }}
                      >
                        Aprobar Área
                      </button>
                    )}

                    {isAdmin && u.nombre_rol === "niño" && !u.asignado_a && (
                      <button
                        className="btn-assign"
                        onClick={() => abrirModalAsignacion(u)}
                      >
                        Asignar
                      </button>
                    )}

                    {isAdmin && u.nombre_rol === "niño" && u.asignado_a && (
                      <div className="assigned-info">
                        <span className="status-assigned">
                          <strong>Con:</strong> {u.nombre_especialista}
                        </span>
                        <button
                          className="btn-unassign"
                          onClick={() => manejarDesvinculacion(u.id_usuario)}
                        >
                          Quitar
                        </button>
                      </div>
                    )}
                    <button className="btn-view">Detalles</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Asignar Especialista</h3>
            <p>
              Niño: <strong>{selectedChild?.name}</strong>
            </p>
            <select
              className="modal-select"
              value={selectedSpecialist}
              onChange={(e) => setSelectedSpecialist(e.target.value)}
            >
              <option value="">-- Elige un especialista --</option>
              {usuarios
                .filter((u) => u.nombre_rol === "especialista")
                .map((esp) => (
                  <option key={esp.id_usuario} value={esp.id_usuario}>
                    {esp.name} ({esp.especialidad || "Sin área definida"})
                  </option>
                ))}
            </select>
            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button className="btn-save" onClick={guardarAsignacion}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionUsuarios;
