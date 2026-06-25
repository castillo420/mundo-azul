import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Juegos from "./pages/Juegos";
import Juego1 from "./pages/juego1";
import Juego2 from "./pages/juego2";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import PanelDeControl from "./pages/PanelDeControl";
import Progreso from "./pages/Progreso";
import Profile from "./pages/Profile";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SobreNosotros from "./pages/SobreNosotros";
import Contacto from "./pages/Contacto";
import GestionUsuarios from "./pages/GestionUsuarios";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <div className="main-content">
            <Routes>
              {/* rutas públicas */}
              <Route path="/" element={<HomePage />} />
              <Route path="/juegos" element={<Juegos />} />
              <Route path="/juego1" element={<Juego1 />} />
              <Route path="/juego2" element={<Juego2 />} />
              <Route path="/sobrenosotros" element={<SobreNosotros />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              {/* rutas protegidas */}
              <Route element={<ProtectedRoute />}>
                <Route path="/paneldecontrol" element={<PanelDeControl />} />
                <Route path="/progreso" element={<Progreso />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/gestion-usuarios" element={<GestionUsuarios />} />
              </Route>
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
