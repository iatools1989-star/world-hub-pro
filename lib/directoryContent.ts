/**
 * Conteudo editorial das paginas do diretorio.
 *
 * REGRAS DESTE ARQUIVO (nao negociaveis):
 * 1. Todo preco vem de fonte publica e foi conferido em novembro de 2026.
 *    Preco de SaaS muda; por isso cada pagina diz a data da checagem e manda
 *    o leitor confirmar na pagina oficial.
 * 2. Nenhuma nota (8.5/10, 4 estrelas) — nao temos teste proprio que sustente.
 * 3. Nenhuma promessa de resultado ("3x mais vendas", "economize 10h/semana").
 * 4. Toda entrada tem uma secao "When it is the wrong choice". Um diretorio que
 *    aprova tudo nao ajuda ninguem e o AdSense trata como conteudo de baixo valor.
 * 5. O que nao foi verificado aparece como nao verificado, nao como fato.
 *
 * Estrutura pensada para 900+ palavras por pagina e para responder as perguntas
 * que quem esta decidindo compra de fato faz.
 */

export interface PricingRow {
  plan: string;
  price: string;
  includes: string;
}

export interface DirectoryDetail {
  metaTitle: string;
  metaDescription: string;
  updated: string;
  intro: string[];
  whatItDoes: string[];
  pricingHeading: string;
  pricingRows: PricingRow[];
  pricingNotes: string[];
  pros: string[];
  cons: string[];
  bestFor: string;
  notFor: string;
  alternatives: { name: string; href: string; why: string }[];
  verdict: string[];
  faqs: { q: string; a: string }[];
}

export const DIRECTORY_DETAILS: Record<string, DirectoryDetail> = {
  jasper: {
    metaTitle: 'Jasper AI Pricing (2026): Creator, Pro and Business Explained',
    metaDescription:
      'What Jasper AI costs in November 2026: Creator $39-49, Pro $59-69, Business custom. What each plan includes, what it does not, and when it is the wrong buy.',
    updated: '2026-11-10',
    intro: [
      'Jasper is an AI writing tool built for marketing teams rather than for people who want a chatbot. The difference matters when you look at the price: Jasper charges a monthly subscription for brand-voice training, campaign templates and team seats, while a general assistant charges less and does more things badly.',
      'This page covers what Jasper actually costs in November 2026, which plan makes sense at which volume of work, and the situations where it is the wrong purchase. Prices below come from Jasper’s public pricing page and from comparison trackers that checked it in 2026. We have no affiliate ID in the links, which means we earn nothing whether you subscribe or not — the recommendation is not for sale.',
    ],
    whatItDoes: [
      'Jasper generates marketing copy: blog drafts, ad variations, product descriptions, email sequences, social posts. Its differentiator is not the language model underneath — it is the layer around it. You train a Brand Voice on your own content, and every generation afterwards keeps that tone. For a team of four writers producing consistent output for one brand, that consistency is the product.',
      'The second differentiator is structure. Jasper ships templates for named marketing frameworks (AIDA, PAS) and a campaign workflow that turns one brief into a set of channel-specific assets. If your problem is "we know what to say but rewriting it for six channels eats the week", Jasper addresses that directly. If your problem is "we do not know what to say", it does not.',
    ],
    pricingHeading: 'Jasper AI pricing as of November 2026',
    pricingRows: [
      { plan: 'Creator', price: '$49/mo monthly · $39/mo annual', includes: '1 seat, 1 brand voice, unlimited words, SEO mode, plagiarism checker' },
      { plan: 'Pro', price: '$69/mo monthly · $59/mo annual', includes: 'Up to 5 seats, 3 brand voices, everything in Creator plus team collaboration' },
      { plan: 'Business', price: 'Custom quote', includes: 'Unlimited seats and brand voices, SSO, API access, custom workflows, dedicated manager' },
    ],
    pricingNotes: [
      'Annual billing takes roughly 20% off both published tiers — about $120 a year on Creator and the same on Pro. That discount is the difference between Jasper looking expensive and looking reasonable, so if you intend to keep it past a month, pay annually and treat the first month as the test.',
      'Two things surprise buyers. First, there is no permanent free tier: the 7-day trial ends and you are charged unless you cancel, and the trial is short for a product whose main value (brand voice) needs setup time. Second, Pro is priced per team, not per seat — five people sharing Pro is roughly $12 per person per month, which flips the comparison against single-user tools. Check both numbers on Jasper’s pricing page before you commit, because published prices move.',
    ],
    pros: [
      'Brand Voice gives a measurable consistency win once two or more people write for the same brand.',
      'Template library covers the boring middle of marketing work — the 40 product descriptions nobody wants to write.',
      'Pro’s per-team price is competitive once you have more than two writers.',
      'Surfer SEO integration turns a draft into something closer to a search-first article without a second subscription on the entry tier.',
      'Output quality for structured marketing formats is more consistent than prompting a general assistant from scratch each time.',
    ],
    cons: [
      'Expensive for a solo writer: $39/month annually is more than a general assistant that handles the same short-form tasks.',
      'The 7-day trial is too short to train a brand voice properly and judge it.',
      'The useful half of the product — multiple brand voices, collaboration — sits on Pro, not on the plan most people start with.',
      'No free tier, so there is no way to test it with real work over a month before paying.',
    ],
    bestFor:
      'Marketing teams of two to five people producing regular volume for one or two brands, where tone consistency across writers is a real business requirement.',
    notFor:
      'A solo writer producing a handful of posts a month, anyone who mainly needs long-form research, and anyone who expects the tool to decide the strategy. Jasper writes what you already know how to say.',
    alternatives: [
      { name: 'Copy.ai', href: '/en/directory/copy-ai', why: 'Cheaper entry with a genuinely usable free tier of 2,000 words a month — better for testing whether AI copy helps you at all.' },
      { name: 'Notion AI', href: '/en/directory/notion-ai', why: 'Better if the writing happens inside documents that already live in Notion and you would rather not buy a second tool.' },
      { name: 'The free tools here', href: '/en/tools/word-counter', why: 'If the actual bottleneck is checking drafts against a word limit or reading level, you do not need a subscription for that.' },
    ],
    verdict: [
      'Jasper is worth its price only when the price is split. At $59/month annually for up to five seats it is roughly $12 per writer, and the brand-voice consistency it buys is hard to reproduce by prompting a cheaper assistant five separate times.',
      'For one person writing a few articles a month it is the wrong purchase, and that is a large share of the people who land on this page. Start with a free tier elsewhere, confirm that AI copy actually saves you time, and only then decide whether the consistency problem Jasper solves is your problem.',
    ],
    faqs: [
      { q: 'Is there a free plan?', a: 'No permanent free plan. Jasper offers a 7-day trial on Creator and Pro; when it ends you are billed unless you cancel. Budget the trial as a paid month if you want a fair test.' },
      { q: 'Is annual billing actually cheaper?', a: 'Yes, by about 20% — $39 instead of $49 on Creator, $59 instead of $69 on Pro. That is roughly $120 a year saved on either tier.' },
      { q: 'Can I share one Creator plan with my team?', a: 'Creator is one seat. Sharing a login is against most SaaS terms and loses the per-user history that makes the tool useful. If two or more people will use it, price Pro from the start.' },
      { q: 'Do I need Surfer SEO as well?', a: 'Not necessarily. SEO mode on Creator covers the basics; the deeper Surfer integration sits higher up. Buy the writing tool first and add SEO tooling only if ranking, not writing, turns out to be the bottleneck.' },
      { q: 'What happens to my content if I cancel?', a: 'Generated text is yours to keep and export; the brand voice training and workspace history are tied to the subscription. Export anything you need before cancelling.' },
    ],
  },

  runway: {
    metaTitle: 'Runway Pricing (2026): What Credits Actually Buy You',
    metaDescription:
      'Runway costs $15/mo Standard, $35 Pro, $95 Unlimited in November 2026 — and the credit maths matters more than the sticker price. Full breakdown per plan.',
    updated: '2026-11-10',
    intro: [
      'Runway sells AI video generation. The thing nobody tells you before you sign up is that you are not buying minutes of video — you are buying credits, and the number of finished seconds those credits produce depends on which model and resolution you pick. A plan that looks affordable can be exhausted in a single afternoon.',
      'This page converts the credits into actual output, states what Runway costs in November 2026, and names the case where you should not buy it at all. As everywhere on this site, there is no affiliate ID in the link: we earn nothing from your subscription.',
    ],
    whatItDoes: [
      'Runway generates video from text prompts, from an image, or from an existing video you want to restyle. It also includes tools that are less glamorous but more useful day to day: background removal, inpainting (removing an object from a shot), motion brush to make a still image move in a controlled way, and upscaling.',
      'The realistic workflow for most buyers is not "generate a finished ad". It is "generate five seconds of B-roll I could not afford to shoot", or "clean up this shot before it goes to the editor". Judged that way, Runway earns its money on small jobs inside a larger production. Judged as a way to produce a whole video without a camera, it disappoints — and the credit maths explains why.',
    ],
    pricingHeading: 'Runway pricing as of November 2026',
    pricingRows: [
      { plan: 'Free', price: '$0', includes: '125 one-time credits, limited models, watermark on output, restricted commercial use' },
      { plan: 'Standard', price: '$15/mo · $12/mo annual', includes: '625 credits a month, all models, 4K upscale, commercial use' },
      { plan: 'Pro', price: '$35/mo · $28/mo annual', includes: '2,250 credits a month, all models plus custom voice' },
      { plan: 'Unlimited', price: '$95/mo · $76/mo annual', includes: '2,250 credits plus Explore mode (unlimited relaxed generations), up to 10 seats' },
    ],
    pricingNotes: [
      'The number that matters is credits per generated second. At flagship quality, 625 credits on Standard works out to roughly 50 seconds of finished video — not 50 minutes. Third-party trackers that ran the maths in 2026 put Standard at about 52 seconds and Pro at about 187 seconds per month at top quality. Lower resolution and faster models stretch that considerably, and that is the lever you actually pull.',
      'That is why the Unlimited tier exists. Its credit allotment is identical to Pro; what you buy for the extra $60 is Explore mode, where generations queue in a relaxed tier without consuming credits. If you render everything at flagship quality every time, the effective ceiling arrives fast and Unlimited is the honest comparison — not Pro. The free tier’s 125 credits are one-time, not monthly, so it is a demo rather than a plan you can work on.',
    ],
    pros: [
      'Model quality on short cinematic shots is among the best available, and the restyle/control tools are more precise than prompt-only competitors.',
      'The utility tools — background removal, inpainting, upscaling — are useful to people who never generate a frame from scratch.',
      'Commercial licensing is included from Standard up, which matters if the output goes into client work.',
      'Unlimited’s Explore mode is a genuine escape hatch for high-volume experimentation without watching a counter.',
      'Credits do not expire within the month’s allowance, so a quiet week is not lost value.',
    ],
    cons: [
      'The credit system makes cost hard to predict: the same prompt at a different model or resolution can cost several times as much.',
      'The free tier is a one-time allowance, so there is no way to evaluate over a realistic period.',
      'Per-second economics make longer pieces impractical — this is a tool for shots, not for a 10-minute explainer.',
      'Output still needs a human editor: continuity between shots is the weak point of every generator at this price.',
    ],
    bestFor:
      'Video editors, small studios and solo creators who need specific short shots — B-roll, stylised inserts, clean-ups — inside a production they are already making.',
    notFor:
      'Anyone expecting a finished video from a prompt, anyone producing long-form content, and anyone on a fixed budget who needs predictable per-minute costs. For a talking-head video, a camera plus an editor is still cheaper and better.',
    alternatives: [
      { name: 'Pika', href: '/en/directory/pika', why: 'Cheaper entry for short vertical social clips, with a different set of stylistic effects.' },
      { name: 'Midjourney', href: '/en/directory/midjourney', why: 'If you mainly need stills and not motion, the GPU-hour model is easier to predict and the image quality is stronger.' },
      { name: 'Swap the audio instead', href: '/en/tools/text-to-speech', why: 'If the video exists and only the narration is missing, generate the voice in the browser and skip the video subscription entirely.' },
    ],
    verdict: [
      'Runway is a professional tool with a professional billing model that punishes casual use. The honest way to evaluate it is to take the plan’s credit allowance, divide by the credit cost of the model you intend to use, and ask whether that many seconds a month is enough for the work you have. For most people the answer is "yes for shots, no for videos".',
      'If you are making short social video, start on Standard and stay at lower resolutions until a shot has to be perfect. If you find yourself rendering at flagship quality daily, Pro will not save you — go straight to the Unlimited comparison.',
    ],
    faqs: [
      { q: 'How many seconds of video do I get per month?', a: 'Not a fixed number — it depends on the model and resolution. On Standard (625 credits), top-quality generation yields roughly 50 seconds a month; lower settings yield several times that.' },
      { q: 'Can I use Runway output commercially?', a: 'Yes from Standard upward. The free tier restricts commercial use and watermarks output. Verify the current licence terms on Runway’s site before client work.' },
      { q: 'Do unused credits roll over?', a: 'The monthly allowance resets; it does not accumulate into a larger balance. Plan heavy renders inside the month you paid for.' },
      { q: 'Is the free plan enough to evaluate it?', a: 'It is enough to see whether the output style suits you, not enough to evaluate cost. 125 one-time credits run out in a handful of generations.' },
      { q: 'Do I still need a video editor?', a: 'Yes. Generation gives you shots; continuity, pacing and sound are still editing work. Budget for both or the output looks like a demo reel rather than a video.' },
    ],
  },

  midjourney: {
    metaTitle: 'Midjourney Pricing (2026): Fast GPU Hours Explained',
    metaDescription:
      'Midjourney costs $10 Basic, $30 Standard, $60 Pro, $120 Mega in November 2026, billed in fast GPU hours. No free plan. What each tier really allows.',
    updated: '2026-11-10',
    intro: [
      'Midjourney is the still-image generator that most professional designers still default to, and it has the simplest and least forgiving pricing of the major AI image tools: there is no free plan, no free trial, and the cheapest tier is $10 a month.',
      'What you buy is time on a GPU rather than a count of images, which makes the cost per usable picture depend entirely on how many attempts you need. This page explains the maths, lists the November 2026 prices, and says plainly when the answer is "do not subscribe". No affiliate ID is attached to the link on this page.',
    ],
    whatItDoes: [
      'Midjourney turns a text prompt into an image with a strong, recognisable aesthetic — more painterly and more filmic than the competition, which is either the reason you want it or the reason you do not. It runs through Discord or its own web interface, and the workflow is iterative: prompt, look at four variations, upscale or vary, refine.',
      'The features that justify the higher tiers are organisational rather than creative. Standard adds unlimited Relax mode, meaning slow generations that do not consume your fast hours — for a designer producing dozens of options for one brief, that single feature is the whole value of the upgrade. Pro adds Stealth mode, which keeps your generations out of the public gallery; if you work under NDA, you need Pro, not Standard.',
    ],
    pricingHeading: 'Midjourney pricing as of November 2026',
    pricingRows: [
      { plan: 'Basic', price: '$10/mo · $8/mo annual', includes: '3.3 hours of fast GPU time a month; no Relax mode, no Stealth' },
      { plan: 'Standard', price: '$30/mo · $24/mo annual', includes: '15 fast hours plus unlimited Relax images' },
      { plan: 'Pro', price: '$60/mo · $48/mo annual', includes: '30 fast hours, unlimited Relax for images and standard video, Stealth mode' },
      { plan: 'Mega', price: '$120/mo · $96/mo annual', includes: '60 fast hours plus everything in Pro' },
    ],
    pricingNotes: [
      'Fast hours do not roll over, so unused time is lost at the end of the month — the opposite of a credit balance. Extra fast time is sold at about $4 per hour on every tier, which is the escape valve when a deadline lands mid-month.',
      'Basic is the plan people regret. It has no Relax mode, so every single generation burns paid time, and 3.3 hours is less than it sounds once you are iterating. If you intend to use Midjourney more than a couple of times a week, Standard is the realistic entry point, and its unlimited Relax images are what make the $20 jump worth it. Annual billing takes about 20% off all four tiers, paid as the whole year upfront.',
    ],
    pros: [
      'Image quality and stylistic consistency are the reference point other tools are measured against.',
      'Unlimited Relax mode on Standard removes the anxiety of iterating, which is where good images come from.',
      'Simple, flat pricing with no credit arithmetic to decode.',
      'Stealth mode on Pro makes it usable for confidential client work.',
      'Strong community and prompt knowledge base, so less time is spent reinventing technique.',
    ],
    cons: [
      'No free plan and no free trial — you must pay $10 to see whether you like it.',
      'No API, so it does not slot into automated pipelines the way other image services do.',
      'Fast hours expire monthly and are consumed quickly during iteration on the Basic tier.',
      'Text rendering inside images remains unreliable, so it is a poor fit for anything resembling a poster with typography.',
    ],
    bestFor:
      'Designers, illustrators and art directors producing concept art, moodboards and stylised visuals where the look matters more than literal accuracy.',
    notFor:
      'Anyone who needs precise product shots, legible text in images, API automation, or a free way to try before paying. For e-commerce photography or diagrams, a different tool is the correct answer.',
    alternatives: [
      { name: 'Canva Magic Studio', href: '/en/directory/canva-magic', why: 'Better when the image has to land inside a template with your brand kit at a fixed size.' },
      { name: 'Runway', href: '/en/directory/runway', why: 'If the deliverable moves rather than sits still.' },
      { name: 'Remove the background here, free', href: '/en/tools/remove-bg', why: 'If all you need is a clean cut-out for a mock-up, the browser tool costs nothing and uploads nothing.' },
    ],
    verdict: [
      'Midjourney remains the best answer to "I need a striking image and I care about the look". It is a poor answer to "I need forty accurate product photos" or "I need this inside a script".',
      'Standard at $30 is the tier almost everyone should buy: the unlimited Relax mode changes how you work, and the $10 tier’s absence of it turns every experiment into a billable decision.',
    ],
    faqs: [
      { q: 'Is there a free trial?', a: 'No. Midjourney has no free plan and no trial; the $10 Basic tier is the cheapest way to evaluate it.' },
      { q: 'What is the difference between fast and Relax mode?', a: 'Fast mode uses your paid GPU hours and returns images in seconds. Relax mode queues generations at lower priority and costs nothing extra — available on Standard and above.' },
      { q: 'Do my hours roll over?', a: 'No. Unused fast hours expire at the end of the billing month. Extra hours can be bought at roughly $4 each.' },
      { q: 'Can I keep my generations private?', a: 'Only on Pro and Mega, which include Stealth mode. On Basic and Standard, generations appear in the public gallery.' },
      { q: 'Can I use the images commercially?', a: 'Subscribers get broad commercial terms, with conditions around very large businesses. Read Midjourney’s current terms before using output in paid client work.' },
    ],
  },

  elevenlabs: {
    metaTitle: 'ElevenLabs Pricing (2026): Characters, Minutes and Limits',
    metaDescription:
      'ElevenLabs pricing in November 2026: free 10,000 characters, Starter $5, Creator $22, Pro $99. What the quotas mean in minutes and where the free tier stops.',
    updated: '2026-11-10',
    intro: [
      'ElevenLabs is the default choice for AI voice that does not sound synthetic. It bills by characters of text converted to speech, which is a reasonable model once you know the conversion: roughly a thousand characters per minute of audio.',
      'That single number explains most of the confusion around this product. A free tier of 10,000 characters sounds generous until you translate it into seven or eight minutes of finished narration. Below is what each November 2026 tier actually allows and where the honest break-even sits. No affiliate ID is attached.',
    ],
    whatItDoes: [
      'It turns written text into spoken audio in dozens of languages, with voice cloning available from the paid tiers. The use cases that hold up are narration for video, audiobook and podcast production, and accessibility — turning articles into audio for people who prefer listening.',
      'The quality is the product. Most text-to-speech engines are recognisably machines; ElevenLabs output frequently is not, and for narrated content that difference decides whether the audience stays. What it cannot do is perform: emotion is conveyed by punctuation and context, and a script that reads flatly will be read flatly.',
    ],
    pricingHeading: 'ElevenLabs pricing as of November 2026',
    pricingRows: [
      { plan: 'Free', price: '$0', includes: '10,000 characters/mo (≈7-8 min), 3 custom voices, watermark, no commercial licence' },
      { plan: 'Starter', price: '$5/mo', includes: '30,000 characters/mo (≈20-30 min), commercial licence, instant voice cloning' },
      { plan: 'Creator', price: '$22/mo', includes: '100,000 characters/mo (≈50-60 min), professional voice cloning, dubbing studio' },
      { plan: 'Pro', price: '$99/mo', includes: '500,000 characters/mo (≈4-5 hours), highest quality audio, priority support' },
    ],
    pricingNotes: [
      'Two traps live in the free tier. Output carries an ElevenLabs watermark, and the licence does not permit commercial use — so it is genuinely only for evaluation. The moment the audio is going into something you publish for money, you need Starter at $5, which is one of the cheapest paid entry points of any tool on this site.',
      'Overages are billed per thousand extra characters and the rate drops as you go up tiers. If you routinely exceed your quota by a small margin, staying on the lower tier and paying overage is usually cheaper than jumping a whole tier. Prices on this product have moved more than once; confirm on ElevenLabs’ own pricing page before budgeting.',
    ],
    pros: [
      'Voice realism is materially ahead of cheap TTS, which is the entire reason to pay.',
      'Starter at $5 is a low-risk entry and includes the commercial licence.',
      'Character-based billing is predictable once you know your script length in characters.',
      'Wide language coverage, useful if you publish the same content in several markets.',
      'Voice cloning lets a single narrator cover content they did not record.',
    ],
    cons: [
      'The free tier is unusable for real work: watermark plus no commercial rights.',
      'Character quotas translate to far less audio than buyers expect — 100,000 characters is about an hour.',
      'Cloning raises consent and impersonation issues that you must manage yourself.',
      'Long-form audiobook work pushes you toward Pro quickly, where the price jumps fivefold.',
    ],
    bestFor:
      'Creators producing narrated video, podcast intros or audiobook-length content where voice quality is the differentiator and the text is already written.',
    notFor:
      'Live conversational agents on a tight budget, anyone who needs singing or musical performance, and anyone who wants to narrate a long book on a starter plan. For a quick spoken version of a short text, the free browser tool on this site covers it without uploading anything.',
    alternatives: [
      { name: 'Browser text to speech', href: '/en/tools/text-to-speech', why: 'Free, local, no upload — adequate for short texts and for checking whether you need narration at all.' },
      { name: 'Otter.ai', href: '/en/directory/otter-ai', why: 'The opposite direction: it turns speech into text rather than text into speech.' },
      { name: 'Canva Magic Studio', href: '/en/directory/canva-magic', why: 'If the voice is one component of a video you are assembling anyway, keeping it in one tool avoids stitching exports.' },
    ],
    verdict: [
      'ElevenLabs is worth paying for the moment you publish narrated content and care whether it sounds human. Starter at $5 is the right first step: it removes the watermark and grants commercial rights at a price that is hard to regret.',
      'The mistake is buying Creator for a project that needs an hour of audio once. 100,000 characters is roughly one hour, and it resets monthly — so a one-off long project is often better served by paying overage on Starter than by committing to a tier you will not use again.',
    ],
    faqs: [
      { q: 'How many minutes is 10,000 characters?', a: 'Roughly seven to eight minutes of speech at a normal pace. Speaking rate varies by language and voice.' },
      { q: 'Can I use free-tier output commercially?', a: 'No. The free tier adds a watermark and does not include a commercial licence. Starter at $5/month is the cheapest plan that does.' },
      { q: 'What happens if I go over my quota?', a: 'Overage is charged per thousand extra characters, at a lower rate on higher tiers. Check the current rate on the pricing page.' },
      { q: 'Is cloning someone else’s voice allowed?', a: 'Only with their documented consent. Impersonation is both a legal and a platform-policy problem, and the responsibility sits with you.' },
      { q: 'Does it work in Portuguese?', a: 'Yes, across dozens of languages, though quality and accent naturalness vary. Test your own script in your own language before committing to a plan.' },
    ],
  },

  'notion-ai': {
    metaTitle: 'Notion AI Pricing (2026): Why the $10 Add-On Is Gone',
    metaDescription:
      'Full Notion AI now needs the Business plan at $20 per member per month — the $10 add-on is gone. What changed, what it costs, and who should skip it.',
    updated: '2026-11-10',
    intro: [
      'Notion AI used to be a $10 per member add-on you stacked on any plan. That option was withdrawn for new customers, and a lot of comparison pages still describe the old model. In November 2026 the cheapest route to full Notion AI for a new buyer is the Business plan.',
      'That change matters more than the price itself, because it turns a small add-on decision into a workspace migration decision. This page sets out what you actually get, what it costs, and when the correct answer is to keep your current setup and use something else. No affiliate ID is attached.',
    ],
    whatItDoes: [
      'Notion AI lives inside your documents. It summarises long pages, drafts and rewrites text, answers questions using your own workspace as the source, and produces meeting notes from calls. The most useful of these is workspace search: asking "what did we decide about pricing" and getting an answer with links to the pages where it was decided.',
      'That is a different product from a general assistant, because the context is your own accumulated writing. The value scales with how much of your work already lives in Notion — which is also why it is close to worthless if your team keeps documents in Google Drive and only uses Notion for the occasional wiki page.',
    ],
    pricingHeading: 'Notion AI pricing as of November 2026',
    pricingRows: [
      { plan: 'Free / Plus', price: '$0 / $10-12 per member', includes: 'Limited Notion AI trial only — not full access' },
      { plan: 'Business', price: '$20/member/mo annual · $24 monthly', includes: 'Full Notion AI: Agent, AI Meeting Notes, Enterprise Search, research mode' },
      { plan: 'Custom Agents', price: '$10 per 1,000 credits', includes: 'Metered add-on on Business and Enterprise for autonomous task agents' },
      { plan: 'Enterprise', price: 'Custom quote', includes: 'Everything in Business plus advanced controls and support' },
    ],
    pricingNotes: [
      'The retired $10 add-on is the single most persistent piece of outdated information about this product. If a comparison page quotes "Notion AI for $10 on top of Plus", it predates August 2025. Existing subscribers to the old add-on were grandfathered; new buyers cannot get it.',
      'Do the per-seat arithmetic before upgrading. Business at $20 per member is a fourfold jump from Plus at about $10 for a team of ten — $200 a month versus $100, before you count what Business adds beyond AI. If only two people will use the AI features, a team-wide upgrade is usually the wrong shape of purchase.',
    ],
    pros: [
      'Workspace-grounded answers are genuinely useful once a meaningful amount of your writing lives in Notion.',
      'Meeting notes turn recorded calls into linked, searchable documents without a separate subscription.',
      'No separate tool to adopt: the AI sits where the documents already are.',
      'Business also brings the admin and permission features growing teams need anyway.',
    ],
    cons: [
      'The cheapest route for a new buyer is a whole-plan upgrade, not an add-on — that is a large commitment for a feature.',
      'Value is proportional to how much you have already written in Notion; empty workspaces get nothing back.',
      'Credit-metered Custom Agents add a second, harder-to-predict billing surface.',
      'No standalone AI subscription means you cannot buy it for two people without moving everyone to Business.',
    ],
    bestFor:
      'Teams that already run documentation, meeting notes and project plans inside Notion and want answers drawn from that body of work.',
    notFor:
      'Anyone using Notion as a light wiki, solo users who mainly want a writing assistant, and teams unwilling to move every seat to Business. For writing help alone, a dedicated tool is cheaper per person.',
    alternatives: [
      { name: 'Jasper', href: '/en/directory/jasper', why: 'Better if the need is marketing copy with a trained brand voice rather than searching your own notes.' },
      { name: 'Otter.ai', href: '/en/directory/otter-ai', why: 'Cheaper if meeting transcription is the only AI feature you actually use.' },
      { name: 'GitHub Copilot', href: '/en/directory/github-copilot', why: 'If the documents that matter are source files rather than pages.' },
    ],
    verdict: [
      'Notion AI is a good feature attached to a purchase most teams were not planning to make. If your workspace is genuinely the centre of your team’s thinking and everyone would use the AI, Business at $20 per member is defensible — you are also buying admin controls you will want.',
      'If two people would use it, price it as "two people times $20, plus the cost of moving everyone else". Usually a dedicated writing tool for those two people is cheaper and better at the job.',
    ],
    faqs: [
      { q: 'Can I still buy Notion AI as a $10 add-on?', a: 'Not as a new customer. The standalone add-on was retired for new sign-ups in 2025; full Notion AI now comes with Business and Enterprise. Existing add-on subscribers are grandfathered.' },
      { q: 'Does the free plan include AI?', a: 'Only a limited trial of the core features. Full access — Agent, AI Meeting Notes, Enterprise Search — requires Business.' },
      { q: 'Is annual billing cheaper?', a: 'Yes, about 20%: $20 per member per month billed annually versus $24 monthly.' },
      { q: 'What are Custom Agents credits?', a: 'A separate metered product for autonomous tasks, billed at roughly $10 per 1,000 Notion credits on top of Business or Enterprise. It is not the same thing as Notion AI.' },
      { q: 'Will my AI usage be used to train models?', a: 'Notion publishes its data-use terms separately and they have changed over time. Read the current policy before putting confidential material through it.' },
    ],
  },
  'github-copilot': {
    metaTitle: 'GitHub Copilot Pricing (2026): Free, Pro $10, Pro+ $39',
    metaDescription:
      'GitHub Copilot costs $0 Free, $10 Pro, $39 Pro+, $100 Max, $19 per seat Business in November 2026. What AI credits mean and when it is not worth paying.',
    updated: '2026-11-10',
    intro: [
      'GitHub Copilot is the code assistant most developers meet first, mainly because it has the one thing its competitors did not for years: a free tier that works inside the editor you already use.',
      'The paid plans are cheap by professional standards, but since 2026 they are no longer flat — usage is metered in AI credits, which means the sticker price is a floor rather than a total. This page explains what each tier includes, what the credits mean in practice, and the situations where paying is a bad trade. No affiliate ID is attached to the link.',
    ],
    whatItDoes: [
      'Copilot suggests the next line or block as you type, answers questions about the codebase in the editor, and can execute multi-step changes in agent mode — reading files, proposing edits, running tests. The autocomplete is the part people subscribe for; the agent mode is the part that has grown fastest and the part that consumes credits.',
      'In practical terms it reduces the amount of boilerplate you type and the number of times you leave the editor to look up an API signature. It does not replace understanding the code: suggestions that look right and behave wrong are the characteristic failure, and reviewing them costs attention you would otherwise have spent writing.',
    ],
    pricingHeading: 'GitHub Copilot pricing as of November 2026',
    pricingRows: [
      { plan: 'Free', price: '$0', includes: '2,000 completions a month, limited chat and agent usage' },
      { plan: 'Pro', price: '$10/mo', includes: 'Unlimited completions, 1,500 AI credits (about $15 of usage)' },
      { plan: 'Pro+', price: '$39/mo', includes: '7,000 credits (about $70 of usage), premium models, heavy agent use' },
      { plan: 'Business', price: '$19/seat/mo', includes: 'Pooled credits per seat, admin controls, policy management' },
      { plan: 'Enterprise', price: '$39/seat/mo', includes: 'Everything in Business plus enterprise controls; same per-seat price point as Pro+' },
    ],
    pricingNotes: [
      'Since mid-2026 every plan bills in GitHub AI credits worth about one cent each, and extra usage is charged at the same rate. That means a heavy agent-mode user on Pro can exceed the monthly sticker — the plan includes 1,500 credits, roughly $15 of usage, and agent sessions burn them quickly.',
      'The practical consequence: Pro is right for completion-driven work, and Pro+ is right if you use agent mode most days. Paying for Pro and then being throttled mid-month is worse value than paying $39 and not thinking about it. Business and Enterprise are organisational purchases — buy them for the admin controls, not for the credits.',
    ],
    pros: [
      'Free tier is genuinely usable, which makes evaluation honest rather than a trial.',
      'Pro at $10 is one of the cheapest professional subscriptions in this directory.',
      'Works inside VS Code, JetBrains and Neovim, so it does not require changing editors.',
      'Repository-aware chat is useful on unfamiliar codebases, especially for orientation.',
      'Business and Enterprise add policy and audit controls that larger teams need.',
    ],
    cons: [
      'Credit metering makes heavy agent use more expensive than the headline price suggests.',
      'Quality drops sharply outside mainstream languages and well-known frameworks.',
      'Suggests plausible code that fails subtly; review effort offsets part of the time saved.',
      'Business requires every seat to be paid for, including people who barely code.',
    ],
    bestFor:
      'Professional developers writing code daily in mainstream languages, and teams that want a working tool now without a procurement cycle.',
    notFor:
      'People learning to program — it hides the skill you are there to build — and teams where the bottleneck is design or debugging rather than typing. Also a poor fit for obscure stack work where the model has little to learn from.',
    alternatives: [
      { name: 'Notion AI', href: '/en/directory/notion-ai', why: 'If the work that needs assistance is documentation and planning rather than code.' },
      { name: 'Free local tools', href: '/en/tools', why: 'For the small utilities around a release — formats, checksums, conversions — a browser tool is faster than a subscription.' },
      { name: 'Jasper', href: '/en/directory/jasper', why: 'If what you actually need is the marketing copy around the product, not the product.' },
    ],
    verdict: [
      'Copilot Free is the correct starting point for almost everyone, and it is the reason to try rather than research. If it saves you time in a normal week, Pro at $10 is an easy yes for a professional.',
      'The decision that matters is Pro versus Pro+. If your work has moved from typing completions to delegating multi-step tasks, Pro will feel throttled; measure your usage for a month on Pro before deciding, because the step up is $29, not $2.',
    ],
    faqs: [
      { q: 'Is Copilot free for individuals?', a: 'Yes. Copilot Free includes 2,000 completions a month plus limited chat and agent usage, and it is enough to judge whether the tool fits your workflow.' },
      { q: 'What are AI credits?', a: 'Since June 2026 paid plans include a monthly allowance of credits worth about $0.01 each. Extra usage is billed at the same rate, so heavy agent sessions can exceed the plan price.' },
      { q: 'Do students and open-source maintainers get it free?', a: 'GitHub has run verified free-access programmes for students, teachers and maintainers of popular projects. Check eligibility on GitHub’s own page, as terms change.' },
      { q: 'Does it train on my code?', a: 'GitHub publishes separate terms for individuals and businesses, including opt-out settings. Read the current policy before putting proprietary code through it.' },
      { q: 'Can I use it outside VS Code?', a: 'Yes — JetBrains IDEs and Neovim are supported, and there is a CLI. The completeness of features varies by editor.' },
    ],
  },

  'copy-ai': {
    metaTitle: 'Copy.ai Pricing (2026): Free 2,000 Words and the $249 Jump',
    metaDescription:
      'Copy.ai costs $0 free (2,000 words/mo), $49 Starter, $249 Advanced in November 2026. What the free tier really covers and why the price jump decides the buy.',
    updated: '2026-11-10',
    intro: [
      'Copy.ai sits in an awkward, honest place in the market. Its free plan is one of the few that is genuinely usable — 2,000 words a month, no card, no expiry — and its paid plans have a price gap with nothing in it.',
      'That gap ($49 to $249) is the whole story for most buyers, because it means you either stay on a small free allowance or commit to a sales-and-marketing automation platform. This page sets out what each November 2026 tier includes and which of those two shapes actually fits. No affiliate ID is attached.',
    ],
    whatItDoes: [
      'Copy.ai produces short-form marketing copy: product descriptions, ad variants, social posts, email subject lines, sales sequences. Its template library is large and well organised, and the output for short formats is good enough to edit rather than rewrite.',
      'The Advanced tier changes the product into a workflow automation tool — chains that take an input and run several steps to produce structured output at volume. That is powerful for a sales team generating hundreds of personalised emails and close to useless for someone who needs one good landing page.',
    ],
    pricingHeading: 'Copy.ai pricing as of November 2026',
    pricingRows: [
      { plan: 'Free', price: '$0', includes: '2,000 words/mo in chat, 1 seat, Brand Voice and Infobase included' },
      { plan: 'Starter', price: '$49/mo · about $36/mo annual', includes: '1 seat, unlimited words, unlimited chat projects, current LLMs' },
      { plan: 'Advanced', price: '$249/mo', includes: 'Up to 5 seats, 2,000 workflow credits/mo, workflow builder, 15+ marketing and sales workflows' },
      { plan: 'Enterprise', price: 'Custom quote', includes: 'Custom seats and volume, additional controls and support' },
    ],
    pricingNotes: [
      'Note that some sources report the free plan as discontinued in early 2026 while others list it as active with 2,000 words a month. Copy.ai changes packaging often; check the pricing page before relying on either. What is consistent across sources is that Advanced is $249 and there is no tier between it and Starter.',
      'That step is unusual. Most tools add a $99 middle tier; Copy.ai does not, so growing past Starter means either paying five times more or moving to a different product. Annual billing on Starter is roughly 25% off, which makes the entry cheaper but does not change the jump.',
    ],
    pros: [
      'Free plan includes Brand Voice and Infobase — features most competitors charge for.',
      'Short-form copy output is fast and needs light editing, not rewriting.',
      'Large, well-categorised template library covers the routine marketing formats.',
      'Starter’s unlimited words removes the anxiety of counting.',
    ],
    cons: [
      'No middle tier: growing past Starter means a fivefold price jump.',
      'The workflow automation that justifies Advanced is irrelevant to solo users.',
      'Long-form output is weaker than short-form and needs substantial editing.',
      'Free-plan availability has changed more than once; do not build a process that depends on it.',
    ],
    bestFor:
      'Solo marketers and small teams producing high volumes of short copy — product descriptions, ad variants, subject lines — who want a free start and a cheap-ish ceiling.',
    notFor:
      'Anyone producing long-form articles, teams that need workflow automation on a small budget, and anyone who needs consistent brand voice across many writers. Jasper is stronger there and priced per team.',
    alternatives: [
      { name: 'Jasper', href: '/en/directory/jasper', why: 'Better brand-voice consistency for teams, and per-team pricing spreads the cost across seats.' },
      { name: 'Canva Magic Studio', href: '/en/directory/canva-magic', why: 'If the copy is going into a designed asset, generating it where the design lives saves a step.' },
      { name: 'Word counter here, free', href: '/en/tools/word-counter', why: 'Checking whether a draft hits its brief is a two-second job; you do not need a subscription for it.' },
    ],
    verdict: [
      'Copy.ai is a good free tool and a reasonable $49 tool. It is rarely the right $249 tool for someone reading this page, because the workflows that justify the price belong to a sales operation, not to a person writing copy.',
      'Start on the free plan, measure how often you hit 2,000 words, and upgrade to Starter only if you hit it weekly. If you find yourself wanting Advanced, that is usually the signal that your need changed shape and a different category of tool is the answer.',
    ],
    faqs: [
      { q: 'Is the free plan really free?', a: 'It has historically been a permanent free tier of about 2,000 words a month with no card required. Some sources reported it discontinued in 2026, so confirm on Copy.ai’s pricing page before depending on it.' },
      { q: 'Why is there no plan between $49 and $249?', a: 'That is Copy.ai’s packaging choice: Advanced bundles multi-seat workflow automation, not a mid-sized writing plan. There is nothing in between to buy.' },
      { q: 'Does the free plan include brand voice?', a: 'Yes — Brand Voice and Infobase are included on the free tier, which is unusual and is the strongest reason to test it first.' },
      { q: 'Is it good for long articles?', a: 'Not its strength. Short formats are where the output is closest to usable; long-form needs substantial editing.' },
      { q: 'Can I cancel and keep my output?', a: 'Text you generated is yours. Saved projects and brand-voice training live in the account, so export before cancelling.' },
    ],
  },

  pika: {
    metaTitle: 'Pika Labs Pricing (2026): $10 Starter and the Free Tier Trap',
    metaDescription:
      'Pika costs $10 Starter, $35 Creator, $95 Fancy in November 2026. Reports on the free tier disagree — here is how to check, and when Pika beats Runway.',
    updated: '2026-11-10',
    intro: [
      'Pika is the AI video tool that made a name for itself with effects nobody else replicated well — making objects melt, inflate or explode inside a shot. It relaunched in September 2026 as a single platform for video, image and sound, and the pricing changed with it.',
      'That relaunch is also why you should distrust any page that states the free tier confidently. Sources published in 2026 disagree about whether Pika offers 80 monthly credits or none at all, which is a sign the product was repackaged mid-year. Below is what can be verified, and how to check the rest in a minute. No affiliate ID is attached.',
    ],
    whatItDoes: [
      'Pika generates short video clips from text or images and specialises in stylised, social-first effects: Pikaffects (object transformations), Pikaswaps (replace an object inside a clip) and Pikadditions (insert something into existing footage). It is built for vertical, short, attention-grabbing clips rather than for cinematic production.',
      'It is a different tool from Runway in intent. Runway is for shots inside a professional edit; Pika is for clips that exist to be scrolled past and stopped. If your output lives on social feeds, Pika’s effects are the differentiator. If it lives in a client edit, the control and consistency matter more than the novelty.',
    ],
    pricingHeading: 'Pika pricing as of November 2026',
    pricingRows: [
      { plan: 'Free', price: '$0', includes: 'Reported as either 80 credits a month or credit packs only — verify on Pika’s site; no commercial licence either way' },
      { plan: 'Starter', price: '$10/mo', includes: 'Reported 900 credits a month with a commercial licence — the cheapest tier with commercial rights' },
      { plan: 'Creator', price: '$35/mo', includes: 'Higher credit allowance and access to the full effect library' },
      { plan: 'Fancy', price: 'from $95/mo', includes: 'Highest allowance and priority processing; annual billing roughly 20% less' },
    ],
    pricingNotes: [
      'The free tier is the part to verify yourself, because the published numbers contradict each other across 2026 sources. Open Pika’s pricing page, look at the free row, and note two things: the credit allowance and whether commercial use is permitted. Those two facts decide whether the free tier is a real option or a demo.',
      'On paid plans, watch the credit cost per clip rather than the credit total. A ten-second 1080p generation reportedly consumes a large share of a mid-tier monthly allowance, so a plan that looks generous in credits can be a handful of usable clips at full resolution. Lower resolution stretches it; that is the lever, as with every tool in this category.',
    ],
    pros: [
      'Pikaffects produce effects that are genuinely hard to reproduce elsewhere, which matters for social-first content.',
      'Starter at $10 is among the cheapest entry points to AI video with a commercial licence.',
      'Built for vertical short-form, so the output format matches where the audience is.',
      'Fast turnaround on simple clips compared with heavier production tools.',
    ],
    cons: [
      'Free-tier terms are unclear across sources and have changed during 2026 — verify rather than trust.',
      'Credit costs per clip at high resolution make the allowance shrink quickly.',
      'Continuity across several shots is weak, as with every generator at this price.',
      'The platform relaunched mid-2026, so feature names and limits may still be settling.',
    ],
    bestFor:
      'Creators making short vertical social video who want distinctive visual effects and a cheap commercial licence.',
    notFor:
      'Anyone producing long-form or client work needing shot-to-shot continuity, and anyone who needs certainty about terms before paying — in that case verify first or choose a vendor with stable published limits.',
    alternatives: [
      { name: 'Runway', href: '/en/directory/runway', why: 'More control and better tooling for shots inside a professional edit, at a higher price.' },
      { name: 'Midjourney', href: '/en/directory/midjourney', why: 'If the deliverable is a still image, the GPU-hour model is easier to reason about.' },
      { name: 'ElevenLabs', href: '/en/directory/elevenlabs', why: 'If the clip is fine but the narration is what makes it work.' },
    ],
    verdict: [
      'Pika is the right buy if you make vertical social clips and the effect is the point. At $10 for a commercial licence it is a low-risk experiment, which is exactly how it should be treated.',
      'It is the wrong buy if you need predictable costs or shot continuity. And before paying anything, spend one minute on Pika’s own pricing page confirming the free tier — several 2026 reviews disagree with each other, and the answer has changed once already.',
    ],
    faqs: [
      { q: 'Does Pika have a free plan?', a: 'Sources published in 2026 disagree — some report 80 credits a month, others report credit packs only after the September 2026 relaunch. Check Pika’s own pricing page before relying on it.' },
      { q: 'Can I use Pika output commercially?', a: 'Reportedly yes from Starter upward. The free tier has been reported as lacking a commercial licence, so verify before publishing anything you are paid for.' },
      { q: 'How many clips do I get per month?', a: 'It depends on resolution and model. A high-resolution ten-second clip reportedly consumes a large share of a mid-tier allowance; lower resolutions stretch it considerably.' },
      { q: 'Pika or Runway?', a: 'Pika for stylised short social clips and novel effects; Runway for controlled shots inside a professional edit and for utility tools like inpainting and upscaling.' },
      { q: 'Does it work for landscape video too?', a: 'It supports multiple aspect ratios, but the product is optimised for vertical short-form. Do not buy it expecting a documentary workflow.' },
    ],
  },

  'canva-magic': {
    metaTitle: 'Canva Pro Pricing (2026): What Magic Studio Adds for $15',
    metaDescription:
      'Canva Pro costs about $15/mo monthly or $120/year in November 2026. What Magic Studio AI includes, the credit limits, and when the free plan is enough.',
    updated: '2026-11-10',
    intro: [
      'Canva is not really an AI tool — it is a design tool that has absorbed AI features into every step. That distinction explains both why it is the most useful subscription on this site for non-designers and why its AI credits are the least important part of what you buy.',
      'The case for Pro rests on three things that have nothing to do with AI: the Brand Kit, the asset library, and Magic Resize. Below is what Pro costs in November 2026, what the AI layer actually adds, and when the free plan is genuinely sufficient. No affiliate ID is attached.',
    ],
    whatItDoes: [
      'Canva is a browser-based design editor with templates for social posts, presentations, documents, video and print. You edit in a drag-and-drop canvas and export to image, PDF or video. Magic Studio is the AI layer: Magic Write drafts text, Dream Lab generates images, Magic Eraser removes objects, Magic Expand extends an image beyond its frame, and Background Remover cuts subjects out.',
      'For most small businesses the practical workflow is template-first: pick a layout that already works, swap in your text and images, export at the right size for each channel. Magic Resize — which takes one design and produces every platform size — is the single feature that saves the most real time, and it is a Pro feature.',
    ],
    pricingHeading: 'Canva pricing as of November 2026',
    pricingRows: [
      { plan: 'Free', price: '$0', includes: 'Templates and editor, limited monthly AI uses, no Brand Kit, no Magic Resize' },
      { plan: 'Pro', price: 'about $15/mo monthly · $120/year', includes: 'Full Magic Studio, about 500 AI credits a month, Brand Kit, Magic Resize, premium assets' },
      { plan: 'Teams', price: 'from about $10/person/mo annual', includes: 'Everything in Pro plus approvals, shared brand controls and admin tools' },
      { plan: 'Nonprofit / education', price: 'Free or discounted', includes: 'Canva runs verified free Pro for eligible nonprofits and schools — check eligibility' },
    ],
    pricingNotes: [
      'The annual price is the one to compare: $120 a year works out near $10 a month, which is a third less than paying monthly. Given that most people keep Canva for years rather than months, monthly billing is the expensive way to subscribe.',
      'AI credit allowances are reported inconsistently — some sources cite about 500 credits a month on Pro, others describe tiered standard/premium/ultra allowances with a paid top-up. What is stable is that the AI sits inside a design tool you would want anyway. If you are buying Canva purely for AI image generation, you are buying the wrong product.',
    ],
    pros: [
      'Brand Kit keeps logo, colours and fonts consistent across everything, which is the real reason professionals upgrade.',
      'Magic Resize turns one design into every channel size — the biggest single time saver for social work.',
      'The free plan is genuinely usable, so you can learn the tool before paying.',
      'Background Remover alone is worth the annual price for anyone producing product imagery.',
      'One subscription covers social, documents, presentations and simple video.',
    ],
    cons: [
      'AI credit allowances are modest and documented inconsistently; heavy generation needs the paid top-up.',
      'Export quality and file options on the free plan are limited in ways that bite on print work.',
      'It is a design tool, not a design education — templates make competent output easy and distinctive output harder.',
      'Team pricing per person adds up; small agencies often pay for seats that are used a few times a month.',
    ],
    bestFor:
      'Non-designers running marketing for a small business: social posts, flyers, presentations, product imagery — everything that needs to look consistent and ship quickly.',
    notFor:
      'Professional designers who need print-accurate control, anyone buying it as an AI image generator, and teams needing precise typography or CMYK output — a real layout tool is the correct answer there.',
    alternatives: [
      { name: 'Midjourney', href: '/en/directory/midjourney', why: 'If the goal is striking generated imagery rather than finished, sized, branded assets.' },
      { name: 'Remove background here, free', href: '/en/tools/remove-bg', why: 'For a one-off cut-out you do not need a design subscription at all.' },
      { name: 'Jasper', href: '/en/directory/jasper', why: 'If the words, not the visuals, are the bottleneck in your content.' },
    ],
    verdict: [
      'Canva Pro is the easiest subscription on this site to justify: about $10 a month on annual billing, and the Brand Kit plus Magic Resize pay for it in the first week of regular social work.',
      'Buy it for the design tool and treat the AI as a bonus. If you are choosing it because you want AI images, Midjourney or a dedicated generator will serve you better — and if you only need a background removed, the free browser tool here does that without an account.',
    ],
    faqs: [
      { q: 'How much is Canva Pro?', a: 'About $15 a month billed monthly, or $120 a year, which works out near $10 a month. Verify current pricing on Canva’s site, as regional pricing differs.' },
      { q: 'Do I need Pro for Magic Studio?', a: 'Basic AI access is available on the free plan with tight monthly limits. Full Magic Studio with a larger credit allowance is a Pro feature.' },
      { q: 'What are AI credits?', a: 'A monthly allowance for generative features. Reported allowances differ across sources, so check your account’s plan page for the current figure.' },
      { q: 'Is there a free version for nonprofits?', a: 'Canva has run a free Pro programme for verified nonprofits and an education programme for schools. Eligibility and terms are on Canva’s own site.' },
      { q: 'Can I use Canva designs commercially?', a: 'Yes for your own designs, subject to Canva’s content licence terms — some assets have restrictions. Read the licence page before selling printed products.' },
    ],
  },

  'otter-ai': {
    metaTitle: 'Otter.ai Pricing (2026): 300 Free Minutes and the 30-Minute Cap',
    metaDescription:
      'Otter.ai pricing in November 2026: free 300 min/mo but 30-min cap per conversation, Pro $16.99 or $8.33 annual, Business $30/user. Where it stops working.',
    updated: '2026-11-10',
    intro: [
      'Otter.ai turns meetings and recordings into searchable text. Its free plan looks the most generous in this directory — 300 minutes a month at no cost — and it hides a limit that decides whether it is usable: thirty minutes per single conversation.',
      'That cap is the whole story for anyone whose meetings run long, and the monthly-versus-annual gap on Pro decides the rest. Here is what each November 2026 tier allows, and when a different approach is cheaper. No affiliate ID is attached.',
    ],
    whatItDoes: [
      'Otter joins or records a meeting, transcribes it with speaker labels, and produces a summary. The transcripts are searchable across your history, which makes it useful as a memory aid for teams: "what did we agree in the call three weeks ago" becomes a search rather than a guess.',
      'Its strengths are integration and search rather than raw transcription accuracy. It works with the common meeting platforms, and the archive is the product — a hundred transcribed meetings you can query is worth more than one perfect transcript you cannot find. What it does not do is distinguish voices reliably in a noisy room, and it will not fix a badly run meeting.',
    ],
    pricingHeading: 'Otter.ai pricing as of November 2026',
    pricingRows: [
      { plan: 'Basic', price: '$0', includes: '300 minutes/mo, 30-minute cap per conversation, 3 file imports lifetime, limited AI queries' },
      { plan: 'Pro', price: '$16.99/mo monthly · about $8.33/mo annual', includes: '1,200 minutes/mo, 90-minute cap per conversation, more imports and AI queries' },
      { plan: 'Business', price: '$30/user monthly · about $19.99/user annual', includes: 'Unlimited meeting transcription, longer imports, team features; three-seat minimum reported' },
      { plan: 'Enterprise', price: 'Custom quote', includes: 'Advanced controls, higher limits, dedicated support' },
    ],
    pricingNotes: [
      'The annual discount on Pro is unusually large: $16.99 monthly against roughly $8.33 billed yearly. That is roughly half price, and it means the monthly plan is a trial you are paying for. If you intend to keep Otter for a year, pay annually from the start.',
      'On Business, watch the reported three-seat minimum — a team of two effectively pays for three. And note the free tier’s per-conversation cap of thirty minutes: three hundred monthly minutes sounds like ten hours of meetings, but it is ten hours only if each one is under half an hour. For a weekly ninety-minute planning call, the free tier cannot record it at all.',
    ],
    pros: [
      'Searchable transcript archive is the real product, and it improves the longer you use it.',
      'Free tier of 300 minutes a month is genuinely useful for short, frequent calls.',
      'Annual Pro billing halves the monthly price.',
      'Integrations with the common meeting platforms, so no new workflow to adopt.',
    ],
    cons: [
      'The free tier’s 30-minute per-conversation cap blocks most real meetings.',
      'Only three lifetime file imports on the free plan — no bulk processing of recordings.',
      'Speaker labels degrade in noisy rooms or with overlapping speech.',
      'Business reportedly requires a three-seat minimum, which is expensive for small teams.',
    ],
    bestFor:
      'Individuals and small teams who live in short meetings and want a searchable record of what was said and decided.',
    notFor:
      'Anyone whose calls routinely exceed thirty minutes on the free plan, anyone needing legally certified transcripts, and people who mainly want to transcribe pre-recorded audio files in bulk — the import limits make that painful.',
    alternatives: [
      { name: 'ElevenLabs', href: '/en/directory/elevenlabs', why: 'The reverse direction — turning written text into speech rather than speech into text.' },
      { name: 'Notion AI', href: '/en/directory/notion-ai', why: 'If the notes belong next to the project docs and your team already works in Notion.' },
      { name: 'Word counter here, free', href: '/en/tools/word-counter', why: 'To check the length of a transcript you exported, without an extra subscription.' },
    ],
    verdict: [
      'Otter is worth paying for if your meetings are short and your need is a searchable archive. Pro billed annually at roughly $8.33 is a fair price for 1,200 minutes and a 90-minute cap that covers most real conversations.',
      'If your meetings run long, price Pro annually — the free tier will refuse the recording, not just limit it. And if the only thing you need is one transcript a week, check whether your meeting platform already offers transcription before subscribing to a second service.',
    ],
    faqs: [
      { q: 'What is the 30-minute limit on the free plan?', a: 'Each individual conversation on the free tier is capped at 30 minutes, even though the monthly allowance is 300 minutes. A longer meeting cannot be recorded in one go.' },
      { q: 'Is annual billing really half price?', a: 'Effectively — Pro is about $16.99 billed monthly against roughly $8.33 per month when billed yearly. Verify current figures on Otter’s pricing page.' },
      { q: 'Does the free plan allow file uploads?', a: 'It includes three file imports for the lifetime of the account, which rules out bulk transcription of recordings.' },
      { q: 'Is Business really a three-seat minimum?', a: 'That has been reported by multiple 2026 sources. Confirm with Otter before budgeting for a two-person team.' },
      { q: 'Are transcripts accurate enough for legal use?', a: 'No. Treat them as a working record that requires human review, not as a certified transcript.' },
    ],
  },
};
