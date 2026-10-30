import { useCallback, useEffect, useState, type FormEvent } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { eventoService, tipoEventoService } from "../../services/eventPlusservice";
import { getApiErrorMessage } from "../../services/api";
import type { Evento, TipoEvento } from "../../types/api";
import ModalConfirmacao from "../../components/modalConfirmacao/ModalConfirmacao";
import ilustracao from "../../assets/visao-img.png";
import banner1 from "../../assets/banner-1.png";
import banner2 from "../../assets/banner-2.png";
import banner3 from "../../assets/banner-3.png";
import "./CadastroEvento.css";

type FormularioEvento = { nome: string; descricao: string; dataEvento: string; imagemUrl: string; idTipoEvento: string };
const vazio: FormularioEvento = { nome: "", descricao: "", dataEvento: "", imagemUrl: "", idTipoEvento: "" };

export default function CadastroEvento() {
  const [form, setForm] = useState<FormularioEvento>(vazio);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [tipos, setTipos] = useState<TipoEvento[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [selecionado, setSelecionado] = useState<Evento | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const [listaEventos, listaTipos] = await Promise.all([eventoService.listar(), tipoEventoService.listar()]);
      setEventos(listaEventos); setTipos(listaTipos);
    } catch (error) { setMensagem(getApiErrorMessage(error)); }
    finally { setCarregando(false); }
  }, []);
  useEffect(() => { void carregar(); }, [carregar]);

  function atualizar(campo: keyof FormularioEvento, valor: string) { setForm(atual => ({ ...atual, [campo]: valor })); }
  async function salvar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setEnviando(true); setMensagem("");
    try {
      await eventoService.cadastrar({ nome: form.nome.trim(), descricao: form.descricao.trim(), dataEvento: form.dataEvento, imagemUrl: form.imagemUrl.trim() || null, idTipoEvento: form.idTipoEvento || null, idInstituicao: null });
      setForm(vazio); setMensagem("Evento cadastrado com sucesso."); await carregar();
    } catch (error) { setMensagem(getApiErrorMessage(error)); }
    finally { setEnviando(false); }
  }
  async function excluir() {
    if (!selecionado) return;
    setEnviando(true);
    try { await eventoService.excluir(selecionado.idEvento); setSelecionado(null); setMensagem("Evento excluído."); await carregar(); }
    catch (error) { setMensagem(getApiErrorMessage(error)); setSelecionado(null); }
    finally { setEnviando(false); }
  }

  return <div className="cadastro-evento-page">
    <Header />
    <main className="cadastro-evento-main">
      <section className="cadastro-evento-form-section">
        <h1 className="cadastro-evento-heading">CADASTRO DE EVENTO</h1>
        <div className="cadastro-evento-layout">
          <img className="cadastro-evento-ilustracao" src={ilustracao} alt="Ilustração de pessoas em um evento" />
          <form className="cadastro-evento-form" onSubmit={salvar}>
            <label>Nome<input value={form.nome} onChange={e => atualizar("nome", e.target.value)} required maxLength={120} placeholder="Nome do evento" /></label>
            <label className="cadastro-evento-data">Data e horário<input type="datetime-local" value={form.dataEvento} onChange={e => atualizar("dataEvento", e.target.value)} required /></label>
            <label className="cadastro-evento-descricao">Descrição<textarea value={form.descricao} onChange={e => atualizar("descricao", e.target.value)} required rows={2} maxLength={1500} placeholder="Breve descrição do evento" /></label>
            <label>Tipo de Evento<select value={form.idTipoEvento} onChange={e => atualizar("idTipoEvento", e.target.value)} required><option value="">Selecione</option>{tipos.map(tipo => <option key={tipo.idTipoEvento} value={tipo.idTipoEvento}>{tipo.titulo}</option>)}</select></label>
            <label>Instituição<select defaultValue=""><option value="">Selecione</option></select></label>
            <label className="cadastro-evento-foto">Foto<input type="url" value={form.imagemUrl} onChange={e => atualizar("imagemUrl", e.target.value)} placeholder="URL da imagem (opcional)" /></label>
            <button type="submit" disabled={enviando}>{enviando ? "Cadastrando..." : "Cadastrar"}</button>
          </form>
        </div>
        {mensagem && <p className="cadastro-evento-mensagem" role="status">{mensagem}</p>}
      </section>
      <section className="cadastro-evento-lista-section">
        <h2 className="cadastro-evento-heading">EVENTOS</h2>
        <div className="cadastro-evento-cards">{carregando ? <p>Carregando eventos...</p> : eventos.length === 0 ? <p>Nenhum evento cadastrado.</p> : eventos.map((evento, index) => <article className="cadastro-evento-card" key={evento.idEvento}><img src={evento.imagemUrl || [banner1, banner2, banner3][index % 3]} alt="Imagem do evento"/><div className="cadastro-evento-card-conteudo"><span className="cadastro-evento-categoria">{evento.idTipoEventoNavigation?.titulo || "Categoria"}</span><h3>{evento.nome}</h3><p>{evento.descricao}</p><small>{evento.dataEvento ? new Date(evento.dataEvento).toLocaleString("pt-BR") : "Data não informada"}</small><button type="button" onClick={() => setSelecionado(evento)} aria-label={`Excluir ${evento.nome}`}>Excluir</button></div></article>)}</div>
      </section>
    </main>
    <Footer />
    {selecionado && <ModalConfirmacao show={!!selecionado} titulo="Excluir evento" mensagem={`Deseja excluir o evento "${selecionado.nome}"?`} onClose={() => setSelecionado(null)} onConfirm={() => void excluir()} />}
  </div>;
}
