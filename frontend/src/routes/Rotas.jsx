import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Cadastro from "../pages/Cadastrar";
import Finalizar from "../pages/Finalizar";
import Perfil from "../pages/Perfil";
import Estorno from "../pages/Estorno";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/finalizar" element={<Finalizar />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/estorno" element={<Estorno />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
