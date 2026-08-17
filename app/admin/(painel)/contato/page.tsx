import type { Metadata } from 'next';
import Campo from '@/components/admin/Campo';
import { getSiteConfig } from '@/lib/site-content';
import { salvarContato } from '@/app/admin/actions';

export const metadata: Metadata = { title: 'Editar Contato', robots: { index: false } };

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-card border border-navy/10 bg-white p-6">
      <legend className="px-2 text-kicker uppercase tracking-wide text-gold">{titulo}</legend>
      <div className="grid gap-4">{children}</div>
    </fieldset>
  );
}

export default async function EditarContato({
  searchParams,
}: {
  searchParams: Promise<{ salvo?: string }>;
}) {
  const site = await getSiteConfig();
  const salvo = (await searchParams).salvo === '1';
  const end = site.contato.endereco;

  return (
    <>
      <h1 className="text-2xl font-bold text-navy">Contato e identidade</h1>
      <p className="mt-1 text-muted">Aparece na página de contato e no rodapé de todo o site.</p>

      {salvo && (
        <p className="mt-4 rounded border border-success/30 bg-success/10 px-4 py-2 text-sm text-success">
          ✓ Alterações salvas e publicadas.
        </p>
      )}

      <form action={salvarContato} className="mt-6 space-y-6">
        <Bloco titulo="Identidade">
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo name="nomeCurto" label="Nome curto" defaultValue={site.nomeCurto} />
            <Campo name="nomeCompleto" label="Nome completo" defaultValue={site.nomeCompleto} />
          </div>
          <Campo name="tagline" label="Tagline" defaultValue={site.tagline} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo name="oab" label="Inscrição OAB" defaultValue={site.oab} />
            <Campo name="anoFundacao" label="Ano de fundação" defaultValue={site.anoFundacao} />
          </div>
        </Bloco>

        <Bloco titulo="Contato">
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo name="contato.telefoneExibicao" label="Telefone (exibição)" defaultValue={site.contato.telefoneExibicao} hint="ex.: (71) 90000-0000" />
            <Campo name="contato.telefoneLink" label="Telefone (link)" defaultValue={site.contato.telefoneLink} hint="só dígitos: 5571900000000" />
          </div>
          <Campo name="contato.email" label="E-mail" defaultValue={site.contato.email} type="email" />
          <Campo name="contato.endereco.0" label="Endereço — linha 1" defaultValue={end[0] ?? ''} />
          <Campo name="contato.endereco.1" label="Endereço — linha 2" defaultValue={end[1] ?? ''} />
          <Campo name="contato.endereco.2" label="Endereço — linha 3" defaultValue={end[2] ?? ''} />
        </Bloco>

        <Bloco titulo="Redes sociais">
          <Campo name="redes.instagram" label="Instagram (URL)" defaultValue={site.redes.instagram} />
          <Campo name="redes.linkedin" label="LinkedIn (URL)" defaultValue={site.redes.linkedin} />
          <Campo name="redes.facebook" label="Facebook (URL)" defaultValue={site.redes.facebook} />
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