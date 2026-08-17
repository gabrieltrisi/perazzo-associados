import { getContent } from './content';
import homeDefault from '@/content/home.json';
import siteConfigDefault from '@/content/site-config.json';

// Loaders tipados. O tipo vem do próprio JSON versionado (que também é o
// fallback). Tudo que antes importava o JSON direto passa a usar isto.
export type Home = typeof homeDefault;
export type SiteConfig = typeof siteConfigDefault;

export const getHome = () => getContent<Home>('home', homeDefault);
export const getSiteConfig = () => getContent<SiteConfig>('site-config', siteConfigDefault);