/**
 * Conteudo editorial das paginas de ferramenta.
 *
 * Cada entrada responde: o que a ferramenta faz, para quem serve, quando NAO
 * serve, e qual o proximo passo. O objetivo nao e encher a pagina de texto:
 * e dar ao visitante (e ao revisor do AdSense) uma razao concreta para a
 * pagina existir alem do widget.
 *
 * Regras seguidas em todas as entradas:
 *  - nenhum numero inventado (sem "10.000 usuarios", sem nota, sem depoimento)
 *  - nenhuma promessa de resultado ("melhore 300%" nao aparece aqui)
 *  - limitacao honesta declarada em `notIdealFor`
 *  - o CTA de afiliado e marcado com `#ad` e o link leva `rel="sponsored"`
 */

export interface ToolAffiliateCta {
  /** Texto honesto do porque existe uma alternativa paga. */
  body: string;
  /** Rotulo do botao. Nunca "comprar agora" se o produto e outro. */
  label: string;
  /** Destino. Interno (/en/directory/...) ou o roteador /go/<slug>. */
  href: string;
  /** Nome do servico, exibido ao lado do #ad. Ausente quando o CTA e interno. */
  partner?: string;
  /**
   * true SOMENTE quando o link carrega um ID de afiliado real e gera comissao.
   * Enquanto for false/ausente, o CTA nao recebe #ad nem rel=sponsored:
   * anunciar comissao que nao existe e divulgacao enganosa.
   */
  monetized?: boolean;
}

export interface ToolEditorial {
  /** <title> — ate 60 caracteres, com a palavra-chave no inicio. */
  metaTitle: string;
  /** <meta description> — 140 a 158 caracteres, com beneficio e sem clickbait. */
  metaDescription: string;
  /** Palavra-chave alvo. */
  keyword: string;
  /** Dois paragrafos: o que faz, depois por que importa. */
  intro: string[];
  /** Tres beneficios concretos, nao adjetivos. */
  benefits: { title: string; desc: string }[];
  /** Limitacao honesta. Esta secao e o que separa util de enganoso. */
  notIdealFor: string;
  /** CTA final. */
  cta: ToolAffiliateCta;
  /** Data editorial, visivel na pagina. */
  updated: string;
}

export const TOOL_EDITORIAL: Record<string, ToolEditorial> = {

  'qr-generator': {
    metaTitle: 'Free QR Code Generator — No Signup, No Expiry',
    metaDescription:
      'Create a static QR code for a URL, Wi-Fi password or plain text. PNG download, no account, no redirect server, no scan limit. Runs entirely in your browser.',
    keyword: 'free qr code generator',
    intro: [
      'This tool turns a link, a block of text or your Wi-Fi credentials into a QR code image you can download as a PNG. You can choose the error-correction level, which decides how much of the code can be damaged or dirty before a scanner refuses to read it.',
      'The code is generated as a static image, not as a redirect through a third-party domain. That matters for more than privacy: dynamic QR services route every scan through their own server and can switch the code off when a trial ends. A static code keeps working for as long as the destination does.',
    ],
    benefits: [
      { title: 'No redirect server', desc: 'The data is encoded directly in the image, so nobody sits between the scan and the destination.' },
      { title: 'Print-ready output', desc: 'Rendered at high resolution, which is what keeps a code sharp on a business card or a poster.' },
      { title: 'Works offline once loaded', desc: 'The encoding runs in your browser, so no data is uploaded at any point.' },
    ],
    notIdealFor:
      'If you need to change the destination after the code is printed, or you need scan analytics by city and device, a static code cannot do that — those features require a redirect service, and that always means a third party sees every scan.',
    cta: {
      partner: 'Canva',
      body: 'Need the artwork around the code as well — a poster, a menu, a table tent? Canva has templates for print layouts that already respect the quiet zone a QR code needs to scan reliably.',
      label: 'See Canva layout templates',
      href: '/en/directory/canva-magic',
    },
    updated: '2026-11-23',
  },

  'password-generator': {
    metaTitle: 'Strong Password Generator — Random, Local, Free',
    metaDescription:
      'Generate a high-entropy password with your browser own crypto API. Choose length and character set. Nothing is sent to a server, nothing is stored or logged.',
    keyword: 'strong password generator',
    intro: [
      'This tool builds a random password using your browser cryptographic random source, not a predictable pseudo-random sequence. You set the length and which character classes to include, and the entropy estimate updates as you change those settings.',
      'Because the generation happens locally, the password you end up with never crosses the network. That is the difference that matters: a password created on a website is only as private as that website says it is, and you have no way to verify the claim.',
    ],
    benefits: [
      { title: 'Cryptographic randomness', desc: 'Uses crypto.getRandomValues, the same source browsers use for keys and tokens.' },
      { title: 'Entropy shown, not promised', desc: 'You see the estimated bits of entropy for the exact length and character set you picked.' },
      { title: 'Nothing stored', desc: 'No cookie, no local storage, no request containing the result. Close the tab and it is gone.' },
    ],
    notIdealFor:
      'A strong password you cannot remember and do not store safely is worse than a weaker one you keep in a password manager. Generate here, then save it in a manager — never in a note, a spreadsheet or a chat message.',
    cta: {
      body: 'A generator is half the job. The other half is where the password lives. If you do not use a password manager yet, start there before you start rotating passwords.',
      label: 'Compare other free browser tools',
      href: '/en/tools',
    },
    updated: '2026-11-23',
  },

  'word-counter': {
    metaTitle: 'Word & Character Counter — Live, Private, Free',
    metaDescription:
      'Count words, characters and sentences as you type, with reading time and keyword density. Nothing is uploaded — the counting happens in your browser.',
    keyword: 'word counter',
    intro: [
      'Paste or type text and this page counts words, characters with and without spaces, sentences and paragraphs in real time. It also estimates reading time and shows how often each word repeats, which is useful when you need to check whether a draft leans on the same term.',
      'The practical use is length limits: a meta description that must stay under 158 characters, a university statement with a hard word cap, a job posting that gets cut off at a fixed count. Guessing at those numbers is how text gets rejected at the last step.',
    ],
    benefits: [
      { title: 'Character limits respected exactly', desc: 'Counts with and without spaces, so it works for limits that specify one or the other.' },
      { title: 'Reading time estimate', desc: 'Useful for deciding whether a section is too long before a reader decides it for you.' },
      { title: 'Text stays local', desc: 'The text is processed in the page. Nothing is transmitted, which matters for unpublished drafts and client work.' },
    ],
    notIdealFor:
      'Counting words is not editing. A draft that hits the exact word count can still be unclear, and this tool will not tell you that — no counter will.',
    cta: {
      partner: 'Copy.ai',
      body: 'If the bottleneck is not length but getting the first draft out at all, an AI writing assistant helps more than a counter. Copy.ai is the one we list with the highest published commission — which is exactly why we disclose it here rather than hiding it.',
      label: 'See Copy.ai pricing and details',
      href: '/en/directory/copy-ai',
    },
    updated: '2026-11-23',
  },

  'unit-converter': {
    metaTitle: 'Unit Converter — Length, Weight, Area, Temperature',
    metaDescription:
      'Convert length, weight, area and temperature instantly, with the exact formula shown for each result. No rounding surprises, no upload, works offline.',
    keyword: 'unit converter',
    intro: [
      'Pick a category, enter a value and the conversion appears as you type, together with the formula used. Showing the formula is deliberate: a converter that only gives you a number asks you to trust it, and a converter that shows its arithmetic does not.',
      'Temperature is handled separately because it is the one common conversion that is not a simple multiplication — Celsius to Fahrenheit includes an offset, and half the converters online get the negative values wrong.',
    ],
    benefits: [
      { title: 'Formula visible', desc: 'Every result shows the conversion used, so you can check it against another source.' },
      { title: 'Handles negative temperatures', desc: 'The offset in Celsius and Fahrenheit conversions is applied correctly below zero.' },
      { title: 'No rounding traps', desc: 'Full precision is available, and the rounded display value is labelled as rounded.' },
    ],
    notIdealFor:
      'For regulated work — medication doses, engineering tolerances, customs declarations — never rely on a web converter, including this one. Use the reference standard your field requires and keep the calculation on record.',
    cta: {
      body: 'If you convert the same values regularly, a spreadsheet formula will be faster and auditable. The rest of our browser tools cover the cases where opening a spreadsheet is overkill.',
      label: 'Browse all free tools',
      href: '/en/tools',
    },
    updated: '2026-11-23',
  },

  'color-picker': {
    metaTitle: 'Color Picker & Palette Generator — HEX, RGB, HSL',
    metaDescription:
      'Pick a color and get HEX, RGB and HSL values instantly, with contrast checking against white and black. Free, no signup, runs in your browser.',
    keyword: 'color picker hex rgb hsl',
    intro: [
      'Choose a color visually or paste a value you already have, and the tool returns the equivalent HEX, RGB and HSL codes. It also reports the contrast ratio against white and black, which is the number that decides whether text in that color is readable at all.',
      'Contrast checking is the part most color tools leave out. A color can look fine on your monitor and fail accessibility guidance on a phone in daylight — and if you build interfaces, that failure is a support ticket waiting to happen.',
    ],
    benefits: [
      { title: 'Three formats at once', desc: 'HEX for CSS, RGB for design tools, HSL for building graduated palettes by hand.' },
      { title: 'Contrast ratio included', desc: 'Shows whether the color passes or fails WCAG AA for normal and large text.' },
      { title: 'Copy in one click', desc: 'Each value has its own copy button, in the exact format each tool expects.' },
    ],
    notIdealFor:
      'This is not a full design tool. It does not extract palettes from an image, generate accessible variants automatically, or manage a shared brand library — for that you need design software.',
    cta: {
      partner: 'Canva',
      body: 'Once you have the palette, Canva lets you apply it across templates without rebuilding the layout by hand. We earn a commission if you subscribe through our link — stated before you click, not after.',
      label: 'See Canva design tools',
      href: '/en/directory/canva-magic',
    },
    updated: '2026-11-23',
  },

  'pdf-to-jpg': {
    metaTitle: 'PDF to JPG Converter — Free, No Upload, No Watermark',
    metaDescription:
      'Turn each PDF page into a JPG image at the resolution you choose. No upload, no watermark, no page limit. The file never leaves your device.',
    keyword: 'pdf to jpg converter free',
    intro: [
      'This tool renders every page of a PDF as a separate JPG image. You choose the output resolution, and pages are processed in order so the numbering stays predictable when you export them.',
      'The file is read and converted inside the browser. That is not a technical detail for a document that contains a contract, a payslip or an ID scan: with most online converters, uploading is the whole mechanism, and the file sits on a server you know nothing about.',
    ],
    benefits: [
      { title: 'No upload at all', desc: 'The PDF is opened locally and rendered to canvas — nothing is sent, so there is nothing to leak.' },
      { title: 'Resolution you control', desc: 'Export at 72 dpi for previews or several times that for print, instead of accepting one fixed setting.' },
      { title: 'No watermark, no page cap', desc: 'The usual free-tier limits — one file, five pages, logo over the result — do not apply here.' },
    ],
    notIdealFor:
      'A converted PDF loses its text layer: the result is an image, so the words inside it can no longer be selected, searched or read by a screen reader. If the text needs to stay usable, convert to text instead of an image.',
    cta: {
      partner: 'Adobe Acrobat',
      body: 'If you need OCR — recovering the text layer from a scanned PDF — that is beyond what a browser converter can do reliably. Adobe Acrobat handles it. We link to the official page and earn nothing from the click.',
      label: 'Compare Acrobat options',
      href: '/go/adobe',
      monetized: false, // TODO: true no dia em que o link tiver ID
    },
    updated: '2026-11-23',
  },

  'jpg-to-pdf': {
    metaTitle: 'JPG to PDF Converter — Free, Order and Margins',
    metaDescription:
      'Combine JPG or PNG images into a single PDF, in the order you set, with page size and margins. No upload, no watermark, no account required.',
    keyword: 'jpg to pdf converter',
    intro: [
      'Drop in a set of images, arrange them in the order you want and export a single PDF. You set the page size and the margin, which decides whether a photo fills the page or sits inside a border.',
      'Ordering matters more than people expect. Most converters sort alphabetically or by upload order and give you no way to fix it, so a scanned document comes out with page 10 before page 2. Here the order is yours before you export.',
    ],
    benefits: [
      { title: 'Order under your control', desc: 'Reorder the list before converting, instead of accepting whatever order the files arrived in.' },
      { title: 'Page size and margins', desc: 'A4, Letter or fitted to the image, with a margin you set rather than a fixed one.' },
      { title: 'Files never uploaded', desc: 'The PDF is assembled in memory in your browser and saved straight to your device.' },
    ],
    notIdealFor:
      'The result is a PDF made of images, so it stays large and its text is not searchable. For a document of scanned text you intend to share widely, compress it afterwards or use a tool with OCR.',
    cta: {
      partner: 'Adobe Acrobat',
      body: 'For a PDF that needs to be small, searchable and editable after assembly, Acrobat does the part this tool deliberately does not. Affiliate link — disclosed here, before the click.',
      label: 'See Acrobat pricing',
      href: '/go/adobe',
      monetized: false, // TODO: true no dia em que o link tiver ID
    },
    updated: '2026-11-23',
  },

  'compress-pdf': {
    metaTitle: 'Compress PDF Online — Free, No Upload, No Watermark',
    metaDescription:
      'Reduce PDF file size by resampling images and stripping redundant data. Choose the quality level and compare the result before you save. No upload.',
    keyword: 'compress pdf online free',
    intro: [
      'This tool reduces the size of a PDF by re-encoding the images inside it and removing data that is not needed to display the document. You pick a quality level and see the resulting size before you commit, so you are not guessing at the trade-off.',
      'Most of the weight in a typical PDF is images embedded at print resolution that will only ever be read on a screen. Bringing that resolution down to what the document is actually used for is usually the whole job — and it is why a large file can often shrink by more than half without visible damage.',
    ],
    benefits: [
      { title: 'See the size first', desc: 'Compare original and compressed size, and the preview, before saving anything.' },
      { title: 'Choose the trade-off', desc: 'Higher quality keeps detail; lower quality wins more size. You decide which matters.' },
      { title: 'Nothing leaves the device', desc: 'No upload, no temporary file on a server, no retention policy you have to trust.' },
    ],
    notIdealFor:
      'If the PDF must stay print-ready — a press file with CMYK images and embedded fonts — compression will degrade it in ways that matter. Keep the original for print and compress only the copy you send by email.',
    cta: {
      partner: 'Smallpdf',
      body: 'If you compress PDFs in volume or need it inside a workflow with a phone app, a dedicated service may be worth it. Smallpdf is the one we list for that. We link to its official page and earn nothing from the click.',
      label: 'See Smallpdf plans',
      href: '/go/smallpdf',
      monetized: false, // TODO: true no dia em que o link tiver ID
    },
    updated: '2026-11-23',
  },

  'merge-pdf': {
    metaTitle: 'Merge PDF Files — Free, Keep Order, No Upload',
    metaDescription:
      'Join several PDFs into one document in the exact order you choose. No upload, no page limit, no watermark. Files are processed in your browser.',
    keyword: 'merge pdf files free',
    intro: [
      'Select several PDFs, drag them into the order you need and export one combined document. Page order across files is preserved exactly as you arrange it, and each file can be moved as a block rather than page by page.',
      'Merging is one of those tasks where the free tools usually add a condition: a page limit, a watermark, a subscription prompt after the second file. Because the merge here happens in the browser with no server involved, there is no cost that has to be recovered from you.',
    ],
    benefits: [
      { title: 'Exact order, whole files', desc: 'Arrange documents as blocks — the usual mistake in other tools is having to reorder page by page.' },
      { title: 'No page limit', desc: 'Add as many files as your device memory can hold; the constraint is your machine, not a paywall.' },
      { title: 'No watermark', desc: 'The output is the document you assembled, with nothing added to it.' },
    ],
    notIdealFor:
      'Password-protected PDFs must be unlocked before they can be merged, and encrypted files will be rejected rather than quietly altered. Some merged files also lose their individual bookmarks — check the result if navigation matters.',
    cta: {
      partner: 'Smallpdf',
      body: 'For merging on a phone, or merging inside a document workflow with OCR and signing, a dedicated service covers ground this tool does not. Commission disclosed before the click.',
      label: 'See Smallpdf plans',
      href: '/go/smallpdf',
      monetized: false, // TODO: true no dia em que o link tiver ID
    },
    updated: '2026-11-23',
  },

  'remove-bg': {
    metaTitle: 'Remove Image Background — Free, No Upload, No Signup',
    metaDescription:
      'Remove the background from a photo in your browser and download a clean transparent PNG. No upload, no account, no watermark and no daily limit.',
    keyword: 'remove background from image free',
    intro: [
      'Load an image and this tool separates the subject from the background, giving you a PNG with transparency. It works best on clear subjects — a product on a plain surface, a person against a wall — and struggles, honestly, where any tool struggles: hair, glass and busy backgrounds.',
      'The image is processed locally, which is the point. Product photos, portraits and documents often cannot be uploaded to an unknown server under the terms a client gave you. Here there is no upload to be worried about.',
    ],
    benefits: [
      { title: 'Transparent PNG output', desc: 'Ready to drop onto any background in a design tool or a product listing.' },
      { title: 'No daily limit', desc: 'The free tier elsewhere is typically a handful of images per day or a resolution cap; neither applies.' },
      { title: 'Processed on your device', desc: 'No server sees the image, so client material and personal photos stay private.' },
    ],
    notIdealFor:
      'Fine detail is where local processing shows its limit. Stray hair, semi-transparent fabric, glass and reflections need a model trained for cut-outs, and results from any browser-based method will show rough edges that a specialist service handles better.',
    cta: {
      partner: 'remove.bg',
      body: 'If you need clean edges on hair or glass, or you process hundreds of product images, a dedicated service will do better on those specific cases. We earn a commission if you buy credits through our link.',
      label: 'Compare remove.bg credits',
      href: '/go/removebg',
      monetized: false, // TODO: true no dia em que o link tiver ID
    },
    updated: '2026-11-23',
  },

  'image-compressor': {
    metaTitle: 'Image Compressor — Reduce JPG, PNG, WebP Size Free',
    metaDescription:
      'Shrink JPG, PNG and WebP files by choosing a quality level, with a before-and-after preview of both file size and detail. No upload, no watermark.',
    keyword: 'compress image online free',
    intro: [
      'This tool re-encodes an image at a quality level you select and shows you the resulting file size next to the original. You can compare the preview before saving, so the decision about how much quality to trade for how much size is yours and is informed.',
      'Page weight is the most common reason a site feels slow on a phone, and images are usually where the weight is. A photo straight from a camera is often ten times larger than it needs to be for the space it occupies on screen.',
    ],
    benefits: [
      { title: 'Before and after in numbers', desc: 'Exact byte count for both versions, so you can decide against a target rather than by feel.' },
      { title: 'Format choice', desc: 'Keep the original format or convert to WebP, which is smaller at matched visual quality.' },
      { title: 'No upload', desc: 'Decoding and re-encoding happen in the browser; the file does not travel anywhere.' },
    ],
    notIdealFor:
      'Compression cannot add detail that is not there, and repeated re-saving of a JPEG degrades it further each time — always compress from the original file, never from an already compressed copy. For images that must stay pixel-exact, use lossless PNG optimisation instead.',
    cta: {
      partner: 'Canva',
      body: 'If the images are going into a design rather than just onto a page, Canva exports at the right size for each placement, which prevents the problem rather than fixing it afterwards.',
      label: 'See Canva export options',
      href: '/en/directory/canva-magic',
    },
    updated: '2026-11-23',
  },

  'age-calculator': {
    metaTitle: 'Age Calculator — Exact Age in Years, Months, Days',
    metaDescription:
      'Calculate exact age from a birth date, plus days between two dates and the weekday someone was born. Handles leap years correctly. Free, no signup.',
    keyword: 'age calculator exact age',
    intro: [
      'Enter a birth date and this tool returns the exact age in years, months and days, along with the total days lived and the weekday of birth. It also calculates the difference between any two dates, which is the form the calculation usually takes in practice.',
      'Leap years are where simple age calculators break. Subtracting years and months by hand drifts by a day for anyone born around the end of February, and that one day matters on forms where the date of birth has to match a document exactly.',
    ],
    benefits: [
      { title: 'Years, months and days', desc: 'The full breakdown rather than a rounded number of years.' },
      { title: 'Leap years handled', desc: 'Feb 29 birthdays and intervals crossing a leap day are counted correctly.' },
      { title: 'Any two dates', desc: 'Not only age — also the interval between two arbitrary dates, in days and weeks.' },
    ],
    notIdealFor:
      'Legal and medical ages are defined by local rules, not by arithmetic. Whether someone is eligible on a given date, or how a gestational age is counted, follows regulation — use this for everyday questions, not as a determination.',
    cta: {
      body: 'If you need date arithmetic inside a spreadsheet or an application, a formula or a library will be reproducible and auditable. Our other browser tools cover the quick one-off cases.',
      label: 'Browse all free tools',
      href: '/en/tools',
    },
    updated: '2026-11-23',
  },

  'resume-builder': {
    metaTitle: 'Free Resume Builder — Printable, No Signup, No Watermark',
    metaDescription:
      'Build a clean, printable one-page resume in your browser and save it as a PDF file. No account, no subscription and no watermark on the result.',
    keyword: 'free resume builder no watermark',
    intro: [
      'Fill in your details and this tool lays them out as a clean, single-page resume you can print or save as a PDF from the print dialog. There is no account, no template paywall and no watermark on the result.',
      'The reason resumes end up on subscription sites is that the sites need to charge for something. Here the layout is the whole product, and it runs locally — which also means your work history, phone number and address are never sent to a server that might resell a candidate database.',
    ],
    benefits: [
      { title: 'No watermark, no paywall', desc: 'The exported PDF is your resume, not an advertisement for a subscription.' },
      { title: 'Nothing uploaded', desc: 'Personal contact details stay on your device — the usual price of a free resume builder is not paid here.' },
      { title: 'Prints correctly', desc: 'The layout is built for A4 and Letter, so the page break does not cut a line in half.' },
    ],
    notIdealFor:
      'Applicant tracking systems parse text, not layout. A visually strong resume that uses tables or columns can be read incorrectly by the software screening it, so for large employers consider a plain single-column version as well.',
    cta: {
      partner: 'Canva',
      body: 'If you want a designed resume with a visual identity — and you are applying where a human reads first — Canva has layouts that export to PDF cleanly.',
      label: 'See Canva resume templates',
      href: '/en/directory/canva-magic',
    },
    updated: '2026-11-23',
  },

  'text-to-speech': {
    metaTitle: 'Text to Speech Online — Free, Browser Voices, No Upload',
    metaDescription:
      'Convert text to speech with the voices already installed on your device. Adjust rate and pitch, play or pause. No upload, no account, no character limit.',
    keyword: 'text to speech online free',
    intro: [
      'This tool reads text aloud using the speech voices built into your browser and operating system. You choose the voice, adjust the rate and pitch, and play, pause or stop as it reads. Nothing is sent to a server.',
      'The trade-off is honest: because the voices are the ones already on your device, quality depends on your system. A modern desktop browser ships with good voices; a stripped-down system may have only one robotic one. What you get in exchange is unlimited length and complete privacy.',
    ],
    benefits: [
      { title: 'Unlimited length', desc: 'No 500-character cap and no credit system — the limit is what your browser can hold.' },
      { title: 'Rate and pitch control', desc: 'Slow it down for proofreading a draft, or speed it up to skim a long document.' },
      { title: 'Fully local', desc: 'The text is spoken by your device. Nothing is uploaded, which matters for confidential drafts.' },
    ],
    notIdealFor:
      'If you need a natural, human-sounding voice for a video, a podcast or a product demo, system voices are not close — they sound synthetic, and listeners notice within seconds. That is a job for a trained speech model, not a browser API.',
    cta: {
      partner: 'ElevenLabs',
      body: 'For narration that people will actually listen to — voiceover, audiobook, product demo — ElevenLabs generates speech that does not sound synthetic. We earn a commission if you subscribe through our link, which is stated here rather than buried.',
      label: 'See ElevenLabs pricing',
      href: '/en/directory/elevenlabs',
    },
    updated: '2026-11-23',
  },

  'url-shortener': {
    metaTitle: 'Clean URL & Link Cleaner — Strip Tracking Parameters',
    metaDescription:
      'Remove UTM, fbclid and other tracking parameters from a link and read what remains. Not a redirect service — your links keep pointing to the real destination.',
    keyword: 'remove tracking parameters from url',
    intro: [
      'Paste a link and this tool strips the tracking parameters appended to it — utm_*, fbclid, gclid, igshid and the rest — leaving the address the page actually needs. It also shows what was removed, so you can see what the sender attached to the link before they sent it.',
      'This is deliberately not a shortener. A shortener creates a new address on someone else domain, which is a redirect you cannot audit and a link that dies when that service does. Cleaning a URL gives you a shorter, readable link that still points where it says it points.',
    ],
    benefits: [
      { title: 'See what was tracking you', desc: 'The removed parameters are listed, which is more informative than the cleaned link alone.' },
      { title: 'No redirect involved', desc: 'The output is the real destination, not a hop through a shortening service.' },
      { title: 'Safe to paste anywhere', desc: 'Nothing is followed or fetched; the string is parsed in your browser.' },
    ],
    notIdealFor:
      'Do not strip parameters from links you are testing for someone else campaigns: utm_* tags are how analytics attributes a visit, and removing them breaks the report. Clean links for sharing, not for measuring.',
    cta: {
      body: 'If you need click counts on your own links, that requires a redirect service by definition — and a redirect service sees every click. Worth knowing before you pick one.',
      label: 'Browse all free tools',
      href: '/en/tools',
    },
    updated: '2026-11-23',
  },

  'bulk-studio': {
    metaTitle: 'Bulk Image Studio — Process 100 Images Offline, Free',
    metaDescription:
      'Resize, compress and convert many images at once in your browser, then download them as a ZIP. No upload, no account, no batch limit, no watermark.',
    keyword: 'bulk image converter offline',
    intro: [
      'Bulk Studio processes a whole folder of images in one pass: resize, compress or convert format, applied to every file, then packaged as a single ZIP download. There is no batch limit and no account.',
      'Batch work is where upload-based tools hurt most. Sending two hundred product photos to a server means a long upload, a queue, a download, and a copy of your catalogue sitting on someone else storage. Here the work happens on your machine — the only real limit is your own memory.',
    ],
    benefits: [
      { title: 'No batch limit', desc: 'Process the whole folder in one run instead of ten files per day.' },
      { title: 'One ZIP download', desc: 'The results come back together, named and ordered, instead of one file at a time.' },
      { title: 'Entirely offline', desc: 'No upload and no queue — a catalogue of client images never leaves the machine it is on.' },
    ],
    notIdealFor:
      'Very large batches on a modest machine will stall the browser tab while it works; there is no server to offload to. On a phone or a laptop with little memory, split the folder into smaller runs.',
    cta: {
      partner: 'Canva',
      body: 'If the batch is going into a storefront or a social template, Canva applies one layout across many images, which is often the step after resizing.',
      label: 'See Canva batch tools',
      href: '/en/directory/canva-magic',
    },
    updated: '2026-11-23',
  },
};
