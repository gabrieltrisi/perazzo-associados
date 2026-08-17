'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getAdmin } from '@/lib/admin-session';
import { setContent, contentTag } from '@/lib/content';
import { getHome, getSiteConfig } from '@/lib/site-content';

async function exigirAdmin() {
  if (!(await getAdmin())) redirect('/admin/login');
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