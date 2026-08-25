'use client';

import { useState } from 'react';

export type CampoLista =
  | { key: string; label: string; tipo?: 'text' | 'textarea' | 'boolean'; hint?: string }
  | { key: string; label: string; tipo: 'select'; opcoes: { value: string; label: string }[] };

type Item = Record<string, string | boolean>;

const inputCls =
  'w-full rounded-md border border-navy/15 bg-white px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold';

/**
 * Editor de lista genérico (client). Gerencia um array em estado e serializa
 * tudo num <input hidden name={name}> como JSON — o server action só faz
 * JSON.parse. Suporta add, remover e reordenar.
 */
export default function ListaEditor({
  name,
  campos,
  inicial,
  itemVazio,
  rotuloAdd = 'Adicionar item',
}: {
  name: string;
  campos: CampoLista[];
  inicial: Item[];
  itemVazio: Item;
  rotuloAdd?: string;
}) {
  const [itens, setItens] = useState<Item[]>(inicial);
  const upd = (i: number, key: string, val: string | boolean) =>
    setItens((a) => a.map((it, idx) => (idx === i ? { ...it, [key]: val } : it)));
  const add = () => setItens((a) => [...a, { ...itemVazio }]);
  const rem = (i: number) => setItens((a) => a.filter((_, idx) => idx !== i));
  const mover = (i: number, d: number) =>
    setItens((a) => {
      const j = i + d;
      if (j < 0 || j >= a.length) return a;
      const b = [...a];
      [b[i], b[j]] = [b[j], b[i]];
      return b;
    });

  const btn = 'rounded px-2 py-1 text-xs text-muted transition-colors hover:bg-navy/5';

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(itens)} readOnly />
      <div className="space-y-3">
        {itens.map((it, i) => (
          <div key={i} className="rounded-md border border-navy/10 bg-offwhite/60 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted">#{i + 1}</span>
              <div className="flex gap-1">
                <button type="button" onClick={() => mover(i, -1)} aria-label="Subir" className={btn}>
                  ↑
                </button>
                <button type="button" onClick={() => mover(i, 1)} aria-label="Descer" className={btn}>
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => rem(i)}
                  className="rounded px-2 py-1 text-xs text-red-600 transition-colors hover:bg-red-50"
                >
                  Remover
                </button>
              </div>
            </div>
            <div className="grid gap-3">
              {campos.map((c) => (
                <label key={c.key} className="block">
                  <span className="mb-1 block text-xs font-medium text-ink">{c.label}</span>
                  {c.tipo === 'textarea' ? (
                    <textarea
                      rows={2}
                      className={inputCls}
                      value={String(it[c.key] ?? '')}
                      onChange={(e) => upd(i, c.key, e.target.value)}
                    />
                  ) : c.tipo === 'boolean' ? (
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-gold"
                      checked={Boolean(it[c.key])}
                      onChange={(e) => upd(i, c.key, e.target.checked)}
                    />
                  ) : c.tipo === 'select' ? (
                    <select
                      className={inputCls}
                      value={String(it[c.key] ?? '')}
                      onChange={(e) => upd(i, c.key, e.target.value)}
                    >
                      {c.opcoes.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      className={inputCls}
                      value={String(it[c.key] ?? '')}
                      onChange={(e) => upd(i, c.key, e.target.value)}
                    />
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-3 rounded-md border border-gold px-4 py-2 text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-navy"
      >
        + {rotuloAdd}
      </button>
    </div>
  );
}