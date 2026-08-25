import Campo from './Campo';
import Bloco from './Bloco';

type PostLike = {
  slug?: string;
  title?: string;
  description?: string;
  excerpt?: string;
  autor?: string;
  date?: string;
  content?: string;
  published?: boolean;
};

const textareaCls =
  'w-full rounded-md border border-navy/15 bg-white px-3 py-2 font-mono text-sm text-ink outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold';

export default function BlogForm({
  action,
  post,
  isNew = false,
}: {
  action: (formData: FormData) => void;
  post?: PostLike;
  isNew?: boolean;
}) {
  const p = post ?? {};
  return (
    <form action={action} className="space-y-6">
      {!isNew && <input type="hidden" name="slugOriginal" defaultValue={p.slug ?? ''} />}

      <Bloco titulo="Conteúdo">
        <Campo name="title" label="Título" defaultValue={p.title ?? ''} />
        <Campo
          name="slug"
          label="Slug (endereço)"
          defaultValue={p.slug ?? ''}
          hint="deixe em branco para gerar automaticamente do título"
        />
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Conteúdo (Markdown)</span>
          <textarea name="content" rows={18} defaultValue={p.content ?? ''} className={textareaCls} />
          <span className="mt-1 block text-xs text-muted">
            Suporta Markdown: ## título, **negrito**, listas, &gt; citação, [link](url).
          </span>
        </label>
      </Bloco>

      <Bloco titulo="Detalhes">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo name="autor" label="Autor" defaultValue={p.autor ?? ''} />
          <Campo name="date" label="Data" defaultValue={p.date ?? ''} type="date" />
        </div>
        <Campo name="excerpt" label="Resumo (aparece na lista)" defaultValue={p.excerpt ?? ''} textarea />
        <Campo name="description" label="Meta descrição (SEO)" defaultValue={p.description ?? ''} textarea />
        <label className="flex items-center gap-3 text-sm text-ink">
          <input
            type="checkbox"
            name="published"
            defaultChecked={p.published ?? true}
            className="h-4 w-4 accent-gold"
          />
          Publicado (visível no site)
        </label>
      </Bloco>

      <button
        type="submit"
        className="rounded-md bg-gold px-6 py-3 text-sm font-semibold tracking-wide text-navy transition-colors hover:bg-gold-deep"
      >
        {isNew ? 'Criar artigo' : 'Salvar alterações'}
      </button>
    </form>
  );
}