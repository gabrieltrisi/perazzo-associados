// Sincroniza o conteúdo dos JSONs versionados para o banco (siteContent),
// que é a fonte de verdade do mini-CMS. Rode após editar os content/*.json.
//   node --env-file=.env scripts/sync-content.mjs
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';

const prisma = new PrismaClient();

// key (usado no getContent) -> arquivo JSON
const MAP = {
  home: 'home.json',
  'site-config': 'site-config.json',
  faq: 'faq.json',
  areas: 'areas-de-atuacao.json',
  sobre: 'sobre.json',
};

const existentes = (await prisma.siteContent.findMany({ select: { key: true } })).map((r) => r.key);
console.log('Registros já no banco:', existentes.length ? existentes.join(', ') : '(nenhum)');

for (const [key, file] of Object.entries(MAP)) {
  const data = JSON.stringify(JSON.parse(readFileSync(new URL(`../content/${file}`, import.meta.url), 'utf8')));
  await prisma.siteContent.upsert({ where: { key }, update: { data }, create: { key, data } });
  console.log(`✔ sincronizado: ${key}`);
}

await prisma.$disconnect();
console.log('Concluído. (Faça um redeploy para limpar o cache do Next.)');
