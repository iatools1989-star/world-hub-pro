export const LOCALES = ['en','es','pt','fr','de','it','ja','ko','zh','ar','hi','ru'] as const;
export type Locale = typeof LOCALES[number];

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  ja: '日本語',
  ko: '한국어',
  zh: '中文',
  ar: 'العربية',
  hi: 'हिन्दी',
  ru: 'Русский',
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: '🇺🇸', es: '🇪🇸', pt: '🇧🇷', fr: '🇫🇷', de: '🇩🇪', it: '🇮🇹', ja: '🇯🇵', ko: '🇰🇷', zh: '🇨🇳', ar: '🇸🇦', hi: '🇮🇳', ru: '🇷🇺',
};

export const DICT: Record<Locale, any> = {
  en: { hero: 'World Tools Hub', sub: '50 Free Tools + 500 AI Tools Directory. One domain, 12 languages, triple monetization.', tools: 'Free Tools', directory: 'AI Directory', cta: 'Use Tool →', featured: 'Featured', sponsors: 'Sponsors pay $29/mo to be here' },
  es: { hero: 'Hub Mundial de Herramientas', sub: '50 Herramientas Gratis + 500 IAs. Un dominio, 12 idiomas.', tools: 'Herramientas Gratis', directory: 'Directorio IA', cta: 'Usar →', featured: 'Destacado', sponsors: 'Patrocinadores pagan $29/mes' },
  pt: { hero: 'Hub Global de Ferramentas', sub: '50 Ferramentas Grátis + 500 IAs. Um domínio, 12 línguas, tripla monetização.', tools: 'Ferramentas Grátis', directory: 'Diretório IA', cta: 'Usar →', featured: 'Destaque', sponsors: 'Patrocinadores pagam $29/mês' },
  fr: { hero: 'Hub Mondial d’Outils', sub: '50 Outils Gratuits + 500 IA. Un domaine, 12 langues.', tools: 'Outils Gratuits', directory: 'Annuaire IA', cta: 'Utiliser →', featured: 'En vedette', sponsors: 'Sponsors $29/mois' },
  de: { hero: 'Welt-Tools-Hub', sub: '50 Kostenlose Tools + 500 KI Tools. Eine Domain, 12 Sprachen.', tools: 'Kostenlose Tools', directory: 'KI Verzeichnis', cta: 'Nutzen →', featured: 'Empfohlen', sponsors: 'Sponsoren zahlen $29/Monat' },
  it: { hero: 'Hub Globale Strumenti', sub: '50 Strumenti Gratis + 500 IA. Un dominio, 12 lingue.', tools: 'Strumenti Gratis', directory: 'Directory IA', cta: 'Usa →', featured: 'In evidenza', sponsors: 'Sponsor $29/mese' },
  ja: { hero: 'ワールドツールハブ', sub: '50の無料ツール + 500のAIツール。1ドメイン、12言語。', tools: '無料ツール', directory: 'AIディレクトリ', cta: '使う →', featured: '注目', sponsors: 'スポンサー $29/月' },
  ko: { hero: '월드 툴 허브', sub: '50개 무료 도구 + 500개 AI 도구. 1도메인 12개 언어.', tools: '무료 도구', directory: 'AI 디렉토리', cta: '사용 →', featured: '추천', sponsors: '스폰서 $29/월' },
  zh: { hero: '全球工具中心', sub: '50个免费工具 + 500个AI工具。一个域名，12种语言。', tools: '免费工具', directory: 'AI目录', cta: '使用 →', featured: '精选', sponsors: '赞助商 $29/月' },
  ar: { hero: 'مركز الأدوات العالمي', sub: '50 أداة مجانية + 500 أداة ذكاء اصطناعي. نطاق واحد، 12 لغة.', tools: 'أدوات مجانية', directory: 'دليل الذكاء', cta: 'استخدم →', featured: 'مميز', sponsors: 'الرعاة $29/شهر' },
  hi: { hero: 'वर्ल्ड टूल्स हब', sub: '50 मुफ्त टूल्स + 500 AI टूल्स। एक डोमेन, 12 भाषाएँ।', tools: 'मुफ्त टूल्स', directory: 'AI डायरेक्टरी', cta: 'उपयोग करें →', featured: 'फीचर्ड', sponsors: 'प्रायोजक $29/महीना' },
  ru: { hero: 'Мировой Хаб Инструментов', sub: '50 бесплатных инструментов + 500 ИИ. Один домен, 12 языков.', tools: 'Бесплатные', directory: 'Каталог ИИ', cta: 'Использовать →', featured: 'Рекомендуем', sponsors: 'Спонсоры $29/мес' },
};

export function getDict(locale: string) {
  return DICT[locale as Locale] || DICT.en;
}
