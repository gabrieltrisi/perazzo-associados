import type { Metadata } from 'next';
import Campo from '@/components/admin/Campo';
import Bloco from '@/components/admin/Bloco';
import ListaEditor from '@/components/admin/ListaEditor';
import { getFaq } from '@/lib/site-content';
import { salvarFaq } from '@/app/admin/actions';

export const metadata: Metadata = { title: 'Editar FAQ', robots: { index: false } };

export default async function EditarFaq({
  searchParams,
}: {
  searchParams: Promise<{ salvo?: string }>;
}) {
  const faq = await getFaq();
  const salvo = (await searchParams).salvo === '1';

  return (
    <>
      <h1 className="text-2xl font-bold text-navy">Perguntas frequentes</h1>
      <p className="mt-1 text-muted">Aparecem na home. Adicione, remova ou reordene as perguntas.</p>

      {salvo && (
        <p className="mt-4 rounded border border-success/30 bg-success/10 px-4 py-2 text-sm text-success">
          ✓ Alterações salvas e publicadas.
        </p>
      )}

      <form action={salvarFaq} className="mt-6 space-y-6">
        <Bloco titulo="Cabeçalho">
          <Campo name="kicker" label="Rótulo" defaultValue={faq.kicker} />
          <Campo name="titulo" label="Título" defaultValue={faq.titulo} />
          <Campo name="subtitulo" label="Subtítulo" defaultValue={faq.subtitulo} textarea />
        </Bloco>

        <Bloco titulo="Perguntas">
          <ListaEditor
            name="itens"
            inicial={faq.itens}
            itemVazio={{ pergunta: '', resposta: '' }}
            rotuloAdd="Adicionar pergunta"
            campos={[
              { key: 'pergunta', label: 'Pergunta' },
              { key: 'resposta', label: 'Resposta', tipo: 'textarea' },
            ]}
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