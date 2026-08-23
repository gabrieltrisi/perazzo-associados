import type { Metadata } from 'next';
import Campo from '@/components/admin/Campo';
import ListaEditor from '@/components/admin/ListaEditor';
import { getHome } from '@/lib/site-content';
import { salvarHome } from '@/app/admin/actions';

export const metadata: Metadata = { title: 'Editar Home', robots: { index: false } };

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-card border border-navy/10 bg-white p-6">
      <legend className="px-2 text-kicker uppercase tracking-wide text-gold">{titulo}</legend>
      <div className="grid gap-4">{children}</div>
    </fieldset>
  );
}

const ICONES = [
  { value: 'calculator', label: 'Calculadora' },
  { value: 'book', label: 'Livro' },
  { value: 'truck', label: 'Caminhão' },
  { value: 'cap', label: 'Formatura' },
  { value: 'building', label: 'Prédio' },
];

export default async function EditarHome({
  searchParams,
}: {
  searchParams: Promise<{ salvo?: string }>;
}) {
  const home = await getHome();
  const salvo = (await searchParams).salvo === '1';

  return (
    <>
      <h1 className="text-2xl font-bold text-navy">Textos da Home</h1>
      <p className="mt-1 text-muted">Edite e salve — o site atualiza em segundos.</p>

      {salvo && (
        <p className="mt-4 rounded border border-success/30 bg-success/10 px-4 py-2 text-sm text-success">
          ✓ Alterações salvas e publicadas.
        </p>
      )}

      <form action={salvarHome} className="mt-6 space-y-6">
        {/* HERO */}
        <Bloco titulo="Destaque (hero)">
          <Campo name="hero.badge" label="Selo (OAB/cidade)" defaultValue={home.hero.badge} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo name="hero.titulo1" label="Título — linha 1" defaultValue={home.hero.titulo1} />
            <Campo name="hero.titulo2" label="Título — linha 2" defaultValue={home.hero.titulo2} />
          </div>
          <Campo name="hero.titulo2Destaque" label="Trecho em dourado (na linha 2)" defaultValue={home.hero.titulo2Destaque} hint="Ex.: se a linha 2 é “ao tribunal.”, o destaque pode ser “tribunal”." />
          <Campo name="hero.subtitulo" label="Subtítulo" defaultValue={home.hero.subtitulo} textarea />
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo name="hero.ctaPrimario" label="Botão principal" defaultValue={home.hero.ctaPrimario} />
            <Campo name="hero.ctaSecundario" label="Botão secundário" defaultValue={home.hero.ctaSecundario} />
          </div>
          <div className="rounded-md border border-navy/10 bg-offwhite/50 p-4">
            <p className="mb-3 text-sm font-semibold text-navy">Card de perfil</p>
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo name="hero.perfil.nome" label="Nome" defaultValue={home.hero.perfil.nome} />
                <Campo name="hero.perfil.cargo" label="Cargo" defaultValue={home.hero.perfil.cargo} />
              </div>
              <Campo name="hero.perfil.descricao" label="Descrição" defaultValue={home.hero.perfil.descricao} textarea />
              <Campo name="hero.perfil.nota" label="Nota (rodapé do card)" defaultValue={home.hero.perfil.nota} />
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-navy">Mini-indicadores (stats)</p>
            <ListaEditor
              name="hero.stats"
              inicial={home.hero.stats}
              itemVazio={{ valor: '', label: '' }}
              rotuloAdd="Adicionar indicador"
              campos={[
                { key: 'valor', label: 'Valor' },
                { key: 'label', label: 'Legenda' },
              ]}
            />
          </div>
        </Bloco>

        {/* PROBLEMA */}
        <Bloco titulo="O problema">
          <Campo name="problema.kicker" label="Rótulo (kicker)" defaultValue={home.problema.kicker} />
          <Campo name="problema.titulo" label="Frase" defaultValue={home.problema.titulo} textarea />
          <Campo name="problema.destaque" label="Trecho em dourado" defaultValue={home.problema.destaque} hint="Trecho que se repete e fica destacado (ex.: “no escuro”)." />
        </Bloco>

        {/* ESPECIALIDADE */}
        <Bloco titulo="Especialidade principal">
          <Campo name="especialidade.kicker" label="Rótulo" defaultValue={home.especialidade.kicker} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo name="especialidade.titulo" label="Título" defaultValue={home.especialidade.titulo} />
            <Campo name="especialidade.tituloDestaque" label="Trecho em dourado" defaultValue={home.especialidade.tituloDestaque} />
          </div>
          <Campo name="especialidade.texto" label="Texto" defaultValue={home.especialidade.texto} textarea />
          <Campo name="especialidade.cta" label="Botão (CTA)" defaultValue={home.especialidade.cta} />
          <div>
            <p className="mb-2 text-sm font-semibold text-navy">Passos (01 / 02 / 03)</p>
            <ListaEditor
              name="especialidade.passos"
              inicial={home.especialidade.passos}
              itemVazio={{ num: '', titulo: '', texto: '' }}
              rotuloAdd="Adicionar passo"
              campos={[
                { key: 'num', label: 'Número (ex.: 01)' },
                { key: 'titulo', label: 'Título' },
                { key: 'texto', label: 'Texto', tipo: 'textarea' },
              ]}
            />
          </div>
        </Bloco>

        {/* TRAJETÓRIA */}
        <Bloco titulo="Trajetória">
          <Campo name="trajetoria.kicker" label="Rótulo" defaultValue={home.trajetoria.kicker} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo name="trajetoria.titulo" label="Título" defaultValue={home.trajetoria.titulo} />
            <Campo name="trajetoria.tituloDestaque" label="Trecho em dourado" defaultValue={home.trajetoria.tituloDestaque} />
          </div>
          <Campo name="trajetoria.texto" label="Texto" defaultValue={home.trajetoria.texto} textarea />
          <div>
            <p className="mb-2 text-sm font-semibold text-navy">Marcos da linha do tempo</p>
            <ListaEditor
              name="trajetoria.marcos"
              inicial={home.trajetoria.marcos}
              itemVazio={{ lado: 'esq', icone: 'building', titulo: '', texto: '' }}
              rotuloAdd="Adicionar marco"
              campos={[
                { key: 'lado', label: 'Lado', tipo: 'select', opcoes: [{ value: 'esq', label: 'Esquerda' }, { value: 'dir', label: 'Direita' }] },
                { key: 'icone', label: 'Ícone', tipo: 'select', opcoes: ICONES },
                { key: 'titulo', label: 'Título' },
                { key: 'texto', label: 'Texto', tipo: 'textarea' },
              ]}
            />
          </div>
          <div className="rounded-md border border-navy/10 bg-offwhite/50 p-4">
            <p className="mb-3 text-sm font-semibold text-navy">Card “Hoje”</p>
            <div className="grid gap-4">
              <Campo name="trajetoria.hoje.label" label="Rótulo" defaultValue={home.trajetoria.hoje.label} />
              <Campo name="trajetoria.hoje.titulo" label="Título" defaultValue={home.trajetoria.hoje.titulo} />
              <Campo name="trajetoria.hoje.texto" label="Texto" defaultValue={home.trajetoria.hoje.texto} textarea />
            </div>
          </div>
        </Bloco>

        {/* AUTORIDADE */}
        <Bloco titulo="Autoridade">
          <Campo name="autoridade.kicker" label="Rótulo" defaultValue={home.autoridade.kicker} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo name="autoridade.titulo" label="Título" defaultValue={home.autoridade.titulo} />
            <Campo name="autoridade.tituloDestaque" label="Trecho em dourado" defaultValue={home.autoridade.tituloDestaque} />
          </div>
          <Campo name="autoridade.texto" label="Texto" defaultValue={home.autoridade.texto} textarea />
          <div>
            <p className="mb-2 text-sm font-semibold text-navy">Itens (◈)</p>
            <ListaEditor
              name="autoridade.itens"
              inicial={home.autoridade.itens}
              itemVazio={{ titulo: '', texto: '' }}
              rotuloAdd="Adicionar item"
              campos={[
                { key: 'titulo', label: 'Título (negrito)' },
                { key: 'texto', label: 'Texto', tipo: 'textarea' },
              ]}
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-navy">Galeria (Agenda institucional)</p>
            <ListaEditor
              name="autoridade.galeria"
              inicial={home.autoridade.galeria}
              itemVazio={{ img: '/assets/', legenda: '' }}
              rotuloAdd="Adicionar foto"
              campos={[
                { key: 'img', label: 'Caminho da imagem', hint: 'Ex.: /assets/cnj.jpg' },
                { key: 'legenda', label: 'Legenda' },
              ]}
            />
          </div>
        </Bloco>

        {/* PRINCÍPIOS */}
        <Bloco titulo="Princípios">
          <Campo name="principios.kicker" label="Rótulo" defaultValue={home.principios.kicker} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo name="principios.titulo" label="Título" defaultValue={home.principios.titulo} />
            <Campo name="principios.tituloDestaque" label="Trecho em dourado" defaultValue={home.principios.tituloDestaque} />
          </div>
          <Campo name="principios.missao" label="Missão" defaultValue={home.principios.missao} textarea />
          <Campo name="principios.visao" label="Visão" defaultValue={home.principios.visao} textarea />
          <div>
            <p className="mb-2 text-sm font-semibold text-navy">Valores (pills)</p>
            <ListaEditor
              name="principios.valores"
              inicial={home.principios.valores}
              itemVazio={{ titulo: '', desc: '' }}
              rotuloAdd="Adicionar valor"
              campos={[
                { key: 'titulo', label: 'Título (pill)' },
                { key: 'desc', label: 'Descrição', tipo: 'textarea' },
              ]}
            />
          </div>
        </Bloco>

        {/* DIAGNÓSTICO */}
        <Bloco titulo="Diagnóstico">
          <Campo name="diagnostico.kicker" label="Rótulo" defaultValue={home.diagnostico.kicker} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo name="diagnostico.titulo" label="Título" defaultValue={home.diagnostico.titulo} />
            <Campo name="diagnostico.tituloDestaque" label="Trecho em dourado" defaultValue={home.diagnostico.tituloDestaque} />
          </div>
          <Campo name="diagnostico.subtitulo" label="Subtítulo" defaultValue={home.diagnostico.subtitulo} textarea />
          <Campo name="diagnostico.cta" label="Botão (resultado)" defaultValue={home.diagnostico.cta} />
          <Campo name="diagnostico.disclaimer" label="Aviso (disclaimer)" defaultValue={home.diagnostico.disclaimer} textarea />
          <div className="rounded-md border border-navy/10 bg-offwhite/50 p-4">
            <p className="mb-3 text-sm font-semibold text-navy">Textos de resultado</p>
            <div className="grid gap-4">
              <Campo name="diagnostico.resultados.A" label="Resultado A (perfil favorável)" defaultValue={home.diagnostico.resultados.A} textarea />
              <Campo name="diagnostico.resultados.B" label="Resultado B (requer análise)" defaultValue={home.diagnostico.resultados.B} textarea />
              <Campo name="diagnostico.resultados.C" label="Resultado C (vale conversar)" defaultValue={home.diagnostico.resultados.C} textarea />
            </div>
          </div>
          <p className="text-xs text-muted">As perguntas do quiz são editadas no código (estrutura com pesos). Fale com o desenvolvedor para alterá-las.</p>
        </Bloco>

        {/* CONTATO */}
        <Bloco titulo="Contato (chamada final)">
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo name="contato.titulo" label="Título" defaultValue={home.contato.titulo} />
            <Campo name="contato.tituloDestaque" label="Trecho em dourado" defaultValue={home.contato.tituloDestaque} />
          </div>
          <Campo name="contato.subtitulo" label="Subtítulo" defaultValue={home.contato.subtitulo} textarea />
        </Bloco>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-md bg-gold px-6 py-3 text-sm font-semibold tracking-wide text-navy transition-colors hover:bg-gold-deep"
          >
            Salvar alterações
          </button>
        </div>
      </form>
    </>
  );
}
