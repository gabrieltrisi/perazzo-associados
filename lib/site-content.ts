import { getContent } from './content';
import homeDefault from '@/content/home.json';
import siteConfigDefault from '@/content/site-config.json';
import faqDefault from '@/content/faq.json';
import areasDefault from '@/content/areas-de-atuacao.json';
import sobreDefault from '@/content/sobre.json';

// Loaders tipados. O tipo vem do próprio JSON versionado (que também é o
// fallback). Tudo que antes importava o JSON direto passa a usar isto.
export type Home = typeof homeDefault;
export type SiteConfig = typeof siteConfigDefault;
export type Faq = typeof faqDefault;
export type Areas = typeof areasDefault;
export type Sobre = typeof sobreDefault;

export const getHome = () => getContent<Home>('home', homeDefault);
export const getSiteConfig = () => getContent<SiteConfig>('site-config', siteConfigDefault);
export const getFaq = () => getContent<Faq>('faq', faqDefault);
export const getAreas = () => getContent<Areas>('areas', areasDefault);
export const getSobre = () => getContent<Sobre>('sobre', sobreDefault);