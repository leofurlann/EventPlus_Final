import {Navigate, Route, Routes} from "react-router-dom";

import Home from "../pages/Home/Home";
import Eventos from "../pages/Eventos/Eventos";
import DetalhesEvento from "../pages/DetalhesEvento/detalhesEvento";
import Login from "../pages/Login/Login";
import Usuarios from "../pages/Usuarios/Usuarios";
import TipoEvento from "../pages/TipoEvento/TipoEvento";
import TipoUsuario from "../pages/TipoUsuario/TipoUsuario";
import CadastroEvento from "../pages/CadastroEvento/CadastroEvento";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />

            <Route path="/eventos" element={<Eventos />} />

            <Route path="/eventos/:id" element={<DetalhesEvento />} />

            <Route path="/login" element={<Login/>} />

            <Route path="/usuarios" element={<Usuarios/>}/>

            <Route path="/tipo-evento" element={<TipoEvento/>}/>

            <Route path="/tipo-usuario" element={<TipoUsuario/>}/>

            <Route path="/cadastro-evento" element={<CadastroEvento/>}/>

            <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
    )
}

export default AppRoutes;