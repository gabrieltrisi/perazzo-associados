'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { exigirAdmin, exigirOwner } from '@/lib/admin-session';
import { registrarAudit } from '@/lib/audit';
import { criarUsuario, setUsuarioAtivo, redefinirSenha } from '@/lib/users';
import { ipDeHeaders } from '@/lib/rate-limit';
import { setContent, contentTag } from '@/lib/content';
import { getHome, getSiteConfig, getFaq, getAreas, getSobre } from '@/lib/site-content';

// Registra no audit log qual admin salvou qual seção.
async function auditar(email: string, secao: string) {
  await registrarAudit(email, `salvar:${secao}`, '', ipDeHeaders(await headers()));
}

const MAX_ITENS = 60; // teto de itens por lista
const MAX_CAMPO = 8000; // teto de caracteres por campo
const MAX_JSON = 200_000; // teto do JSON bruto (anti-DoS/bloat)

// Lê um campo de lista (JSON serializado pelo ListaEditor), com limites de
// segurança: rejeita payload gigante, limita nº de itens e tamanho dos campos.
function lista(formData: FormData, name: string): Record<string, unknown>[] {
  try {
    const raw = String(formData.get(name) ?? '[]');
    if (raw.length > MAX_JSON) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.slice(0, MAX_ITENS).map((it) => {
      const o: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(it ?? {})) {
        o[k] = typeof v === 'boolean' ? v : String(v ?? '').slice(0, MAX_CAMPO);
      }
      return o;
    });
  } catch {
    return [];
  }
}

// Lê um campo de texto do form, limitado a MAX_CAMPO caracteres.
function campo(formData: FormData, k: string): string {
  return String(formData.get(k) ?? '').slice(0, MAX_CAMPO);
}

export async function salvarHome(formData: FormData) {
  const admin = await exigirAdmin();
  const atual = await getHome();
  const g = (k: string) => campo(formData, k);

  const novo = {
    ...atual,
    hero: {
      ...atual.hero,
      badge: g('hero.badge'),
      titulo1: g('hero.titulo1'),
      titulo2: g('hero.titulo2'),
      titulo2Destaque: g('hero.titulo2Destaque'),
      subtitulo: g('hero.subtitulo'),
      ctaPrimario: g('hero.ctaPrimario'),
      ctaSecundario: g('hero.ctaSecundario'),
      perfil: {
        ...atual.hero.perfil,
        nome: g('hero.perfil.nome'),
        cargo: g('hero.perfil.cargo'),
        descricao: g('hero.perfil.descricao'),
        nota: g('hero.perfil.nota'),
      },
      stats: lista(formData, 'hero.stats'),
    },
    problema: {
      ...atual.problema,
      kicker: g('problema.kicker'),
      titulo: g('problema.titulo'),
      destaque: g('problema.destaque'),
    },
    especialidade: {
      ...atual.especialidade,
      kicker: g('especialidade.kicker'),
      titulo: g('especialidade.titulo'),
      tituloDestaque: g('especialidade.tituloDestaque'),
      texto: g('especialidade.texto'),
      cta: g('especialidade.cta'),
      passos: lista(formData, 'especialidade.passos'),
    },
    trajetoria: {
      ...atual.trajetoria,
      kicker: g('trajetoria.kicker'),
      titulo: g('trajetoria.titulo'),
      tituloDestaque: g('trajetoria.tituloDestaque'),
      texto: g('trajetoria.texto'),
      marcos: lista(formData, 'trajetoria.marcos'),
      hoje: {
        ...atual.trajetoria.hoje,
        label: g('trajetoria.hoje.label'),
        titulo: g('trajetoria.hoje.titulo'),
        texto: g('trajetoria.hoje.texto'),
      },
    },
    autoridade: {
      ...atual.autoridade,
      kicker: g('autoridade.kicker'),
      titulo: g('autoridade.titulo'),
      tituloDestaque: g('autoridade.tituloDestaque'),
      texto: g('autoridade.texto'),
      itens: lista(formData, 'autoridade.itens'),
      galeria: lista(formData, 'autoridade.galeria'),
    },
    principios: {
      ...atual.principios,
      kicker: g('principios.kicker'),
      titulo: g('principios.titulo'),
      tituloDestaque: g('principios.tituloDestaque'),
      missao: g('principios.missao'),
      visao: g('principios.visao'),
      valores: lista(formData, 'principios.valores'),
    },
    diagnostico: {
      ...atual.diagnostico, // preserva as perguntas (editadas no código)
      kicker: g('diagnostico.kicker'),
      titulo: g('diagnostico.titulo'),
      tituloDestaque: g('diagnostico.tituloDestaque'),
      subtitulo: g('diagnostico.subtitulo'),
      disclaimer: g('diagnostico.disclaimer'),
      cta: g('diagnostico.cta'),
      resultados: {
        A: g('diagnostico.resultados.A'),
        B: g('diagnostico.resultados.B'),
        C: g('diagnostico.resultados.C'),
      },
    },
    contato: {
      ...atual.contato,
      titulo: g('contato.titulo'),
      tituloDestaque: g('contato.tituloDestaque'),
      subtitulo: g('contato.subtitulo'),
    },
  };

  await setContent('home', novo);
  await auditar(admin.email, 'home');
  revalidateTag(contentTag('home'));
  revalidatePath('/');
  redirect('/admin/home?salvo=1');
}

export async function salvarContato(formData: FormData) {
  const admin = await exigirAdmin();
  const atual = await getSiteConfig();
  const g = (k: string) => campo(formData, k);

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
  await auditar(admin.email, 'contato');
  revalidateTag(contentTag('site-config'));
  revalidatePath('/', 'layout'); // contato + rodapé (em todas as páginas)
  redirect('/admin/contato?salvo=1');
}

export async function salvarFaq(formData: FormData) {
  const admin = await exigirAdmin();
  const atual = await getFaq();
  const g = (k: string) => campo(formData, k);
  const novo = {
    ...atual,
    kicker: g('kicker'),
    titulo: g('titulo'),
    subtitulo: g('subtitulo'),
    itens: lista(formData, 'itens'),
  };
  await setContent('faq', novo);
  await auditar(admin.email, 'faq');
  revalidateTag(contentTag('faq'));
  revalidatePath('/'); // FAQ aparece na home
  redirect('/admin/faq?salvo=1');
}

export async function salvarAreas(formData: FormData) {
  const admin = await exigirAdmin();
  const atual = await getAreas();
  const g = (k: string) => campo(formData, k);
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
  await auditar(admin.email, 'areas');
  revalidateTag(contentTag('areas'));
  revalidatePath('/');
  revalidatePath('/areas-de-atuacao');
  redirect('/admin/areas?salvo=1');
}

export async function salvarSobre(formData: FormData) {
  const admin = await exigirAdmin();
  const atual = await getSobre();
  const g = (k: string) => campo(formData, k);
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
  await auditar(admin.email, 'sobre');
  revalidateTag(contentTag('sobre'));
  revalidatePath('/sobre');
  redirect('/admin/sobre?salvo=1');
}

// ─── Gestão de usuários (somente owner) ──────────────────────────────────

export async function criarUsuarioAction(formData: FormData) {
  const admin = await exigirOwner();
  const email = campo(formData, 'email').trim().toLowerCase();
  const name = campo(formData, 'name').trim();
  const senha = String(formData.get('senha') ?? '');
  const role = campo(formData, 'role') === 'owner' ? 'owner' : 'editor';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || senha.length < 8) {
    redirect('/admin/usuarios?erro=dados');
  }
  try {
    await criarUsuario({ email, name, senha, role });
  } catch {
    redirect('/admin/usuarios?erro=existe'); // provável e-mail duplicado
  }
  await registrarAudit(admin.email, 'user:criar', `${email} (${role})`, ipDeHeaders(await headers()));
  revalidatePath('/admin/usuarios');
  redirect('/admin/usuarios?salvo=1');
}

export async function alternarAtivoAction(formData: FormData) {
  const admin = await exigirOwner();
  const id = Number(formData.get('id'));
  const ativar = String(formData.get('ativar')) === '1';
  if (!Number.isInteger(id)) redirect('/admin/usuarios?erro=dados');
  if (id === admin.id) redirect('/admin/usuarios?erro=self'); // não desative a si mesmo
  await setUsuarioAtivo(id, ativar);
  await registrarAudit(admin.email, ativar ? 'user:ativar' : 'user:desativar', `id=${id}`, ipDeHeaders(await headers()));
  revalidatePath('/admin/usuarios');
  redirect('/admin/usuarios?salvo=1');
}

export async function redefinirSenhaAction(formData: FormData) {
  const admin = await exigirOwner();
  const id = Number(formData.get('id'));
  const senha = String(formData.get('senha') ?? '');
  if (!Number.isInteger(id) || senha.length < 8) redirect('/admin/usuarios?erro=dados');
  await redefinirSenha(id, senha);
  await registrarAudit(admin.email, 'user:senha', `id=${id}`, ipDeHeaders(await headers()));
  revalidatePath('/admin/usuarios');
  redirect('/admin/usuarios?salvo=1');
}