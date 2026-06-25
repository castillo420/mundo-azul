import { createContext, useContext, useEffect, useState } from "react";
import { registerRequest, loginRequest, verifyTokenRequest } from "../api/auth";
import axios from "../api/axios";
export const AuthContext = createContext();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const signup = async (user) => {
  try {
    await registerRequest(user);

    await signin({
      name: user.name,
      password: user.password,
    });
  } catch (error) {
    setErrors(error.response?.data || { message: "Error de registro" });
  }
};

  const signin = async (user) => {
    try {
      // 1. Llamamos al login (que devuelve "hola")
      await loginRequest(user);

      // 2. Inmediatamente llamamos a verify para obtener el objeto real
      const res = await verifyTokenRequest();

      // 3. Ahora sí, guardamos el objeto completo y marcamos como autenticado
      setUser(res.data.name);
      setIsAuthenticated(true);

      console.log("Sesión iniciada con datos de verify");
    } catch (error) {
      // Si el error.response.data es un objeto (como {body: "error"}), lo guardamos
      // Si no, enviamos un mensaje genérico para que React no explote
      const errorData = error.response?.data;
      setErrors(
        typeof errorData === "object" ? errorData : { body: "Error de login" }
      );
    }
  };
  const logout = async () => {
    try {
      await axios.post("/auth/logout");
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    if (errors.body) {
      const timer = setTimeout(() => {
        setErrors({});
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await verifyTokenRequest();
        if (!res.data) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        setIsAuthenticated(true);
        setUser(res.data.name); // Guardamos todo el objeto del usuario
        setLoading(false);
      } catch (err) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    };
    checkLogin();
  }, []);
  return (
    <AuthContext.Provider
      value={{ signup, signin, logout, user, isAuthenticated, errors, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
