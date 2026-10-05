export interface DirectoryDetail {
  pros: string[];
  cons: string[];
  bestFor: string;
  verdict: string;
  keyFeatures: { title: string; desc: string }[];
}

export const DIRECTORY_DETAILS: Record<string, DirectoryDetail> = {
  jasper: {
    bestFor: 'Enterprise marketing teams, brand agencies, and multi-channel campaign copywriters.',
    pros: [
      'Built-in Brand Voice engine maintains consistent company tone across multiple team members.',
      'Comprehensive template library with over 50 structured marketing frameworks (AIDA, PAS).',
      'Native integration with Surfer SEO for data-backed search engine keyword optimization.',
    ],
    cons: [
      'Higher pricing tier compared to standalone chatbots or raw OpenAI API endpoints.',
      'Requires onboarding and voice setup to unlock full value beyond generic generation.',
    ],
    verdict: 'Jasper AI stands out as a true enterprise-grade copywriting suite. While standard chatbots can output raw text, Jasper excels at brand alignment, multi-format assets, and marketing team workflows.',
    keyFeatures: [
      { title: 'Brand Voice Memory', desc: 'Analyzes your website and guidelines to enforce strict vocabulary, grammar, and tonal consistency.' },
      { title: 'Campaign Builder', desc: 'Generates cohesive copy for landing pages, Google ads, email sequences, and social media from a single brief.' },
      { title: 'Enterprise Privacy Guard', desc: 'Enterprise data is isolated and never used to train foundational AI models.' },
    ],
  },
  runway: {
    bestFor: 'Cinematographers, video editors, visual effects artists, and motion designers.',
    pros: [
      'Industry-leading Gen-2 and Gen-3 text-to-video and video-to-video diffusion pipelines.',
      'Precision Camera Control with customizable pan, tilt, zoom, and cinematic shutter dynamics.',
      'Comprehensive browser VFX tools including motion tracking, inpainting, and green-screen extraction.',
    ],
    cons: [
      'High GPU credit consumption when generating ultra-high-definition cinematic shots.',
      'Complex prompt learning curve required to master camera physics and lighting consistency.',
    ],
    verdict: 'Runway is the premier creative suite for AI video synthesis. It bridges the gap between synthetic video experimentation and broadcast-ready motion design.',
    keyFeatures: [
      { title: 'Gen-3 Alpha Pipeline', desc: 'Photorealistic human motion, fluid dynamic lighting, and expressive temporal consistency.' },
      { title: 'Motion Brush', desc: 'Selectively isolate and animate specific zones of any still image with directional vector control.' },
      { title: 'Browser VFX Suite', desc: 'Cut out subjects, remove background elements, and generate slow-motion frames directly in browser.' },
    ],
  },
  midjourney: {
    bestFor: 'Concept artists, graphic illustrators, interior architects, and creative directors.',
    pros: [
      'Unrivaled artistic texture rendering, cinematic lighting, and compositional depth.',
      'Versatile parameter controls (--stylize, --chaos, --weird, --v 6) for limitless styling.',
      'Strong global aesthetic community with infinite prompt exploration opportunities.',
    ],
    cons: [
      'Operates primarily through Discord bot interactions rather than a native standalone canvas.',
      'No free tier available; requires an active monthly subscription for generation credits.',
    ],
    verdict: 'Midjourney remains the gold standard in generative visual quality. For conceptual art, photorealistic portraits, and branding moodboards, its aesthetic benchmark is unmatched.',
    keyFeatures: [
      { title: 'V6 Photorealism', desc: 'Advanced prompt comprehension, micro-texture rendering, and improved in-image typography.' },
      { title: 'Vary Region (Inpainting)', desc: 'Regenerate specific sections of an artwork while preserving overall lighting and composition.' },
      { title: 'Style Reference (--sref)', desc: 'Transfer visual aesthetic, color palette, and textures from reference photos to new renders.' },
    ],
  },
  elevenlabs: {
    bestFor: 'Podcasters, video creators, audio publishers, and international game developers.',
    pros: [
      'Hyper-realistic emotional inflection, human breathing pauses, and natural speech dynamics.',
      'Instant voice cloning requires as little as 60 seconds of reference audio.',
      'Supports speech synthesis in over 29 languages with authentic regional accents.',
    ],
    cons: [
      'Strict character quota caps on entry-level subscription tiers.',
      'Voice cloning requires rigorous identity verification to prevent misuse.',
    ],
    verdict: 'ElevenLabs leads the synthetic speech sector by a wide margin. Its neural audio models deliver conversational nuance and emotional range that indistinguishably replicate human voice actors.',
    keyFeatures: [
      { title: 'Multilingual v2 Engine', desc: 'Maintains consistent character voice identity across 29 languages without artificial accent degradation.' },
      { title: 'Voice Design & Library', desc: 'Synthesize custom synthetic voices or license professional community voices with profit sharing.' },
      { title: 'AI Dubbing Suite', desc: 'Automatically translate and re-voice video content while retaining original speaker vocal cadence.' },
    ],
  },
  'notion-ai': {
    bestFor: 'Knowledge managers, project coordinators, startup founders, and research writers.',
    pros: [
      'Seamlessly embedded into your existing Notion databases, pages, and team wikis.',
      'Q&A feature answers complex operational questions by querying your company private knowledge base.',
      'Automated extraction of action items, summaries, and executive takeaways from meeting logs.',
    ],
    cons: [
      'Billed as an add-on subscription fee on top of existing Notion team workspace plans.',
      'Limited standalone creative generation outside of Notion document boundaries.',
    ],
    verdict: 'Notion AI transforms passive company wikis into an interactive second brain. Its real superpower lies in indexing your entire internal workspace to answer questions and automate documentation.',
    keyFeatures: [
      { title: 'Workspace Q&A', desc: 'Ask natural language queries and receive factual answers citing exact workspace documents.' },
      { title: 'Inline Content Polisher', desc: 'Fix spelling, tone, and formatting across large documents with zero context switching.' },
      { title: 'Automated Database Fill', desc: 'Automatically tag, summarize, and categorize database entries using AI property formulas.' },
    ],
  },
  'github-copilot': {
    bestFor: 'Software developers, engineering teams, DevOps practitioners, and computer science students.',
    pros: [
      'Deep real-time integration with VS Code, JetBrains IDEs, Visual Studio, and Neovim.',
      'Context-aware multi-line completions, boilerplate generation, and unit test synthesis.',
      'Integrated Copilot Chat explains codebases, diagnoses build errors, and suggests refactors.',
    ],
    cons: [
      'Occasional hallucinated syntax or outdated library imports require careful developer verification.',
      'Enterprise licensing requires IT governance over intellectual property and copyright filters.',
    ],
    verdict: 'GitHub Copilot is the undisputed benchmark for AI developer tooling. It tangibly reduces keystrokes, accelerates API exploration, and eliminates tedious boilerplate coding.',
    keyFeatures: [
      { title: 'Contextual IDE Auto-Complete', desc: 'Reads current files, comments, and open tabs to propose idiomatic code in dozens of languages.' },
      { title: 'Copilot Chat in Terminal', desc: 'Diagnose CLI syntax, build failures, and git merge conflicts directly from the terminal prompt.' },
      { title: 'Public Code Matcher', desc: 'Filters out suggestions that match verbatim public code snippets to guarantee clean licensing.' },
    ],
  },
  'copy-ai': {
    bestFor: 'Sales development reps (SDRs), demand generation marketers, and social media managers.',
    pros: [
      'Workflow automation engine connects CRM data with generative messaging sequences.',
      'Generous free plan allows individuals and solopreneurs to get started with no upfront cost.',
      'Infobase feature allows storing company value propositions and brand assets for repeated use.',
    ],
    cons: [
      'Long-form editorial articles may require substantial manual editing and fact checking.',
      'Advanced multi-step automated workflows require higher tier Team plans.',
    ],
    verdict: 'Copy.ai has evolved from a basic copywriting generator into a powerful GTM (Go-To-Market) automation engine. Highly recommended for automated sales prospecting and pipeline growth.',
    keyFeatures: [
      { title: 'GTM AI Workflows', desc: 'Automatically scrape prospect websites, enrich buyer profiles, and draft personalized outbound emails.' },
      { title: 'Brand Infobase', desc: 'Store target personas, positioning statements, and compliance rules for instant workflow recall.' },
      { title: 'Omnichannel Social Generator', desc: 'Repurpose one blog post into LinkedIn carousels, Twitter threads, and newsletter summaries.' },
    ],
  },
  pika: {
    bestFor: 'Social media creators, meme designers, indie filmmakers, and digital storytellers.',
    pros: [
      'Intuitive canvas interface with built-in Lip Sync, Sound FX generation, and camera panning.',
      'Fun and viral dynamic effects (Pikaffects: inflate, melt, crush, explode, cake-ify).',
      'Fast render turnarounds and active community creation ecosystem.',
    ],
    cons: [
      'Clips default to 3 to 4 seconds, requiring chain extensions for longer continuous scenes.',
      'Extreme high-motion action scenes can occasionally introduce subtle visual artifacts.',
    ],
    verdict: 'Pika Labs makes generative video creation delightfully accessible. Its dynamic physics effects and built-in audio-visual sync make it a top contender for viral content creators.',
    keyFeatures: [
      { title: 'Pikaffects Physics', desc: 'Apply real-time surreal physics transformations to objects inside videos (e.g. melting, squishing).' },
      { title: 'Sound FX Engine', desc: 'Automatically analyzes visual motion inside your video and synthesizes matching ambient audio effects.' },
      { title: 'Canvas Expand & Extend', desc: 'Change video aspect ratios (16:9 to 9:16) and extend video durations seamlessly.' },
    ],
  },
  'canva-magic': {
    bestFor: 'Small business owners, non-designers, social media managers, and educators.',
    pros: [
      'All-in-one graphic suite integrating AI generation directly into drag-and-drop templates.',
      'Magic Switch converts presentations into blog summaries or translates graphics in one click.',
      'Massive ecosystem of fonts, stock assets, royalty-free audio, and print fulfillment.',
    ],
    cons: [
      'Image generation quality is slightly less photorealistic than raw Midjourney outputs.',
      'Full feature access requires a Canva Pro team subscription.',
    ],
    verdict: 'Canva Magic Studio is the ultimate end-to-end design cockpit for non-designers. Its strength lies in turning AI outputs directly into usable social media carousels, presentations, and flyers.',
    keyFeatures: [
      { title: 'Magic Switch & Translate', desc: 'Instantly transform a 10-slide deck into an executive summary or translate entire layouts into 100 languages.' },
      { title: 'Magic Eraser & Grab', desc: 'Select any object in a photo to move it, resize it, or replace it with transparent background filling.' },
      { title: 'Magic Design Generator', desc: 'Upload your media and watch Canva automatically compose multi-page branded social assets.' },
    ],
  },
  'otter-ai': {
    bestFor: 'Remote teams, hybrid corporate workers, executive assistants, and university students.',
    pros: [
      'Automated bot joins Zoom, Google Meet, and MS Teams meetings to record and transcribe.',
      'Real-time live transcription with speaker diarization and automated timestamp bookmarks.',
      'Generates structured executive summaries with identified task owners and deadlines.',
    ],
    cons: [
      'Strong regional accents or simultaneous speaking cross-talk can cause minor transcription errors.',
      'Free monthly transcription minutes are capped for high-volume corporate power users.',
    ],
    verdict: 'Otter.ai is an indispensable productivity copilot for anyone attending multiple virtual meetings weekly. It frees participants from manual note-taking so they can focus on discussions.',
    keyFeatures: [
      { title: 'OtterPilot Assistant', desc: 'Silently joins scheduled calendar meetings, captures shared slides, and synthesizes discussion notes.' },
      { title: 'Chat With Your Meeting', desc: 'Ask questions about previous meetings (e.g. "What did Sarah commit to for next Thursday?") and get instant answers.' },
      { title: 'Automated Action Items', desc: 'Detects commitments and assigns action items to meeting participants automatically.' },
    ],
  },
};
