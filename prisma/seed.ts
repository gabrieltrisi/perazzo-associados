import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Inicializa o banco com os textos versionados (JSON). Re-executável: não
// sobrescreve edições já feitas pelo painel (update vazio).
const prisma = new PrismaClient();
const root = process.cwd();
const load = (rel: string) => readFileSync(join(root, rel), 'utf-8');

const seeds: Record<string, string> = {
  home: load('content/home.json'),
  'site-config': load('content/site-config.json'),
  faq: load('content/faq.json'),
  areas: load('content/areas-de-atuacao.json'),
  sobre: load('content/sobre.json'),
};

async function main() {
  for (const [key, data] of Object.entries(seeds)) {
    await prisma.siteContent.upsert({ where: { key }, update: {}, create: { key, data } });
    console.log('seed:', key);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());