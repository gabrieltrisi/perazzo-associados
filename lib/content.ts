import { unstable_cache } from 'next/cache';
import { prisma } from './db';

/**
 * Camada de conteúdo editável.
 * - getContent(key, fallback): lê do banco (com cache por tag). Se o banco
 *   estiver vazio/indisponível, devolve o `fallback` (os JSON versionados) —
 *   o site nunca quebra.
 * - setContent(key, data): grava/atualiza (usado pelo painel admin).
 * Depois de salvar, o admin chama revalidateTag(contentTag(key)).
 */
export function contentTag(key: string) {
  return `content:${key}`;
}

async function readRaw(key: string): Promise<string | null> {
  try {
    const row = await prisma.siteContent.findUnique({ where: { key } });
    return row?.data ?? null;
  } catch {
    return null; // banco indisponível → cai no fallback
  }
}

export async function getContent<T>(key: string, fallback: T): Promise<T> {
  const load = unstable_cache(() => readRaw(key), ['site-content', key], {
    tags: [contentTag(key)],
  });
  const raw = await load();
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function setContent(key: string, data: unknown): Promise<void> {
  const json = JSON.stringify(data);
  await prisma.siteContent.upsert({
    where: { key },
    update: { data: json },
    create: { key, data: json },
  });
}