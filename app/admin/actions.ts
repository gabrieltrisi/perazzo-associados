'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getAdmin } from '@/lib/admin-session';
import { setContent, contentTag } from '@/lib/content';
import { getHome, getSiteConfig, getFaq, getAreas, getSobre } from '@/lib/site-content';

async function exigirAdmin() {
  if (!(await getAdmin())) redirect('/admin/login');
}

// Lê um campo de lista (JSON serializado pelo ListaEditor).
function lista(formData: FormData, name: string): Record<string, unknown>[] {
  try {
    const arr = JSON.parse(String(formData.get(name) ?? '[]'));
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export async function salvarHome(formData: FormData) {
  await exigirAdmin();
  const atual = await getHome();
  const g = (k: string) => String(formData.get(k) ?? '');

  const novo = {
    ...atual,
    hero: {
      ...atual.hero,
      kicker: g('hero.kicker'),
      titulo: g('hero.titulo'),
      subtitulo: g('hero.subtitulo'),
      ctaPrimario: g('hero.ctaPrimario'),
      ctaSecundario: g('hero.ctaSecundario'),
    },
    numeros: atual.numeros.map((n, i) => ({
      ...n,
      valor: Number(formData.get(`numeros.${i}.valor`) ?? n.valor) || 0,
      sufixo: String(formData.get(`numeros.${i}.sufixo`) ?? n.sufixo),
      label: String(formData.get(`numeros.${i}.label`) ?? n.label),
    })),
    areasResumo: {
      ...atual.areasResumo,
      kicker: g('areasResumo.kicker'),
      titulo: g('areasResumo.titulo'),
      subtitulo: g('areasResumo.subtitulo'),
    },
    ctaFinal: {
      ...atual.ctaFinal,
      titulo: g('ctaFinal.titulo'),
      texto: g('ctaFinal.texto'),
    },
  };

  await setContent('home', novo);
  revalidateTag(contentTag('home'));
  revalidatePath('/');
  redirect('/admin/home?salvo=1');
}

export async function salvarContato(formData: FormData) {
  await exigirAdmin();
  const atual = await getSiteConfig();
  const g = (k: string) => String(formData.get(k) ?? '');

  const novo = {
    ...atual,
    nomeCurto: g('nomeCurto'),
    nomeCompleto: g('nomeCompleto'),
    tagline: g('tagline'),
    oab: g('oab'),
    anoFundacao: g('anoFundacao'),
    contato: {
      ...atual.contato,
      telefoneExibicao: g('contato.telefoneExibicao'),
      telefoneLink: g('contato.telefoneLink'),
      email: g('contato.email'),
      endereco: [g('contato.endereco.0'), g('contato.endereco.1'), g('contato.endereco.2')].filter(
        (l) => l.trim() !== '',
      ),
    },
    redes: {
      ...atual.redes,
      instagram: g('redes.instagram'),
      linkedin: g('redes.linkedin'),
      facebook: g('redes.facebook'),
    },
  };

  await setContent('site-config', novo);
  revalidateTag(contentTag('site-config'));
  revalidatePath('/', 'layout'); // contato + rodapé (em todas as páginas)
  redirect('/admin/contato?salvo=1');
}

export async function salvarFaq(formData: FormData) {
  await exigirAdmin();
  const atual = await getFaq();
  const g = (k: string) => String(formData.get(k) ?? '');
  const novo = {
    ...atual,
    kicker: g('kicker'),
    titulo: g('titulo'),
    subtitulo: g('subtitulo'),
    itens: lista(formData, 'itens'),
  };
  await setContent('faq', novo);
  revalidateTag(contentTag('faq'));
  revalidatePath('/'); // FAQ aparece na home
  redirect('/admin/faq?salvo=1');
}

export async function salvarAreas(formData: FormData) {
  await exigirAdmin();
  const atual = await getAreas();
  const g = (k: string) => String(formData.get(k) ?? '');
  const novo = {
    ...atual,
    hero: {
      ...atual.hero,
      kicker: g('hero.kicker'),
      titulo: g('hero.titulo'),
      subtitulo: g('hero.subtitulo'),
    },
    areas: lista(formData, 'areas'),
    parcerias: { ...atual.parcerias, titulo: g('parcerias.titulo'), texto: g('parcerias.texto') },
  };
  await setContent('areas', novo);
  revalidateTag(contentTag('areas'));
  revalidatePath('/');
  revalidatePath('/areas-de-atuacao');
  redirect('/admin/areas?salvo=1');
}

export async function salvarSobre(formData: FormData) {
  await exigirAdmin();
  const atual = await getSobre();
  const g = (k: string) => String(formData.get(k) ?? '');
  const strList = (name: string) => lista(formData, name).map((o) => String(o.v ?? ''));
  const novo = {
    ...atual,
    hero: { ...atual.hero, kicker: g('hero.kicker'), titulo: g('hero.titulo') },
    historia: { ...atual.historia, titulo: g('historia.titulo'), paragrafos: strList('paragrafos') },
    linhaDoTempo: {
      ...atual.linhaDoTempo,
      titulo: g('linhaDoTempo.titulo'),
      marcos: lista(formData, 'marcos'),
    },
    missaoVisaoValores: lista(formData, 'mvv'),
    principios: { ...atual.principios, titulo: g('principios.titulo'), itens: strList('principios') },
  };
  await setContent('sobre', novo);
  revalidateTag(contentTag('sobre'));
  revalidatePath('/sobre');
  redirect('/admin/sobre?salvo=1');
}