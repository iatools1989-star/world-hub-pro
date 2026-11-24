'use client';

import React, { useState } from 'react';

export default function ResumeBuilder() {
  const [fullName, setFullName] = useState('Alex Morgan');
  const [role, setRole] = useState('Senior Full Stack Developer');
  const [email, setEmail] = useState('alex.morgan@example.com');
  const [phone, setPhone] = useState('+55 (11) 98765-4321');
  const [location, setLocation] = useState('Austin, TX, USA');
  const [summary, setSummary] = useState(
    'Engineer with 8+ years building web software, scalable architectures, Next.js, Node.js and product performance work.'
  );

  const [experience, setExperience] = useState(
    'Tech Lead — Tech Corp (2021 - Present)\n- Led frontend architecture and micro-services.\n- Cut page load time by 45%.\n\nFrontend Engineer — Digital Agency (2018 - 2021)\n- Built high-traffic portals focused on SEO and monetisation.'
  );

  const [education, setEducation] = useState(
    'BSc Computer Science — State University (2014 - 2018)\nAWS Certified Solutions Architect'
  );

  const [skills, setSkills] = useState('React, Next.js, TypeScript, Tailwind CSS, Node.js, Git, Technical SEO, Google AdSense');

  // Impressão / Exportação em PDF nativo sem distorção
  /**
   * Gera o curriculo como PDF de verdade, no proprio navegador.
   *
   * Antes isto abria uma janela e chamava window.print(), dependendo de o
   * visitante escolher "Salvar como PDF" no dialogo — e de o navegador nao
   * bloquear a janela, o que acontece na maioria dos celulares. Agora o
   * arquivo baixa direto, com o texto selecionavel (nao e uma foto da folha).
   */
  const handlePrintPdf = async () => {
    try {
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
      const pdf = await PDFDocument.create();
      const fonte = await pdf.embedFont(StandardFonts.Helvetica);
      const fonteNegrito = await pdf.embedFont(StandardFonts.HelveticaBold);

      const A4: [number, number] = [595.28, 841.89];
      const margem = 56;
      const larguraUtil = A4[0] - margem * 2;
      let pagina = pdf.addPage(A4);
      let y = A4[1] - margem;

      // pdf-lib nao faz quebra de linha: a gente mede e quebra.
      const escrever = (
        texto: string,
        opts: { tamanho: number; negrito?: boolean; cor?: [number, number, number]; espacoAntes?: number }
      ) => {
        const fonteAtual = opts.negrito ? fonteNegrito : fonte;
        const alturaLinha = opts.tamanho * 1.45;
        const palavras = texto.replace(/\r/g, '').split(/\s+/);
        let linha = '';
        y -= opts.espacoAntes ?? 0;

        const desenhar = (txt: string) => {
          if (y < margem + alturaLinha) {
            pagina = pdf.addPage(A4);
            y = A4[1] - margem;
          }
          pagina.drawText(txt, {
            x: margem,
            y,
            size: opts.tamanho,
            font: fonteAtual,
            color: rgb(...(opts.cor ?? [0.1, 0.1, 0.12])),
          });
          y -= alturaLinha;
        };

        for (const palavra of palavras) {
          if (palavra === '\n') {
            desenhar(linha);
            linha = '';
            continue;
          }
          const tentativa = linha ? `${linha} ${palavra}` : palavra;
          if (fonteAtual.widthOfTextAtSize(tentativa, opts.tamanho) > larguraUtil) {
            desenhar(linha);
            linha = palavra;
          } else {
            linha = tentativa;
          }
        }
        if (linha) desenhar(linha);
      };

      escrever(fullName || 'Your name', { tamanho: 22, negrito: true });
      escrever(role, { tamanho: 11, cor: [0.42, 0.42, 0.46] });
      escrever([email, phone, location].filter(Boolean).join('  •  '), {
        tamanho: 9,
        cor: [0.38, 0.38, 0.42],
        espacoAntes: 2,
      });

      const secao = (titulo: string, corpo: string) => {
        y -= 10;
        if (y < margem + 40) {
          pagina = pdf.addPage(A4);
          y = A4[1] - margem;
        }
        pagina.drawLine({
          start: { x: margem, y: y + 11 },
          end: { x: A4[0] - margem, y: y + 11 },
          thickness: 0.8,
          color: rgb(0.82, 0.82, 0.86),
        });
        escrever(titulo.toUpperCase(), { tamanho: 9.5, negrito: true, espacoAntes: 16 });
        escrever(corpo, { tamanho: 9.5 });
      };

      if (summary.trim()) secao('Professional Summary', summary);
      if (experience.trim()) secao('Work Experience', experience);
      if (education.trim()) secao('Education', education);
      if (skills.trim()) secao('Skills', skills);

      const bytes = await pdf.save();
      const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-${(fullName || 'draft').replace(/\s+/g, '-').toLowerCase()}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch {
      alert('Something went wrong while generating the PDF. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulário de Edição */}
      <div className="bg-[var(--color-surface)] p-6 sm:p-8 rounded-[14px] border border-[var(--color-line)] shadow-sm space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[var(--color-ink-muted)] uppercase tracking-wider mb-1.5">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--color-ink-muted)] uppercase tracking-wider mb-1.5">Job Title</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--color-ink-muted)] uppercase tracking-wider mb-1.5">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--color-ink-muted)] uppercase tracking-wider mb-1.5">Phone / WhatsApp</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[var(--color-ink-muted)] uppercase tracking-wider mb-1.5">Professional Summary</label>
          <textarea
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full p-3 rounded-xl border border-zinc-300 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[var(--color-ink-muted)] uppercase tracking-wider mb-1.5">Work Experience</label>
          <textarea
            rows={5}
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full p-3 rounded-xl border border-zinc-300 text-sm font-mono text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[var(--color-ink-muted)] uppercase tracking-wider mb-1.5">Education & Courses</label>
          <textarea
            rows={3}
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            className="w-full p-3 rounded-xl border border-zinc-300 text-sm font-mono text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[var(--color-ink-muted)] uppercase tracking-wider mb-1.5">Skills (comma separated)</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm"
          />
        </div>

        <button
          onClick={handlePrintPdf}
          type="button"
          className="w-full py-4 bg-yellow-400 text-zinc-950 font-black rounded-[12px] hover:bg-yellow-300 transition text-sm shadow-md flex items-center justify-center gap-2"
        >
          <span>📄</span> Generate and Download Formatted Resume (PDF / Print)
        </button>
      </div>
    </div>
  );
}
