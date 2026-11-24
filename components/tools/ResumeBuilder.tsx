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
  const handlePrintPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups so we can generate and print your resume as a PDF.');
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
          <div class="section-title">Professional Summary</div>
          <p>${summary}</p>
        </div>

        <div class="section">
          <div class="section-title">Work Experience</div>
          <pre>${experience}</pre>
        </div>

        <div class="section">
          <div class="section-title">Education</div>
          <pre>${education}</pre>
        </div>

        <div class="section">
          <div class="section-title">Skills</div>
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
