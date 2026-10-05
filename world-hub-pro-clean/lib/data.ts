export const ADSENSE_CONFIG = {
  client: 'ca-pub-3588158822524146',
  slotTools: '8910111213', // Substitua pelo ID gerado no AdSense
  slotDirectory: '9876543210',
  slotInArticle: '5432167890',
};

export const LOCALES = [
  { code: 'en', flag: '🇺🇸', name: 'English' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'pt', flag: '🇧🇷', name: 'Português' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'it', flag: '🇮🇹', name: 'Italiano' },
  { code: 'ja', flag: '🇯🇵', name: '日本語' },
  { code: 'ko', flag: '🇰🇷', name: '한국어' },
  { code: 'zh', flag: '🇨🇳', name: '中文' },
  { code: 'ar', flag: '🇸🇦', name: 'العربية' },
  { code: 'hi', flag: '🇮🇳', name: 'हिन्दी' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' },
];

export interface ToolItem {
  slug: string;
  name: string;
  desc: string;
  icon: string;
  category: string;
  featured?: string;
}

export const TOOLS: ToolItem[] = [
  { slug: 'qr-generator', name: 'QR Code Generator', desc: 'Create QR codes for URLs, WiFi, PIX and texts instantly.', icon: '🔳', category: 'Utility' },
  { slug: 'password-generator', name: 'Password Generator', desc: 'Generate high-entropy, cryptographically safe passwords.', icon: '🔐', category: 'Security' },
  { slug: 'word-counter', name: 'Word & Character Counter', desc: 'Real-time text analysis, word count, reading time & stats.', icon: '📝', category: 'Writing' },
  { slug: 'unit-converter', name: 'Unit Converter', desc: 'Convert length, weight, area, and temperature values.', icon: '📐', category: 'Math' },
  { slug: 'color-picker', name: 'Color Palette & Picker', desc: 'Inspect colors, generate HEX, RGB, HSL and palettes.', icon: '🎨', category: 'Design' },
  { slug: 'pdf-to-jpg', name: 'PDF to JPG', desc: 'Convert PDF pages into clear JPEG images in browser.', icon: '📄', category: 'PDF', featured: 'Adobe Acrobat' },
  { slug: 'jpg-to-pdf', name: 'JPG to PDF', desc: 'Combine multiple image files into an organized PDF document.', icon: '🖼️', category: 'PDF' },
  { slug: 'compress-pdf', name: 'Compress PDF', desc: 'Optimize PDF file size maintaining high fidelity.', icon: '🗜️', category: 'PDF', featured: 'Smallpdf' },
  { slug: 'remove-bg', name: 'Remove Background', desc: 'Client-side transparent background extractor.', icon: '✂️', category: 'Image', featured: 'Remove.bg' },
  { slug: 'image-compressor', name: 'Image Compressor', desc: 'Lossless compression for JPG, PNG and WebP files.', icon: '🖼️', category: 'Image' },
  { slug: 'age-calculator', name: 'Age & Date Calculator', desc: 'Calculate exact age, time difference and days elapsed.', icon: '🎂', category: 'Calculator' },
  { slug: 'resume-builder', name: 'Quick Resume Builder', desc: 'Build and format clean printable resumes.', icon: '📄', category: 'Career', featured: 'Rezi Pro' },
  { slug: 'text-to-speech', name: 'Text to Speech (TTS)', desc: 'Natural speech synthesizer using native browser Web Speech API.', icon: '🔊', category: 'Audio', featured: 'ElevenLabs' },
  { slug: 'url-shortener', name: 'Clean URL & Link Cleaner', desc: 'Remove tracking params (UTM, fbclid) and format clean URLs.', icon: '🔗', category: 'Utility' },
  { slug: 'merge-pdf', name: 'Merge PDF Documents', desc: 'Join multiple PDF documents in exact order.', icon: '📚', category: 'PDF' },
];

export interface DirectoryItem {
  slug: string;
  name: string;
  desc: string;
  category: string;
  pricing: 'Free' | 'Freemium' | 'Paid';
  badge?: string;
  icon: string;
  affiliateUrl: string;
  commission: string;
}

export const DIRECTORY_ITEMS: DirectoryItem[] = [
  { slug: 'jasper', name: 'Jasper AI', desc: 'Enterprise AI copywriter and content generator.', category: 'AI Writing', pricing: 'Paid', badge: 'Featured', icon: '✍️', affiliateUrl: 'https://jasper.ai', commission: '30%' },
  { slug: 'runway', name: 'Runway', desc: 'Next-gen video generation and AI VFX suite.', category: 'AI Video', pricing: 'Freemium', badge: 'Featured', icon: '🎬', affiliateUrl: 'https://runwayml.com', commission: '$25' },
  { slug: 'midjourney', name: 'Midjourney', desc: 'Ultra-photorealistic AI imagery generation model.', category: 'AI Image', pricing: 'Paid', icon: '🎨', affiliateUrl: 'https://midjourney.com', commission: 'Tier 1' },
  { slug: 'elevenlabs', name: 'ElevenLabs', desc: 'Most realistic AI voice cloning & multilingual TTS.', category: 'AI Voice', pricing: 'Freemium', badge: 'Featured', icon: '🔊', affiliateUrl: 'https://elevenlabs.io', commission: '20%' },
  { slug: 'notion-ai', name: 'Notion AI', desc: 'Seamless AI assistant integrated inside Notion docs.', category: 'Productivity', pricing: 'Freemium', icon: '📝', affiliateUrl: 'https://notion.so', commission: 'Partner' },
  { slug: 'github-copilot', name: 'GitHub Copilot', desc: 'The world standard AI developer companion.', category: 'AI Code', pricing: 'Paid', icon: '💻', affiliateUrl: 'https://github.com/features/copilot', commission: 'Direct' },
  { slug: 'copy-ai', name: 'Copy.ai', desc: 'GTM AI workflows and automated sales copywriting.', category: 'AI Writing', pricing: 'Free', icon: '📋', affiliateUrl: 'https://copy.ai', commission: '30%' },
  { slug: 'pika', name: 'Pika Labs', desc: 'Ideate and generate fluid 3D & cinematic video clips.', category: 'AI Video', pricing: 'Freemium', icon: '🎥', affiliateUrl: 'https://pika.art', commission: 'Tier 1' },
  { slug: 'canva-magic', name: 'Canva Magic Studio', desc: 'Design, presentation, and image AI utilities.', category: 'AI Image', pricing: 'Freemium', icon: '🎨', affiliateUrl: 'https://canva.com', commission: 'Tier 2' },
  { slug: 'otter-ai', name: 'Otter.ai', desc: 'Automated meeting notes, summary and live transcription.', category: 'Productivity', pricing: 'Freemium', icon: '🎙️', affiliateUrl: 'https://otter.ai', commission: '15%' },
];
