import {Link, NavLink, useNavigate} from "react-router-dom"

import "./Header.css"
import logoEvent from "../../assets/logo-event.svg"
import { useAuth } from "../../context/auth";

function Header(){
    const {autenticado, logout} = useAuth();

    const navigate = useNavigate();

    function sair(){
        logout();
        navigate("/home");
    }
    return(
        <header className="header">
                <div className="header-conteudo">
                    <Link to="/home">
                    <img src={logoEvent} alt="Logo Event+" />
                    </Link>

                    <nav>
                        <NavLink to="/home">Home</NavLink>
                        <NavLink to="/eventos">Eventos</NavLink>
                        <NavLink to="/usuarios">Usuários</NavLink>
                        <Link to="/home#contato">Contatos</Link>
                    </nav>

                    {autenticado ? 
                <>
                    <Link to="/cadastro-evento">Painel</Link>
                    <Link onClick={sair} to="/login">Sair</Link>
                </>
                :
                  <Link to="/login">Entrar</Link>
}
                </div>
            </header>
    )
}

export default Header;