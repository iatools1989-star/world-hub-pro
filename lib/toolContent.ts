export interface ToolGuide {
  title: string;
  summary: string;
  steps: { step: number; title: string; desc: string }[];
  features: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

export const TOOL_GUIDES: Record<string, ToolGuide> = {
  'qr-generator': {
    title: 'High-Density Vector QR Code Generator',
    summary: 'Generate scannable, standardized Quick Response (QR) codes for URLs, contact credentials, Wi-Fi network credentials, and plain text without sending confidential data to external tracking redirectors.',
    steps: [
      { step: 1, title: 'Choose Content Type', desc: 'Input your raw destination link, Wi-Fi WPA2 credentials, or custom plain text string.' },
      { step: 2, title: 'Configure Correction Level', desc: 'Select between Low (L), Medium (M), Quartile (Q), and High (H) Reed-Solomon error correction for dirty or damaged scanning environments.' },
      { step: 3, title: 'Instant Vector Export', desc: 'Download the rendered code in high-resolution PNG or copy the data directly into your design suite.' },
    ],
    features: [
      { title: 'Privacy Guaranteed', desc: 'No dynamic redirect bridges or third-party tracking URLs injected. Clean static QR codes.' },
      { title: 'Full Print Compatibility', desc: 'Rendered at crisp high-DPI resolution suitable for business cards, billboards, and flyers.' },
      { title: 'Offline-First Engine', desc: 'Generates using pure client-side mathematical matrices directly in browser RAM.' },
    ],
    faqs: [
      { q: 'Do these QR codes expire?', a: 'No. These are direct static QR codes. Because they do not redirect through an intermediary server, they will function forever as long as your destination link exists.' },
      { q: 'Can I use generated QR codes for commercial projects?', a: 'Yes. All codes generated on World Tools Hub are 100% royalty-free and unrestricted for commercial and personal usage.' },
      { q: 'Why is client-side QR generation safer?', a: 'Traditional QR web apps log your target links and user data in cloud databases. Our tool creates the matrix entirely within your web browser memory.' },
    ],
  },
  'password-generator': {
    title: 'Cryptographic Entropy Password Generator',
    summary: 'Produce mathematically secure, uncrackable passwords using the browser native Web Cryptography API (crypto.getRandomValues). Resistant to dictionary attacks, brute-force clusters, and rainbow tables.',
    steps: [
      { step: 1, title: 'Select Password Length', desc: 'Choose between 8 and 64 characters depending on your service security requirements (16+ recommended).' },
      { step: 2, title: 'Toggle Character Sets', desc: 'Enable or disable uppercase letters, lowercase letters, numbers, and high-entropy symbols.' },
      { step: 3, title: 'One-Click Secure Copy', desc: 'Click Copy to clipboard with instant clipboard clearing to prevent accidental leaks.' },
    ],
    features: [
      { title: 'True CSPRNG Randomness', desc: 'Uses hardware-backed cryptographic seeds via window.crypto.getRandomValues.' },
      { title: 'Zero Telemetry', desc: 'Passwords never touch any network socket, cookie, analytics packet, or external server.' },
      { title: 'Entropy Meter', desc: 'Calculates real-time Shannon entropy bits so you know the exact strength of your credentials.' },
    ],
    faqs: [
      { q: 'How does this compare to standard Math.random()?', a: 'Math.random() is pseudo-random and predictable. We use window.crypto, which relies on cryptographic hardware entropy from your CPU.' },
      { q: 'Does World Tools Hub store my generated passwords?', a: 'Never. The code runs 100% in your local browser sandbox. Once you close the tab, all memory is destroyed.' },
      { q: 'What is the recommended password length for financial accounts?', a: 'Cybersecurity standards recommend a minimum of 16 to 20 alphanumeric characters with symbols for banking and critical services.' },
    ],
  },
  'word-counter': {
    title: 'Professional Word, Character & Readability Counter',
    summary: 'Analyze text metrics in real time. Inspect word counts, character frequencies, reading times, speaking times, and paragraph distribution without sending manuscripts to cloud servers.',
    steps: [
      { step: 1, title: 'Paste or Type Content', desc: 'Insert your essay, blog article, social media post, or book chapter into the editor.' },
      { step: 2, title: 'Monitor Live Statistics', desc: 'Instant calculation of words, characters (with and without spaces), reading time, and speaking time.' },
      { step: 3, title: 'Format & Clean', desc: 'Clean up trailing spaces, remove unnecessary breaks, or copy normalized text with one click.' },
    ],
    features: [
      { title: 'Instant Calculations', desc: 'Zero debounce latency; counts are computed as you type with optimized regex algorithms.' },
      { title: 'Reading & Speech Estimator', desc: 'Based on global scientific standards (225 words per minute for reading, 130 wpm for speech).' },
      { title: 'Social Platform Length Bars', desc: 'Verify limits for X (Twitter), LinkedIn, Meta descriptions, and Instagram captions.' },
    ],
    faqs: [
      { q: 'Is there a character limit on the text I can analyze?', a: 'No. You can paste entire book chapters (over 100,000 words) without performance degradation.' },
      { q: 'Are my unpublished articles or sensitive texts saved?', a: 'No. Nothing is saved or transmitted. Your draft remains exclusively inside your browser DOM memory.' },
      { q: 'How is reading time calculated?', a: 'We use the international standard benchmark of 200–250 words per minute for adult silent reading comprehension.' },
    ],
  },
  'unit-converter': {
    title: 'Precision Multi-Unit Converter',
    summary: 'Accurately convert between metric and imperial systems across length, mass, surface area, and temperature using verified international scientific constants.',
    steps: [
      { step: 1, title: 'Select Measurement Category', desc: 'Pick Length, Mass, Area, or Temperature from the category selector.' },
      { step: 2, title: 'Specify Units & Value', desc: 'Input the original quantity and select the target conversion unit.' },
      { step: 3, title: 'Copy Precise Output', desc: 'Obtain formatted scientific results rounded to your preferred decimal precision.' },
    ],
    features: [
      { title: 'Scientific Precision', desc: 'Adheres to NIST and International System of Units (SI) dimensional definitions.' },
      { title: 'Bi-Directional Calculation', desc: 'Swap from and to units seamlessly with real-time recalculation.' },
      { title: 'Lightweight & Instant', desc: 'Pure mathematical formulas executed locally with zero network requests.' },
    ],
    faqs: [
      { q: 'Are Celsius to Fahrenheit conversions exact?', a: 'Yes. We apply the exact thermodynamic formula (°C × 9/5) + 32 without intermediate floating-point rounding errors.' },
      { q: 'Can I convert large engineering values?', a: 'Yes, calculations support standard IEEE 754 double-precision floating-point numbers.' },
    ],
  },
  'color-picker': {
    title: 'Color Palette Inspector & Color Code Converter',
    summary: 'Inspect, convert, and harmonize digital colors across HEX, RGB, HSL, and HSV color spaces. Includes live contrast checking and complimentary palette suggestions for web designers.',
    steps: [
      { step: 1, title: 'Pick or Enter Color', desc: 'Use the visual spectrum picker or input an exact HEX/RGB/HSL string.' },
      { step: 2, title: 'Inspect Multi-Format Codes', desc: 'View synchronized color definitions in HEX, RGB, HSL, and CSS variables.' },
      { step: 3, title: 'Copy CSS Variables', desc: 'Copy ready-to-paste CSS code directly into your stylesheet or Figma project.' },
    ],
    features: [
      { title: 'Color Harmony Engine', desc: 'Calculates monochromatic, analogous, and complementary color schemes.' },
      { title: 'WCAG Contrast Guidance', desc: 'Displays readable contrast ratios against white and dark backgrounds.' },
      { title: 'Zero Latency', desc: 'Native canvas and mathematical color-space matrices running locally.' },
    ],
    faqs: [
      { q: 'Which color formats are supported?', a: 'HEX, RGB, RGBA, HSL, and HSLA formats commonly used in CSS and web development.' },
      { q: 'Does this tool work on mobile devices?', a: 'Yes, full touch support for color sliders and native color pickers on iOS and Android.' },
    ],
  },
  'pdf-to-jpg': {
    title: 'Client-Side PDF to High-Definition JPG Converter',
    summary: 'Extract and convert PDF document pages into high-fidelity JPG or PNG images. Entirely processed inside your browser sandbox using modern WebAssembly rendering.',
    steps: [
      { step: 1, title: 'Upload PDF Document', desc: 'Drag and drop your PDF file into the dropzone.' },
      { step: 2, title: 'Preview Rendered Pages', desc: 'Inspect each page rendered in real time at high DPI resolution.' },
      { step: 3, title: 'Download Images', desc: 'Download individual page images or package all pages with one click.' },
    ],
    features: [
      { title: 'Zero Server Uploads', desc: 'Confidential invoices, bank statements, and IDs never leave your computer.' },
      { title: 'Vector Crispness', desc: 'High DPI canvas rasterization maintains sharp typography and crisp vector graphics.' },
      { title: 'Unlimited Pages', desc: 'No daily file conversion limits, subscriptions, or credit restrictions.' },
    ],
    faqs: [
      { q: 'Is it safe to convert bank statements or contracts?', a: 'Yes. Since the PDF rendering is executed by your local browser via WebAssembly, our servers never see or hold your document.' },
      { q: 'What resolution are the images saved at?', a: 'Pages are rasterized at up to 2.0x scale factor (approximately 150 to 200 DPI) for optimal balance of sharpness and file size.' },
    ],
  },
  'jpg-to-pdf': {
    title: 'Multiple Image to PDF Document Compiler',
    summary: 'Compile multiple JPG, PNG, and WebP images into a single professional PDF document. Reorder pages, adjust margins, and export cleanly formatted PDF packages.',
    steps: [
      { step: 1, title: 'Select Images', desc: 'Upload one or multiple image files (JPG, PNG, WebP).' },
      { step: 2, title: 'Arrange Page Sequence', desc: 'Reorder images using drag-and-drop or page controls.' },
      { step: 3, title: 'Generate PDF', desc: 'Compile your document into a single download without quality loss.' },
    ],
    features: [
      { title: 'Universal Image Support', desc: 'Accepts JPEG, PNG, GIF, and modern WebP image assets.' },
      { title: 'Custom Orientation', desc: 'Supports portrait, landscape, and automatic page matching.' },
      { title: 'High Fidelity', desc: 'Preserves original photographic resolution without destructive compression.' },
    ],
    faqs: [
      { q: 'Can I add multiple photos at once?', a: 'Yes, select multiple images in the file browser or drag them into the upload zone together.' },
      { q: 'Does this tool add watermarks?', a: 'No. World Tools Hub never stamps watermarks, logos, or advertising on your documents.' },
    ],
  },
  'compress-pdf': {
    title: 'Client-Side PDF Size Optimizer & Compressor',
    summary: 'Reduce PDF file sizes dramatically while preserving readability. Choose between Light, Recommended, and Maximum compression modes to meet email and upload limits.',
    steps: [
      { step: 1, title: 'Load PDF File', desc: 'Select any heavy PDF document from your local storage.' },
      { step: 2, title: 'Select Compression Level', desc: 'Choose Light (85%), Recommended (70%), or Maximum (50%) optimization.' },
      { step: 3, title: 'Download Compressed File', desc: 'Instantly download your optimized PDF with a real-time size reduction report.' },
    ],
    features: [
      { title: '3 Adaptive Profiles', desc: 'Balance visual clarity and byte reduction according to your specific needs.' },
      { title: 'Visual Savings Gauge', desc: 'View original size, compressed size, and exact percentage saved.' },
      { title: '100% Private', desc: 'Heavy corporate PDFs are compressed in local browser memory without cloud processing.' },
    ],
    faqs: [
      { q: 'Will my PDF lose searchable text?', a: 'In standard compression mode, typography and vector elements remain sharp and readable.' },
      { q: 'What is the file size limit?', a: 'You can process documents up to 100MB directly in browser memory depending on your computer RAM.' },
    ],
  },
  'merge-pdf': {
    title: 'Interactive Multi-Document PDF Merger',
    summary: 'Combine multiple PDF files into one structured document in seconds. Organize page sequences with interactive reordering and instant client-side stitching.',
    steps: [
      { step: 1, title: 'Add Multiple PDFs', desc: 'Select or drag two or more PDF files into the tool.' },
      { step: 2, title: 'Order Document Sequence', desc: 'Use Up/Down controls to arrange the exact page order.' },
      { step: 3, title: 'Merge & Download', desc: 'Click Merge to generate and download the unified PDF file immediately.' },
    ],
    features: [
      { title: 'Fast Engine (pdf-lib)', desc: 'Stitches PDF byte trees in browser memory with zero server roundtrips.' },
      { title: 'Interactive Sorting', desc: 'Full control over file order before building the final document.' },
      { title: 'No Page Limit', desc: 'Merge presentations, contracts, and receipts into one clean file.' },
    ],
    faqs: [
      { q: 'Is there a limit on how many PDFs I can merge?', a: 'You can merge dozens of files simultaneously depending on your available device memory.' },
      { q: 'Does merging change the original files on my disk?', a: 'No, your original files remain untouched; a newly merged file is generated in browser memory.' },
    ],
  },
  'image-compressor': {
    title: 'Smart Lossless & Lossy Image Compressor',
    summary: 'Shrink JPG, PNG, and WebP image sizes by up to 80% without visible quality degradation. Features live side-by-side comparison and instant download.',
    steps: [
      { step: 1, title: 'Upload Your Image', desc: 'Drag in any photo, screenshot, or graphic file.' },
      { step: 2, title: 'Adjust Quality Slider', desc: 'Fine-tune compression ratio between 10% and 100% with live previews.' },
      { step: 3, title: 'Save Optimized Image', desc: 'Download the compressed file with real-time byte savings data.' },
    ],
    features: [
      { title: 'Canvas 2D Recompression', desc: 'Leverages browser-native bicubic resampling and JPEG/WebP encoders.' },
      { title: 'Side-by-Side Comparison', desc: 'Inspect original vs compressed image before committing to download.' },
      { title: 'WebP Conversion', desc: 'Easily export modern WebP format for superior website performance.' },
    ],
    faqs: [
      { q: 'Why compress images before publishing online?', a: 'Compressed images load up to 5x faster, improving Google Core Web Vitals and SEO rankings.' },
      { q: 'Can I compress transparent PNGs?', a: 'Yes, alpha transparency is fully preserved during compression.' },
    ],
  },
  'remove-bg': {
    title: 'Client-Side Transparent Background Remover',
    summary: 'Isolate subjects and eliminate backgrounds from images using client-side edge and color tolerance analysis. Export clean transparent PNGs without cloud costs.',
    steps: [
      { step: 1, title: 'Select Subject Image', desc: 'Upload a portrait, product shot, or logo with a solid or high-contrast background.' },
      { step: 2, title: 'Tune Tolerance & Feathering', desc: 'Adjust color tolerance and edge feathering to achieve clean contours.' },
      { step: 3, title: 'Export PNG with Alpha', desc: 'Download high-resolution transparent PNG or apply a custom background color.' },
    ],
    features: [
      { title: 'Four-Corner Sampling', desc: 'Automatically detects background dominant chroma from image borders.' },
      { title: 'Color Tolerance Controls', desc: 'Fine-tune threshold sensitivity to avoid clipping foreground elements.' },
      { title: 'No Subscription Fees', desc: 'Free forever without account credits or paywalls.' },
    ],
    faqs: [
      { q: 'Which images produce the best results?', a: 'Images with high contrast between subject and background (such as studio product photos and logos) yield the sharpest cutouts.' },
      { q: 'Are my private photos uploaded to AI servers?', a: 'No. The pixel sampling and alpha mask operations run purely within your browser HTML5 canvas.' },
    ],
  },
  'age-calculator': {
    title: 'Chronological Age & Milestone Date Calculator',
    summary: 'Calculate exact age in years, months, days, hours, and minutes. Includes upcoming birthday countdowns, birth weekday identification, and life milestone metrics.',
    steps: [
      { step: 1, title: 'Enter Date of Birth', desc: 'Select your birth day, month, and year from the interactive picker.' },
      { step: 2, title: 'Review Chronological Metrics', desc: 'Inspect precise elapsed years, months, days, and total lifetime days.' },
      { step: 3, title: 'Milestones & Countdown', desc: 'View days remaining until your next birthday and day of the week you were born.' },
    ],
    features: [
      { title: 'Leap Year Precision', desc: 'Accounts for Gregorian leap years and variable month lengths accurately.' },
      { title: 'Cumulative Time Breakdown', desc: 'Calculates total accumulated weeks, hours, and minutes lived.' },
      { title: 'Next Birthday Countdown', desc: 'Real-time countdown and annual progress percentage tracker.' },
    ],
    faqs: [
      { q: 'Does this calculator factor in leap years?', a: 'Yes, all calculations strictly observe 366-day leap years and precise calendar arithmetic.' },
      { q: 'Can I calculate the age of a historical event or company?', a: 'Yes, simply input the founding or start date to calculate total elapsed time.' },
    ],
  },
  'text-to-speech': {
    title: 'Natural Browser-Native Text to Speech (TTS)',
    summary: 'Synthesize spoken audio from plain text using your operating system and browser native Web Speech API. Customize pitch, speaking rate, and voice accents.',
    steps: [
      { step: 1, title: 'Input Text Passage', desc: 'Paste or type any article, script, or dialogue passage.' },
      { step: 2, title: 'Select Voice & Accent', desc: 'Choose from your system available high-quality voices across multiple languages.' },
      { step: 3, title: 'Play & Adjust Controls', desc: 'Control playback speed, pitch, and use play/pause/stop buttons in real time.' },
    ],
    features: [
      { title: '100% Free & Unlimited', desc: 'No monthly character quotas, API keys, or credit limits.' },
      { title: 'System-Grade Voices', desc: 'Utilizes neural and standard speech engines installed on Windows, macOS, Android, and iOS.' },
      { title: 'Offline Capable', desc: 'Synthesizes speech locally without transferring text over internet networks.' },
    ],
    faqs: [
      { q: 'Where do the available voices come from?', a: 'They are provided directly by your operating system and browser via the standard W3C Web Speech API.' },
      { q: 'Is there a limit on how much text can be read?', a: 'No, you can read entire articles and documents without incurring character charges.' },
    ],
  },
  'url-shortener': {
    title: 'URL Tracking Cleaner & Privacy Link Formatter',
    summary: 'Strip invasive analytics tracking parameters (UTM tags, fbclid, gclid, tracking tokens) from long URLs. Generate clean, privacy-preserving links for sharing.',
    steps: [
      { step: 1, title: 'Paste Cluttered Link', desc: 'Paste URLs containing tracking junk, UTM tags, or referral parameters.' },
      { step: 2, title: 'One-Click Clean', desc: 'Our algorithmic filter strips away tracking tokens while preserving genuine page parameters.' },
      { step: 3, title: 'Copy Clean URL', desc: 'Copy the lightweight link for sharing in messages, emails, or social media.' },
    ],
    features: [
      { title: 'Removes Tracking Bloat', desc: 'Strips utm_source, utm_medium, fbclid, gclid, msclkid, and over 30 common trackers.' },
      { title: 'Direct Link Integrity', desc: 'Preserves critical query strings required for website navigation.' },
      { title: 'No Redirect Servers', desc: 'Provides the actual destination URL without relying on vulnerable URL shortener redirects.' },
    ],
    faqs: [
      { q: 'Why should I clean tracking parameters?', a: 'Tracking parameters expose your browsing identity, inflate URL length, and can cause links to break on certain platforms.' },
      { q: 'Does this shorten the actual domain?', a: 'It purges redundant URL query bloat to produce the shortest possible authentic canonical address.' },
    ],
  },
  'resume-builder': {
    title: 'ATS-Friendly Quick Resume & CV Builder',
    summary: 'Build clean, professional resumes optimized for Applicant Tracking Systems (ATS). Features standard typography, structured sections, and instant A4 PDF export.',
    steps: [
      { step: 1, title: 'Enter Personal Details', desc: 'Fill in your name, professional title, contact information, and location.' },
      { step: 2, title: 'Add Experience & Education', desc: 'Add structured roles, degrees, key achievements, and technical skill tags.' },
      { step: 3, title: 'Download Clean PDF', desc: 'Use the Print/PDF button to generate an ATS-ready document formatted for A4 standard.' },
    ],
    features: [
      { title: 'ATS Scanner Optimized', desc: 'Clean semantic structure with standard headings that automated HR parsers read effortlessly.' },
      { title: 'Zero Data Retention', desc: 'Your confidential career history is stored in local browser memory and never uploaded.' },
      { title: 'Standard A4 Print CSS', desc: 'Engineered print stylesheets eliminate margins, headers, and UI elements on export.' },
    ],
    faqs: [
      { q: 'Will this resume pass automated ATS filters?', a: 'Yes. It avoids complex tables, multi-column graphics, and icons that confuse parsing algorithms.' },
      { q: 'Is this resume builder free?', a: '100% free with unlimited exports and zero watermarks.' },
    ],
  },
};
