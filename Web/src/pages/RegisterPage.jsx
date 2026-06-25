import "../App.css";
import "../styles/Register.css";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signup, isAuthenticated, errors: registerErrors } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
  if (isAuthenticated) navigate("/paneldecontrol");
}, [isAuthenticated, navigate]);

  const onSubmit = handleSubmit(async (values) => {
    signup(values);
  });
  return (
    <div className="register-from-div">
      <section className="register-form">
        <form onSubmit={onSubmit}>
          <h3 className="heading-register">Crear una cuenta</h3>
          <div className="register">
            {registerErrors.body && (
              <div className="text-exist">
                {typeof registerErrors.body === "string"
                  ? registerErrors.body
                  : "Error en la autenticación"}
              </div>
            )}
            <div className="register-field">
              <label>Nombre:</label>
              <input
                type="text"
                className="RegisterForm"
                placeholder="Nombre"
                {...register("name", { required: true })}
              ></input>
            </div>
            <div>
              {errors.name && (
                <p className="text-required">El nombre es requerido</p>
              )}
            </div>
            <div>
              {errors.user && (
                <p className="text-required">El usuario es requerido</p>
              )}
            </div>
            <div className="register-field">
              <label>Email:</label>
              <input
                type="email"
                {...register("email", { required: true })}
                className="RegisterForm"
                placeholder="email"
              ></input>
            </div>
            <div>
              {errors.email && (
                <p className="text-required">El email es requerido</p>
              )}
            </div>
            <div className="register-field">
              <label>Contraseña:</label>
              <input
                type="password"
                {...register("password", { required: true, minLength: 6 })}
                className="RegisterForm"
                placeholder="password"
              ></input>
            </div>
            <div>
              {errors.password && (
                <p className="text-required">La contraseña es requerida</p>
              )}
            </div>
            <div className="register-field">
              <label>Pregunta de Seguridad:</label>
              <select
                className="RegisterForm"
                {...register("pregunta_seguridad", { required: true })}
              >
                <option value="">Selecciona una pregunta</option>
                <option value="¿Cuál es el nombre de tu primera mascota?">
                  ¿Cuál es el nombre de tu primera mascota?
                </option>
                <option value="¿En qué ciudad naciste?">
                  ¿En qué ciudad naciste?
                </option>
                <option value="¿Cuál es tu comida favorita?">
                  ¿Cuál es tu comida favorita?
                </option>
              </select>
              {errors.pregunta_seguridad && (
                <p className="text-required">Debes elegir una pregunta</p>
              )}
            </div>

            <div className="register-field">
              <label>Respuesta de Seguridad:</label>
              <input
                type="text"
                className="RegisterForm"
                placeholder="Tu respuesta"
                {...register("respuesta_seguridad", { required: true })}
                defaultValue=""
              />
              {errors.respuesta_seguridad && (
                <p className="text-required">La respuesta es requerida</p>
              )}
            </div>
            <div className="register-button">
              <button type="submit" className="btn-register">
                Regístrate
              </button>
            </div>
            <p className="not-count-reg">
              ¿Tienes una cuenta?{" "}
              <Link to="/login" className="nc-t-reg">
                Iniciar Sesión
              </Link>
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}
export default RegisterPage;
