import { useEffect, useState } from "react";
import { getApiErrorMessage } from "../../services/api";
import { eventoService } from "../../services/eventPlusservice";
import type { Evento } from "../../types/api";

import "./Eventos.css"

import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import CardEvento from "../../components/cardEvento/CardEvento";

function Eventos() {
    const [eventos, setEventos] = useState<Evento[]>([])
    const [erro, setErro] = useState("")
    const [carregando, setCarregando] = useState(true)

    
    useEffect(() => {
        async function carregar(){
            try {
                setEventos(await eventoService.listar());
            } catch (error) {
                setErro(getApiErrorMessage(error));
            } finally {
                setCarregando(false);
            }
        }

        void carregar();
    }, [])

    return (
        <>
        <Header/>
        <main>
            <h1>Catálogo de eventos</h1>
            {carregando && <p role="status" style={{textAlign:"center"}}>Carregando eventos...</p>}
            {erro && <p role="alert" style={{textAlign:"center"}}>{erro}</p>}
            {!carregando && !erro && eventos.length === 0 && <p style={{textAlign:"center"}}>Nenhum evento disponível no momento.</p>}
            <div>
                {eventos.map((evento)=> (
                    <CardEvento
                    key={evento.idEvento}
                    id={evento.idEvento}
                    imagem={evento.imagemUrl}
                    categoria={evento.idTipoEventoNavigation?.titulo}
                    titulo={evento.nome}
                    descricao={evento.descricao}/>
                ))}
            </div>
        </main>
        <Footer/>
        </>
    )
}

export default Eventos;