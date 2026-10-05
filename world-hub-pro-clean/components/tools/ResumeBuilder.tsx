'use client';

import React, { useState } from 'react';

export default function ResumeBuilder() {
  const [fullName, setFullName] = useState('João Silva');
  const [role, setRole] = useState('Desenvolvedor Full Stack Sênior');
  const [email, setEmail] = useState('joao.silva@email.com');
  const [phone, setPhone] = useState('+55 (11) 98765-4321');
  const [location, setLocation] = useState('São Paulo, Brasil');
  const [summary, setSummary] = useState(
    'Profissional com mais de 8 anos de experiência em engenharia de software web, arquiteturas escaláveis, Next.js, Node.js e otimização de produtos de alta conversão.'
  );

  const [experience, setExperience] = useState(
    'Tech Lead — Tech Corp (2021 - Presente)\n- Liderança de arquitetura frontend e micro-serviços.\n- Redução de tempo de carregamento de páginas em 45%.\n\nEngenheiro Frontend — Digital Agency (2018 - 2021)\n- Desenvolvimento de portais de alto tráfego com foco em SEO e monetização.'
  );

  const [education, setEducation] = useState(
    'Bacharelado em Ciência da Computação — Universidade Federal (2014 - 2018)\nCertificação AWS Certified Solutions Architect'
  );

  const [skills, setSkills] = useState('React, Next.js, TypeScript, Tailwind CSS, Node.js, Git, SEO Técnico, Google AdSense');

  // Impressão / Exportação em PDF nativo sem distorção
  const handlePrintPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Por favor, autorize pop-ups para gerar e imprimir seu currículo em PDF.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Curriculo_${fullName.replace(/\s+/g, '_')}</title>
        <style>
          @page { size: A4 portrait; margin: 15mm 20mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #18181b; line-height: 1.5; margin: 0; padding: 0; }
          h1 { margin: 0 0 4px 0; font-size: 24pt; font-weight: 800; color: #09090b; }
          .role { font-size: 13pt; font-weight: 600; color: #71717a; margin-bottom: 12px; }
          .contact { font-size: 9.5pt; color: #52525b; margin-bottom: 20px; border-bottom: 1px solid #e4e4e7; padding-bottom: 12px; }
          .section { margin-bottom: 18px; }
          .section-title { font-size: 11pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #09090b; border-bottom: 2px solid #18181b; padding-bottom: 4px; margin-bottom: 8px; }
          p, pre { font-size: 10pt; color: #27272a; margin: 0; white-space: pre-wrap; font-family: inherit; }
          .skills { display: flex; flex-wrap: wrap; gap: 6px; }
          .skill-tag { background: #f4f4f5; padding: 3px 8px; border-radius: 4px; font-size: 9pt; font-weight: 600; }
        </style>
      </head>
      <body>
        <h1>${fullName}</h1>
        <div class="role">${role}</div>
        <div class="contact">${email} • ${phone} • ${location}</div>

        <div class="section">
          <div class="section-title">Resumo Profissional</div>
          <p>${summary}</p>
        </div>

        <div class="section">
          <div class="section-title">Experiência Profissional</div>
          <pre>${experience}</pre>
        </div>

        <div class="section">
          <div class="section-title">Formação Acadêmica</div>
          <pre>${education}</pre>
        </div>

        <div class="section">
          <div class="section-title">Habilidades & Competências</div>
          <p>${skills}</p>
        </div>

        <script>
          window.onload = function() {
            window.focus();
            window.print();
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Formulário de Edição */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Nome Completo</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Cargo / Título</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Telefone / WhatsApp</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Resumo Profissional</label>
          <textarea
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full p-3 rounded-xl border border-zinc-300 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Experiências Profissionais</label>
          <textarea
            rows={5}
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full p-3 rounded-xl border border-zinc-300 text-sm font-mono text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Educação e Cursos</label>
          <textarea
            rows={3}
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            className="w-full p-3 rounded-xl border border-zinc-300 text-sm font-mono text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Habilidades (separadas por vírgula)</label>
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
          className="w-full py-4 bg-yellow-400 text-zinc-950 font-black rounded-2xl hover:bg-yellow-300 transition text-sm shadow-md flex items-center justify-center gap-2"
        >
          <span>📄</span> Gerar e Baixar Currículo Formatado (PDF / Impressão)
        </button>
      </div>
    </div>
  );
}
