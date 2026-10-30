import { useLocation, useNavigate } from "react-router-dom";
import logoEvent from "../../assets/logo-event.svg"

import "./Login.css"
import { useAuth } from "../../context/auth";
import { useEffect, useState, type FormEvent } from "react";
import Botao from "../../components/botao/Botao";
import Campo from "../../components/campo/Campo";
import { getApiErrorMessage } from "../../services/api";

function Login(){

    const navigate = useNavigate();
    const location = useLocation();
    const {login, autenticado} = useAuth();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        if(autenticado) navigate("/home", {replace: true});
    },[autenticado, navigate])

    async function entrar(event:FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErro("");
        setEnviando(true);

        try{
            await login({email: email.trim(), senha});
            const state = location.state as { from?: string} | null
            navigate(state?.from || "/home", {replace: true})
        } catch(error){
            setErro(getApiErrorMessage(error));
        } finally{
            setEnviando(false);
        }
    }

    return(
    <main>
        <img src={logoEvent} alt="EventPlus logo" />
        <form className="Login-form" onSubmit={entrar}>

        <div>
            <label htmlFor="login-email">E-mail</label>
            <Campo
                id="login-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Login"
                autoComplete="email"
                required                  
            />
        </div>
        <div>
            <label htmlFor="login-senha">Senha</label>
            <Campo
                id="login-senha"
                type="password"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                placeholder="Senha"
                autoComplete="current-password"
                minLength={6}
                required
             />
        </div>
        <Botao texto={enviando ? "Entretando..." : "Entrar"}
         type="submit" 
         disabled={enviando} 
         />

         {erro ? <p className="login-erro" role="alert">{erro}</p> : null}

         </form>
    </main>
    )
}

export default Login;