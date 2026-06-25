import "../styles/Login.css";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signin, isAuthenticated, errors: signinErrors } = useAuth();
  const navigate = useNavigate();
  const onSubmit = handleSubmit((data) => {
    signin(data);
  });
 useEffect(() => {
  if (isAuthenticated) navigate("/paneldecontrol");
}, [isAuthenticated, navigate]);
  return (
    <div className="login-from-div">
      <section className="login-form">
        <form onSubmit={onSubmit}>
          <h3 className="heading-login">Iniciar Sesión</h3>
          <div className="login">
            {signinErrors.body && (
              <div className="text-exist">
                {typeof signinErrors.body === "string"
                  ? signinErrors.body
                  : "Error en la autenticación"}
              </div>
            )}
            <div className="login-field">
              <label>Nombre/Email:</label>
              <input
                type="text"
                {...register("name", { required: true })}
                className="loginForm"
                placeholder="nombre/email"
              ></input>
            </div>
            <div>
              {errors.name && (
                <p className="text-required">El nombre o email es requerido</p>
              )}
            </div>
            <div className="login-field">
              <label>Contraseña:</label>
              <input
                type="password"
                {...register("password", { required: true, minLength: 6 })}
                className="loginForm"
                placeholder="password, Mínimo 6 caracteres"
              ></input>
            </div>
            <div>
              {errors.password && (
                <p className="text-required">Mínimo 6 caracteres</p>
              )}
            </div>
            <div className="login-button">
              <button type="submit" className="btn-login">
                Iniciar sesión
              </button>
            </div>
            <p className="not-count">
              ¿No tienes una cuenta?
              <Link
                to="/register"
                style={{ marginLeft: "5px" }}
                className="nc-t"
              >
                Crear cuenta
              </Link>
            </p>
            <p className="not-count">
              ¿Olvidaste tu contraseña?
              <Link
                to="/forgotpassword"
                style={{ marginLeft: "5px" }}
                className="nc-t"
              >
                Recuperar
              </Link>
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}

export default LoginPage;
