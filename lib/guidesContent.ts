/**
 * Guias editoriais (/en/guides).
 *
 * REGRAS (as mesmas do diretorio):
 * 1. Nada de promessa de resultado. "Economize 10h por semana" nao entra.
 * 2. Nenhum fato de mercado apresentado como verdade absoluta sem data.
 * 3. Onde o leitor pode se dar mal, o guia diz.
 * 4. Sem affiliate ID em lugar nenhum: os links levam ao diretorio, e o
 *    diretorio diz que nao ganhamos nada no clique.
 *
 * Origem: os tres guias nasceram dos artigos de comissoes-global/artigos
 * (how-to-choose 504 palavras, first-email-tool 534, how-commissions-work 569),
 * reescritos e ampliados. best-budget-headphones e starter-kit foram
 * descartados no plano de fusao: eram de varejo e de "kit de iniciante",
 * categorias que o site nao cobre.
 */

export interface GuideSection {
  h: string;
  p: string[];
  list?: string[];
  /** caixa de destaque: a coisa que o leitor mais precisa lembrar */
  callout?: string;
}

export interface Guide {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keyword: string;
  updated: string;
  readingMinutes: number;
  intro: string[];
  sections: GuideSection[];
  /** o que este guia NAO promete */
  limitations: string[];
  related: { name: string; href: string; why: string }[];
  faqs: { q: string; a: string }[];
}

export const GUIDES: Record<string, Guide> = {
  'how-to-choose-a-tool': {
    slug: 'how-to-choose-a-tool',
    title: 'How to choose a paid tool without getting burned',
    metaTitle: 'How to Choose a Tool Without Getting Burned: 7 Questions',
    metaDescription:
      'Seven questions to ask before paying for any software or product, from someone who lists tools for a living. Three minutes that prevent most buyer regret.',
    keyword: 'how to choose software tool',
    updated: '2026-11-10',
    readingMinutes: 7,
    intro: [
      'A recommendation is not a guarantee. Every page on this site that recommends something is written by a person who could be wrong, and every vendor page is written by a company that has never once mentioned a downside in its own copy.',
      'These are the seven questions we run through before a tool earns a place in our directory, and the same ones worth running before you pay for anything. It takes about three minutes. It prevents most of the regret you would otherwise discover on the twelfth of the month, when the renewal charge lands.',
    ],
    sections: [
      {
        h: '1. Do I have a problem this solves, or a problem I hope it solves?',
        p: [
          'This is where most purchases go wrong. When the honest reason is "it is cheap" or "everyone at work has one", the subscription gets used twice and then becomes a line item nobody questions because cancelling would mean admitting the mistake.',
          'The test that works: describe the thing you cannot currently do, in one sentence, with a verb. "I cannot turn a client brief into a first draft in under an hour" is a problem a tool can solve. "I should probably be using AI more" is a mood. Tools do not fix moods.',
        ],
        callout:
          'If you cannot finish the sentence "right now, without this tool, I cannot ___", you are browsing, not buying.',
      },
      {
        h: '2. Is the price actually good, or just presented as good?',
        p: [
          'A discount off an inflated anchor is not a discount. Vendors list "$99/mo crossed out, now $49/mo" for years at a time. The crossed-out number exists to make the real number feel like a decision you are winning.',
          'Two things to check. First, the annual price: most SaaS is 20% cheaper billed yearly, which means the monthly price is the expensive one and is priced that way on purpose. Second, the price after the intro period. "First 3 months 50% off" is common and legitimate — but you should know the month-4 number before you sign, not after.',
        ],
      },
      {
        h: '3. Who is selling it, and what happens when I want out?',
        p: [
          'For software, the question is cancellation, not returns. Find the cancellation path before you subscribe — is it a button in the dashboard, or an email to support that takes three days? Search "[tool name] cancel subscription" and read the complaints. If the top results are people describing a process, that is the process.',
          'For physical products, check the seller name and how long they have been trading, and read the returns page specifically. A shop that does not explain returns clearly is already telling you something. Keep the packaging until you are sure.',
        ],
        callout:
          'Before paying, take a screenshot of the pricing page with the date visible. When a refund argument starts, that screenshot is worth more than your memory of it.',
      },
      {
        h: '4. Do the reviews describe use, or only describe delivery?',
        p: [
          '"Arrived fast" says nothing about the product. Neither does "great value" on its own. What you are looking for is someone describing a specific moment of use, weeks later, including a small annoyance — the annoyance is what makes the review credible.',
          'A wall of five-star reviews with no negatives is a signal in itself, especially on marketplaces. Real products have real friction, and the reviews that mention it are the ones that tell you whether the friction is tolerable for your case.',
        ],
      },
      {
        h: '5. What does it cost to keep, beyond the subscription?',
        p: [
          'Software has hidden costs that do not appear on the pricing page:',
        ],
        list: [
          'Seats — most "team" plans are per person, and the price quoted on the homepage is often for one.',
          'Usage — AI tools bill in credits, characters or GPU hours, and a plan that looks generous at demo volume can run out in a real week.',
          'The second tool — a design tool often implies a stock-asset subscription; a video generator implies an editor.',
          'Your time — a tool that saves an hour a week but needs two hours of setup a month is not saving you anything.',
          'Leaving — exporting your data. If export is a paid feature, your exit has a price.',
        ],
      },
      {
        h: '6. Is there a free tier that covers the real volume?',
        p: [
          'Not "is there a free tier" — vendors put one there to get you in. The question is whether the free tier covers the volume you will actually use in a normal month, not the volume in a demo video.',
          'Free tiers are usually limited along one specific axis: exports per month, characters of speech, projects, or a watermark. Find which axis is limited, convert it to your usage, and you have your answer in one minute. If it covers you, do not pay — a paid plan you do not need is not "investing in yourself".',
        ],
      },
      {
        h: '7. Would I still want this in 24 hours?',
        p: [
          'Leave it. Countdown timers and "only 2 left" are legitimate sales tools and they are not a reason to decide today. Almost nothing that matters about your work will be different tomorrow, and the price will almost certainly be the same or lower.',
          'The exception is genuine time-boxed launches with a real deadline — but if a launch discount matters to your decision, the tool was not solving a problem you had.',
        ],
      },
      {
        h: 'How we apply these seven questions here',
        p: [
          'Every entry in our directory carries the same structure: what the tool does, what it costs on each tier with the date we checked, what it is good at, what it is not, who should not buy it, and what to look at instead. The "do not buy it if" section is not decoration — it is question one, answered for you.',
          'We do not test these products hands-on, and we say so on the pages. What we do is read what the vendors publish, compare it with what independent trackers found, and flag where the two disagree. That is a different product from a lab review, and pretending otherwise would be the exact thing this guide warns you about.',
        ],
        callout:
          'No affiliate ID is attached to any link on this site today. We earn nothing from your clicks. When that changes, the pages will say so at the top, not in a footer.',
      },
    ],
    limitations: [
      'These questions will not tell you which specific tool is best — they tell you how to decide, and when not to.',
      'The price guidance is general: vendors change packaging constantly, and we cannot verify a price you see today.',
      'We do not test products hands-on, so nothing here is a lab result.',
    ],
    related: [
      { name: 'The directory', href: '/en/directory', why: 'Each entry answers these seven questions for one tool, with prices checked in November 2026.' },
      { name: 'How affiliate commissions work', href: '/en/guides/how-affiliate-commissions-work', why: 'Why a site that recommends things might not be doing it for free, and how to check.' },
      { name: 'Free tools', href: '/en/tools', why: 'Sixteen utilities that answer "do I need to pay for this at all?" with "no".' },
    ],
    faqs: [
      { q: 'What is the single most useful question?', a: 'The first one. Most regretted purchases fail at "do I have a real problem this solves", and no amount of price research fixes a purchase made for the wrong reason.' },
      { q: 'Are annual plans always better value?', a: 'Cheaper per month, yes — usually about 20%. Better value only if you keep the tool past the first month. If you are unsure, pay monthly once and treat the difference as the price of finding out.' },
      { q: 'How do I check a free tier quickly?', a: 'Find the one axis it limits — exports, characters, projects, seats — and convert that limit into your real weekly usage. Ignore the rest of the feature list.' },
      { q: 'Do you get paid when I click a link here?', a: 'No. There is no affiliate ID in any link on this site today. If that changes, every page will say so before the first link, not in a footer.' },
      { q: 'What if a tool I already pay for fails these questions?', a: 'Work out what you would miss, cancel for one month, and see. If nothing breaks, that is your answer; if something does, you have just found the real reason you were paying.' },
    ],
  },
  'first-email-tool': {
    slug: 'first-email-tool',
    title: 'How to pick your first email tool without overpaying',
    metaTitle: 'First Email Tool: 6 Questions Before You Subscribe',
    metaDescription:
      'Most people buy an email platform months before they need one, then pay for features they never open. Six questions to answer before the subscription.',
    keyword: 'first email marketing tool',
    updated: '2026-11-10',
    readingMinutes: 8,
    intro: [
      'Most people buy an email platform months before they have anyone to email, then spend the next year paying for automation, segmentation and A/B testing they have never opened. The bill is small enough not to hurt and large enough to matter after twelve months.',
      'These are the six questions worth answering before you pick a provider. They are written from the perspective of someone sending a newsletter or a product update, not running enterprise lifecycle marketing — that is a different problem with a different answer.',
    ],
    sections: [
      {
        h: '1. Do you have anyone to email?',
        p: [
          'An email tool is not a list-building tool. If you have no subscribers, the most useful next step is a single signup form and one page worth subscribing to — not a $29/month platform with an empty contact list.',
          'The honest threshold: until you have roughly a hundred people who would notice if you stopped sending, you do not have an email programme, you have a hypothesis. Free tiers exist precisely for that stage, and staying on one is not amateurish.',
        ],
        callout:
          'Paying for email software does not create an audience. It only makes an existing audience cheaper to talk to.',
      },
      {
        h: '2. Which limit binds first: contacts or sends?',
        p: [
          'This is the question almost nobody checks, and it is the one that decides whether a free tier lasts a month or a year. Some plans are free for 500 contacts but cap you at 1,000 sends a month — fine for a weekly newsletter to 200 people, useless for a daily one.',
          'Convert both limits to your real rhythm. If you send weekly to 300 people, you need about 1,300 sends a month: a plan free for 500 contacts with a 1,000-send cap will lock you out while your list is still small. The same plan with a 12,000-send cap will not.',
        ],
      },
      {
        h: '3. Can you export everything, and is export a paid feature?',
        p: [
          'Export must include contacts, tags and the suppression list — the people who unsubscribed or bounced. Exporting the contacts without the suppression list is how you accidentally email people who asked you not to, which is both a deliverability problem and, under GDPR and LGPD, a compliance one.',
          'Check this before you import a single contact. Some providers make export a higher-tier feature, which means your exit has a price attached that is not on the pricing page.',
        ],
      },
      {
        h: '4. Who handles the domain setup?',
        p: [
          'Deliverability depends far more on your domain configuration than on the brand of the tool. You will need SPF, DKIM and DMARC records on your domain, and a sending subdomain is worth the ten minutes it takes.',
          'What you are checking is documentation quality: does the provider explain this in a page you can follow without a support ticket? A provider that leaves authentication vague will leave you guessing why half your list never sees your emails — and "it went to spam" is usually a setup problem, not a conspiracy.',
        ],
        callout:
          'Never send your first campaign from a brand-new domain to your whole list. Send to ten people first, and check where it lands.',
      },
      {
        h: '5. What does "automation" actually include?',
        p: [
          'On a pricing page, "automation" covers everything from a single welcome email to branching workflows with delays and conditions. Between those two things sit most of the money.',
          'Write down the one automation you actually need — for most people it is a welcome sequence of two or three emails — then check whether the plan includes it. Do not pay for branching workflow builders to send a welcome email.',
        ],
      },
      {
        h: '6. What is the price in month thirteen?',
        p: [
          'Introductory pricing is standard in this category: cheap for three or six months, then the real price. Find the month-thirteen number, and divide it by the number of contacts you expect to have then. That number — cost per contact per month — is the only fair comparison between providers.',
          'Also check what happens as the list grows. Most plans are priced in contact tiers, so a provider that is cheap at 500 contacts can be expensive at 5,000, and a provider that looked premium at the start can be the cheaper one a year later.',
        ],
      },
      {
        h: 'The comparison that takes ten minutes',
        p: [
          'Put three providers side by side on exactly these six lines. Not on feature lists — on these lines. The winner is usually obvious once the grid is filled, and it is rarely the one with the most check marks.',
        ],
        list: [
          'Free tier: how many contacts AND how many sends per month',
          'Export: available, and on which plan',
          'Domain authentication: documented clearly, yes or no',
          'Automation: does the plan include your one needed automation',
          'Price at month 13, and the contact tier it covers',
          'Not for: the case where this provider is the wrong choice',
        ],
      },
      {
        h: 'When you should not buy an email tool at all',
        p: [
          'If you are still deciding what to write about, have fewer than a hundred subscribers, or send less than once a month, a free plan is not a compromise — it is the correct answer. Paying early does not make you more serious about the work; it just makes it more expensive to stop.',
          'And if your real problem is that nobody visits your site, an email tool will not fix it. Newsletters amplify an audience you already have; they do not create one.',
        ],
      },
    ],
    limitations: [
      'This guide does not name a "best" provider. The right one depends on which of the six limits binds for you first, and that changes as you grow.',
      'Deliverability outcomes depend on your domain reputation and list hygiene, which no provider can guarantee.',
      'Prices and free-tier limits in this category change often — verify on the provider\'s own pricing page.',
    ],
    related: [
      { name: 'How to choose a tool without getting burned', href: '/en/guides/how-to-choose-a-tool', why: 'The seven general questions, of which these six are the email-specific half.' },
      { name: 'Copy.ai pricing and limits', href: '/en/directory/copy-ai', why: 'If the actual bottleneck is writing the emails rather than sending them.' },
      { name: 'Word counter', href: '/en/tools/word-counter', why: 'Newsletter length is a decision. Check it in the browser, no account needed.' },
    ],
    faqs: [
      { q: 'How many subscribers do I need before paying?', a: 'Roughly a hundred engaged people. Below that, a free tier covers you and the paid features go unused. The number is a proxy for "do I have something worth sending".' },
      { q: 'Is a free plan bad for deliverability?', a: 'No. Deliverability depends on your domain authentication and list hygiene. A free plan sending from a properly authenticated domain will land better than a paid plan sending from an unconfigured one.' },
      { q: 'Contacts or sends — which limit matters more?', a: 'Whichever you hit first. For a weekly newsletter to a small list, the send cap binds first; for a large list with occasional sends, the contact cap does.' },
      { q: 'Can I move providers later?', a: 'Only if export includes contacts, tags and the suppression list, and only if export is not a paid feature. Check both before importing anyone.' },
      { q: 'Do I need SPF, DKIM and DMARC?', a: 'Yes, all three, on your own domain. They are DNS records, they take about ten minutes, and their absence is the most common reason a legitimate newsletter lands in spam.' },
    ],
  },

  'how-affiliate-commissions-work': {
    slug: 'how-affiliate-commissions-work',
    title: 'How affiliate commissions actually work',
    metaTitle: 'How Affiliate Commissions Work (And How To Spot a Bad Site)',
    metaDescription:
      'Where the money comes from, who pays it, why your price never changes, and how to tell an honest recommendation from a paid ranking. No jargon.',
    keyword: 'how affiliate commissions work',
    updated: '2026-11-10',
    readingMinutes: 7,
    intro: [
      'A site recommends a tool. You click, you buy, the site earns a percentage. The mechanics are simple, and that simplicity is exactly why the practice deserves a plain explanation — and why a site that hides it should worry you.',
      'This page explains where the money comes from, who pays it, why your price does not change, and what the conflict of interest actually looks like. It is also, unavoidably, a page about us: we list tools and we will eventually earn from some of them.',
    ],
    sections: [
      {
        h: 'What happens when you click',
        p: [
          'An affiliate link is an ordinary URL with an identifier attached to it. The store records that you arrived from a particular publisher, usually by setting a cookie, and if you buy something within a set window, it credits that publisher.',
          'Nothing about the purchase changes. The price is the same, the product is the same, the returns policy is the same. The commission comes out of the seller\'s marketing budget — the budget that would otherwise pay for ads — not out of your cart.',
        ],
        callout:
          'If a site ever shows you a different, higher price through its affiliate link, that is not affiliate marketing. That is a scam, and you should leave.',
      },
      {
        h: 'Why the percentages vary so much',
        p: [
          'Commission rates follow margin, not quality. Digital products — courses, ebooks, software — pay high rates, often 30% to 75%, because there is no inventory and no shipping and the marginal cost of one more customer is close to zero. Physical retail pays low rates, commonly 1% to 16% depending on category, because the margin is thin and the catalogue is enormous.',
          'The practical consequence: a site that only reviews high-commission digital products is not necessarily dishonest, but its incentives are worth knowing. A $500 course at 50% pays more per sale than fifty $20 headphones at 4%.',
        ],
      },
      {
        h: 'Recurring versus one-time, and why it matters to what you read',
        p: [
          'Software often pays a recurring percentage for as long as the customer stays. That is a much better business for the publisher than a one-time payment, and it creates a specific bias: a site may prefer the tool with the recurring plan over the one with a one-time licence, even if the second is better for you.',
          'This is why a recommendation is more trustworthy when the page states the commission rate openly and shows a case where the recommended tool is the wrong purchase. Both are cheap to do and both are hard to fake consistently.',
        ],
      },
      {
        h: 'The tracking window, and why a sale can vanish',
        p: [
          'Between your click and the purchase there is a tracking window — commonly 30 to 90 days, occasionally longer for digital products. If you buy after it expires, the publisher is not credited. If you click a different publisher\'s link in between, the last click usually wins.',
          'After the sale there is validation. A commission that appears in a dashboard is not money: it is confirmed only after the order ships and the return window closes. Refunded orders remove the commission. This is why anyone promising "instant earnings" is describing something that does not exist at the retailer they are promoting.',
        ],
      },
      {
        h: 'The conflict of interest is real, and should be visible',
        p: [
          'If the person recommending earns per sale, there is an incentive to promote the highest-paying option instead of the best-fitting one. Pretending otherwise is the dishonest part of this industry, not the commission itself.',
          'The honest response is not to refuse commissions — it is disclosure plus discipline: say there is a commission, publish the criteria for selection, and say clearly when a product is the wrong choice. A page that does all three is worth reading. A page that promises income, hides the relationship, or publishes a "top 10" without explaining the ordering is not.',
        ],
        callout:
          'The strongest signal of an honest recommendation page is a section explaining who should NOT buy the thing. It costs the publisher money to write it, which is exactly why it is credible.',
      },
      {
        h: 'What disclosure actually requires',
        p: [
          'In the United States the FTC requires a clear and conspicuous disclosure, before the link, in language a normal person understands. "As an Amazon Associate I earn from qualifying purchases" is the phrasing Amazon requires; `#ad` is the shorthand most platforms accept. The United Kingdom\'s ASA is similarly strict about `#ad` appearing at the start of a caption rather than buried.',
          'A footer link, a separate "disclosure" page, or a vague "#partner" does not satisfy either. The test is whether someone who reads only the first two lines knows that money is involved.',
        ],
      },
      {
        h: 'How this site does it',
        p: [
          'Here is our position, stated plainly:',
        ],
        list: [
          'No affiliate ID is attached to any link on this site today. We earn nothing from your clicks. That is a fact about now, not a promise about later.',
          'When IDs exist, the affected pages will show `#ad` before the link and the click will carry `rel="sponsored"`. The page will say it, not just the footer.',
          'We do not sell placements, rankings or "featured" spots. If we ever do, this page changes before the sale does.',
          'We do not test these products hands-on, and we say so. What we do is read what vendors publish, compare it against independent trackers, and flag where they disagree.',
          'Every directory page carries a date stating when the prices were checked, because a stale price is a small lie that compounds.',
        ],
      },
      {
        h: 'How to tell a bad recommendation page in thirty seconds',
        p: [
          'Three checks, in order. First, is there a disclosure above the first link, in plain language? Second, does the page name a situation where the product is the wrong choice? Third, is there a date on the pricing information?',
          'A page that fails all three is an ad with an article wrapped around it. A page that passes all three can still be wrong, but it is at least trying to be useful — and that is a low bar this industry clears surprisingly rarely.',
        ],
      },
    ],
    limitations: [
      'Commission ranges are market ranges and vary by program, category and negotiated terms. They are not quotes.',
      'Disclosure rules differ by country and platform, and they change. This is a plain-language summary, not legal advice.',
      'Tracking windows and validation rules are set by each retailer and are not published consistently.',
    ],
    related: [
      { name: 'Affiliate disclosure', href: '/en/affiliate-disclosure', why: 'The formal version of what this page explains informally.' },
      { name: 'The directory', href: '/en/directory', why: 'Ten tools, each page stating prices, limits and who should not buy it.' },
      { name: 'How to choose a tool', href: '/en/guides/how-to-choose-a-tool', why: 'The seven questions that make a commission irrelevant to a good decision.' },
    ],
    faqs: [
      { q: 'Does buying through an affiliate link cost me more?', a: 'No. The price is set by the seller and is identical. The commission comes from the seller\'s marketing budget.' },
      { q: 'Why do software tools pay such high commissions?', a: 'Because margin is high and the marginal cost of one more customer is near zero. Rates follow margin, not product quality.' },
      { q: 'What does #ad mean?', a: 'It is the recognised shorthand for "this is a paid or commission-earning promotion". Regulators in the US and UK require it to be clear and placed before the link or at the start of a caption.' },
      { q: 'Can a site be trusted if it earns commissions?', a: 'Yes — the question is not whether it earns but whether it discloses, explains its criteria, and names the cases where the product is wrong for you. Read those three, and the commission stops being the deciding factor.' },
      { q: 'Do you earn from the links on this site?', a: 'Not today. No link carries an affiliate ID. When that changes, affected pages will show #ad before the link and will say so at the top.' },
    ],
  },
};
