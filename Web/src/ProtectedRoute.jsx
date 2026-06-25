import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Añadimos allowedRoles como prop
function ProtectedRoute({ allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div className="spinner" />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Si se especifican roles permitidos y el usuario no tiene uno de ellos
  if (allowedRoles && !allowedRoles.includes(user.nombre_rol)) {
    return <Navigate to="/" replace />; // Redirige al inicio si no tiene permiso
  }

  return <Outlet />;
}

export default ProtectedRoute;
