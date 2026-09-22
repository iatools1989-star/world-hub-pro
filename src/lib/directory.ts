export type AITool = {
  slug: string;
  name: string;
  desc: string;
  category: 'writing' | 'video' | 'image' | 'voice' | 'productivity' | 'code';
  pricing: 'Free' | 'Freemium' | 'Paid';
  affiliate: string;
  commission: string; // ex: 30% recorrente
  featured?: boolean;
  logo: string;
};

export const AI_TOOLS: AITool[] = [
  { slug: 'jasper', name: 'Jasper AI', desc: 'AI writer for marketing copy', category: 'writing', pricing: 'Paid', affiliate: 'Jasper 30% recorrente', commission: '30%', logo: '✍️', featured: true },
  { slug: 'runway', name: 'Runway', desc: 'Generate video with AI', category: 'video', pricing: 'Freemium', affiliate: 'Runway $25', commission: '$25', logo: '🎬', featured: true },
  { slug: 'midjourney', name: 'Midjourney', desc: 'AI image generation', category: 'image', pricing: 'Paid', affiliate: 'Midjourney 20%', commission: '20%', logo: '🎨' },
  { slug: 'elevenlabs', name: 'ElevenLabs', desc: 'Most realistic AI voice', category: 'voice', pricing: 'Freemium', affiliate: 'ElevenLabs 30%', commission: '30%', logo: '🔊', featured: true },
  { slug: 'notion-ai', name: 'Notion AI', desc: 'AI inside Notion', category: 'productivity', pricing: 'Freemium', affiliate: 'Notion $10', commission: '$10', logo: '📝' },
  { slug: 'github-copilot', name: 'Muse', desc: 'AI pair programmer', category: 'code', pricing: 'Paid', affiliate: 'Copilot $15', commission: '$15', logo: '💻' },
  { slug: 'copy-ai', name: 'Copy.ai', desc: 'AI copy for sales', category: 'writing', pricing: 'Free', affiliate: 'Copy.ai 20%', commission: '20%', logo: '📋' },
  { slug: 'pika', name: 'Pika Labs', desc: 'Text to video', category: 'video', pricing: 'Freemium', affiliate: 'Pika 25%', commission: '25%', logo: '🎥' },
  { slug: 'canva-magic', name: 'Canva Magic Studio', desc: 'AI design tools', category: 'image', pricing: 'Freemium', affiliate: 'Canva Pro $30', commission: '$30', logo: '🎨' },
  { slug: 'otter-ai', name: 'Otter.ai', desc: 'Transcribe meetings', category: 'productivity', pricing: 'Freemium', affiliate: 'Otter 20%', commission: '20%', logo: '🎙️' },
];

export const DIRECTORY_CATEGORIES = {
  writing: 'AI Writing',
  video: 'AI Video',
  image: 'AI Image',
  voice: 'AI Voice',
  productivity: 'Productivity',
  code: 'AI Code',
} as const;
