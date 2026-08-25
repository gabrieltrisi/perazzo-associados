import type { Metadata } from 'next';
import Campo from '@/components/admin/Campo';
import Bloco from '@/components/admin/Bloco';
import ListaEditor from '@/components/admin/ListaEditor';
import { getAreas } from '@/lib/site-content';
import { salvarAreas } from '@/app/admin/actions';

export const metadata: Metadata = { title: 'Editar Áreas', robots: { index: false } };

const ICONES = [
  { value: 'tax', label: 'Tributário (documento)' },
  { value: 'company', label: 'Empresarial (prédio)' },
  { value: 'civil', label: 'Civil (balança)' },
  { value: 'labor', label: 'Trabalhista (pessoa)' },
];

export default async function EditarAreas({
  searchParams,
}: {
  searchParams: Promise<{ salvo?: string }>;
}) {
  const areas = await getAreas();
  const salvo = (await searchParams).salvo === '1';

  return (
    <>
      <h1 className="text-2xl font-bold text-navy">Áreas de atuação</h1>
      <p className="mt-1 text-muted">Aparecem na home e na página de Áreas de Atuação.</p>

      {salvo && (
        <p className="mt-4 rounded border border-success/30 bg-success/10 px-4 py-2 text-sm text-success">
          ✓ Alterações salvas e publicadas.
        </p>
      )}

      <form action={salvarAreas} className="mt-6 space-y-6">
        <Bloco titulo="Cabeçalho (página de áreas)">
          <Campo name="hero.kicker" label="Rótulo" defaultValue={areas.hero.kicker} />
          <Campo name="hero.titulo" label="Título" defaultValue={areas.hero.titulo} />
          <Campo name="hero.subtitulo" label="Subtítulo" defaultValue={areas.hero.subtitulo} textarea />
        </Bloco>

        <Bloco titulo="Áreas">
          <ListaEditor
            name="areas"
            inicial={areas.areas}
            itemVazio={{ icone: 'civil', titulo: '', descricao: '', destaque: false }}
            rotuloAdd="Adicionar área"
            campos={[
              { key: 'titulo', label: 'Título' },
              { key: 'descricao', label: 'Descrição', tipo: 'textarea' },
              { key: 'icone', label: 'Ícone', tipo: 'select', opcoes: ICONES },
              { key: 'destaque', label: 'Marcar como "Principal"', tipo: 'boolean' },
            ]}
          />
        </Bloco>

        <Bloco titulo="Atuação em rede (parcerias)">
          <Campo name="parcerias.titulo" label="Título" defaultValue={areas.parcerias.titulo} />
          <Campo name="parcerias.texto" label="Texto" defaultValue={areas.parcerias.texto} textarea />
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