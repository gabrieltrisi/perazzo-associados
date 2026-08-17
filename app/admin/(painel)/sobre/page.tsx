import type { Metadata } from 'next';
import Campo from '@/components/admin/Campo';
import Bloco from '@/components/admin/Bloco';
import ListaEditor from '@/components/admin/ListaEditor';
import { getSobre } from '@/lib/site-content';
import { salvarSobre } from '@/app/admin/actions';

export const metadata: Metadata = { title: 'Editar Sobre', robots: { index: false } };

export default async function EditarSobre({
  searchParams,
}: {
  searchParams: Promise<{ salvo?: string }>;
}) {
  const sobre = await getSobre();
  const salvo = (await searchParams).salvo === '1';

  return (
    <>
      <h1 className="text-2xl font-bold text-navy">Página Sobre</h1>
      <p className="mt-1 text-muted">História, trajetória, missão/visão/valores e princípios.</p>

      {salvo && (
        <p className="mt-4 rounded border border-success/30 bg-success/10 px-4 py-2 text-sm text-success">
          ✓ Alterações salvas e publicadas.
        </p>
      )}

      <form action={salvarSobre} className="mt-6 space-y-6">
        <Bloco titulo="Cabeçalho">
          <Campo name="hero.kicker" label="Rótulo" defaultValue={sobre.hero.kicker} />
          <Campo name="hero.titulo" label="Título" defaultValue={sobre.hero.titulo} />
        </Bloco>

        <Bloco titulo="História">
          <Campo name="historia.titulo" label="Título da seção" defaultValue={sobre.historia.titulo} />
          <ListaEditor
            name="paragrafos"
            inicial={sobre.historia.paragrafos.map((p) => ({ v: p }))}
            itemVazio={{ v: '' }}
            rotuloAdd="Adicionar parágrafo"
            campos={[{ key: 'v', label: 'Parágrafo', tipo: 'textarea' }]}
          />
        </Bloco>

        <Bloco titulo="Trajetória (linha do tempo)">
          <Campo name="linhaDoTempo.titulo" label="Título da seção" defaultValue={sobre.linhaDoTempo.titulo} />
          <ListaEditor
            name="marcos"
            inicial={sobre.linhaDoTempo.marcos}
            itemVazio={{ marco: '', titulo: '', texto: '' }}
            rotuloAdd="Adicionar marco"
            campos={[
              { key: 'marco', label: 'Ano / marco' },
              { key: 'titulo', label: 'Título' },
              { key: 'texto', label: 'Descrição', tipo: 'textarea' },
            ]}
          />
        </Bloco>

        <Bloco titulo="Missão, Visão e Valores">
          <ListaEditor
            name="mvv"
            inicial={sobre.missaoVisaoValores}
            itemVazio={{ titulo: '', texto: '' }}
            rotuloAdd="Adicionar bloco"
            campos={[
              { key: 'titulo', label: 'Título' },
              { key: 'texto', label: 'Texto', tipo: 'textarea' },
            ]}
          />
        </Bloco>

        <Bloco titulo="Princípios éticos">
          <Campo name="principios.titulo" label="Título da seção" defaultValue={sobre.principios.titulo} />
          <ListaEditor
            name="principios"
            inicial={sobre.principios.itens.map((p) => ({ v: p }))}
            itemVazio={{ v: '' }}
            rotuloAdd="Adicionar princípio"
            campos={[{ key: 'v', label: 'Princípio', tipo: 'textarea' }]}
          />
        </Bloco>

        <button
          type="submit"
          className="rounded-md bg-gold px-6 py-3 text-sm font-semibold tracking-wide text-navy transition-colors hover:bg-gold-deep"
        >
          Salvar alterações
        </button>
      </form>
    </>
  );
}