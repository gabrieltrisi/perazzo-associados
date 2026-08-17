import type { Metadata } from 'next';
import Campo from '@/components/admin/Campo';
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
        <Bloco titulo="Destaque (hero)">
          <Campo name="hero.kicker" label="Rótulo (kicker)" defaultValue={home.hero.kicker} />
          <Campo name="hero.titulo" label="Título" defaultValue={home.hero.titulo} textarea />
          <Campo name="hero.subtitulo" label="Subtítulo" defaultValue={home.hero.subtitulo} textarea />
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo name="hero.ctaPrimario" label="Botão principal" defaultValue={home.hero.ctaPrimario} />
            <Campo name="hero.ctaSecundario" label="Botão secundário" defaultValue={home.hero.ctaSecundario} />
          </div>
        </Bloco>

        <Bloco titulo="Números">
          {home.numeros.map((n, i) => (
            <div key={i} className="grid gap-4 sm:grid-cols-3">
              <Campo name={`numeros.${i}.valor`} label="Valor" defaultValue={n.valor} type="number" />
              <Campo name={`numeros.${i}.sufixo`} label="Sufixo" defaultValue={n.sufixo} hint="ex.: +, %" />
              <Campo name={`numeros.${i}.label`} label="Legenda" defaultValue={n.label} />
            </div>
          ))}
        </Bloco>

        <Bloco titulo="Resumo das áreas">
          <Campo name="areasResumo.kicker" label="Rótulo" defaultValue={home.areasResumo.kicker} />
          <Campo name="areasResumo.titulo" label="Título" defaultValue={home.areasResumo.titulo} />
          <Campo name="areasResumo.subtitulo" label="Subtítulo" defaultValue={home.areasResumo.subtitulo} textarea />
        </Bloco>

        <Bloco titulo="Chamada final (CTA)">
          <Campo name="ctaFinal.titulo" label="Título" defaultValue={home.ctaFinal.titulo} />
          <Campo name="ctaFinal.texto" label="Texto" defaultValue={home.ctaFinal.texto} textarea />
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