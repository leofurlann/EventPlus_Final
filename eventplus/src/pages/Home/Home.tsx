import visaoImg from "../../assets/visao-img.png"

import Header from "../../components/header/Header"
import Footer from "../../components/footer/Footer"
import CardEvento from "../../components/cardEvento/CardEvento"
import Carrosel from "../../components/carrosel/Carrosel"

import "./Home.css"
import { useCallback, useEffect, useState } from "react"
import type { Evento } from "../../types/api"
import { eventoService } from "../../services/eventPlusservice"
import { getApiErrorMessage } from "../../services/api"

function Home() {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("")

    const carregar = useCallback(async() => {
        setCarregando(true);
        setErro("");
        try{
            setEventos((await eventoService.listarProximos()).slice(0,3));
        }catch(error){
            setErro(getApiErrorMessage(error))
        }finally{
            setCarregando(false);
        }
    },[]);

    useEffect(() => {
        const timeout = window.setTimeout(() => void carregar(), 0);
        return () => window.clearTimeout(timeout);
    },[carregar]);

    useEffect(()=>{
        if(window.location.hash === '#contato'){
            requestAnimationFrame(() => document.querySelector('#contato')?.scrollIntoView());
        }
    },[])

    return (
        <>
            <Header />
            <main>
                <Carrosel />

                <section className="home-visao">
                    <div className="home-visao-container">
                        <img src={visaoImg} alt="Pessoas confraternizando" />
                        <div className="home-visao-texto">
                            <h1>Visão</h1>
                            <p>A EventPlus organiza eventos e informações em uma interface direta, facilitando a consulta da agenda e a participação do usuários.</p>
                        </div>
                    </div>
                </section>

                <section id="eventos" className="home-eventos">
                    <div className="home-eventos-titulo">
                        <h2>Próximos Eventos</h2>
                        <hr />
                    </div>
                    {carregando ? <p>Carregando Próximos eventos...</p>:null}
                    {erro ? <p>{erro}</p>:null}
                    {!carregando && !erro && eventos.length === 0 ? <p>Nenhum próximo evento cadastrado</p> :null}
                    <div className="home-eventos-lista">
                        {eventos.map((evento) => (
                            <CardEvento 
                            key={evento.idEvento}
                            id={evento.idEvento}
                            titulo={evento.nome}
                            imagem={evento.imagemUrl}
                            descricao={evento.descricao}
                            categoria={evento.idTipoEventoNavigation?.titulo ?? "Sem categoria"}                            
                            />
                        ))}
                    </div>
                </section>

                <section id="contato" className="home-contato">
                    <div className="home-contato-container">
                        <div className="home-contato-titulo">
                            <h2>Contato</h2>
                            <hr />
                        </div>
                        <div className="home-contato-conteudo">
                            <div className="home-contato-texto">
                                <p>Rua Niterói, 180 - Centro</p>
                                <p>São Caetano do Sul - SP</p>
                            </div>
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3655.6989003491735!2d-46.57329922466824!3d-23.615129178762857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5cec41547543%3A0xeae678a3991812bd!2sR.%20Niter%C3%B3i%2C%20180%20-%20Centro%2C%20S%C3%A3o%20Caetano%20do%20Sul%20-%20SP%2C%2009510-200!5e0!3m2!1spt-BR!2sbr!4v1791222397938!5m2!1spt-BR!2sbr" loading="lazy"></iframe>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

export default Home;