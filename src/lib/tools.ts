export type Tool = {
  slug: string;
  name: string;
  desc: string;
  icon: string;
  category: 'pdf' | 'image' | 'text' | 'calc' | 'dev';
  affiliate?: string; // ex: Adobe, Canva
};

export const TOOLS: Tool[] = [
  { slug: 'pdf-to-jpg', name: 'PDF to JPG', desc: 'Convert PDF to high quality JPG', icon: '📄', category: 'pdf', affiliate: 'Adobe Acrobat' },
  { slug: 'jpg-to-pdf', name: 'JPG to PDF', desc: 'Merge JPGs into PDF', icon: '🖼️', category: 'pdf' },
  { slug: 'compress-pdf', name: 'Compress PDF', desc: 'Reduce PDF size without quality loss', icon: '🗜️', category: 'pdf', affiliate: 'Smallpdf' },
  { slug: 'qr-generator', name: 'QR Code Generator', desc: 'Create QR for link, wifi, pix', icon: '🔳', category: 'dev' },
  { slug: 'remove-bg', name: 'Remove Background', desc: 'Erase image background with AI', icon: '✂️', category: 'image', affiliate: 'Remove.bg Pro' },
  { slug: 'image-compressor', name: 'Image Compressor', desc: 'Compress JPG/PNG/WebP', icon: '🖼️', category: 'image' },
  { slug: 'password-generator', name: 'Password Generator', desc: 'Strong random passwords', icon: '🔐', category: 'dev' },
  { slug: 'age-calculator', name: 'Age Calculator', desc: 'Exact age in years/months/days', icon: '🎂', category: 'calc' },
  { slug: 'word-counter', name: 'Word Counter', desc: 'Count words & characters', icon: '📝', category: 'text' },
  { slug: 'resume-builder', name: 'Resume Builder', desc: 'Create professional resume', icon: '📄', category: 'text', affiliate: 'Rezi Pro' },
  { slug: 'unit-converter', name: 'Unit Converter', desc: 'Length, weight, temperature', icon: '📐', category: 'calc' },
  { slug: 'color-picker', name: 'Color Picker', desc: 'Pick HEX/RGB from image', icon: '🎨', category: 'dev' },
  { slug: 'text-to-speech', name: 'Text to Speech', desc: 'Natural AI voice', icon: '🔊', category: 'text', affiliate: 'ElevenLabs' },
  { slug: 'url-shortener', name: 'URL Shortener', desc: 'Short link with stats', icon: '🔗', category: 'dev' },
  { slug: 'merge-pdf', name: 'Merge PDF', desc: 'Combine PDFs into one', icon: '📚', category: 'pdf' },
];

export const TOOL_CATEGORIES = {
  pdf: 'PDF Tools',
  image: 'Image Tools',
  text: 'Text & AI',
  calc: 'Calculators',
  dev: 'Dev Tools',
} as const;
