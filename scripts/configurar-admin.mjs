#!/usr/bin/env node
/**
 * Configura o login do painel no Cloudflare Worker.
 *
 * O QUE FAZ
 * 1. Pede a senha sem eco (nao fica no historico do shell nem em arquivo).
 * 2. Deriva o hash PBKDF2 (100k iteracoes, SHA-256).
 * 3. Grava 4 secrets no Worker pela API: ADMIN_EMAIL, ADMIN_PASSWORD_HASH,
 *    ADMIN_PASSWORD_SALT, ADMIN_SESSION_SECRET.
 *
 * O QUE NAO FAZ
 * - Nao grava a senha em nenhum arquivo do repositorio.
 * - Nao imprime senha nem hash na tela.
 *
 * USO (Windows PowerShell ou bash):
 *   $env:CLOUDFLARE_API_TOKEN="..." ; node scripts/configurar-admin.mjs
 */
import { createInterface } from 'node:readline';

const CONTA = process.env.CLOUDFLARE_ACCOUNT_ID || '623be10a22c0833e76ef81cb4a7c080d';
const TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const SCRIPT = process.env.WORKER_NAME || 'iatools';
const EMAIL = process.env.ADMIN_EMAIL || 'guilhermemarculasilva@gmail.com';

if (!TOKEN) {
  console.error('Falta CLOUDFLARE_API_TOKEN no ambiente.');
  process.exit(1);
}

function perguntarSenha(pergunta) {
  if (process.env.ADMIN_PASSWORD) return Promise.resolve(process.env.ADMIN_PASSWORD);
  const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  const original = rl._writeToOutput;
  rl._writeToOutput = function (s) {
    if (rl.stdoutMuted && s !== '\r\n' && s !== '\n') return;
    original.call(rl, s);
  };
  rl.stdoutMuted = false;
  return new Promise((resolve) => {
    rl.question(pergunta, (resp) => {
      rl.close();
      process.stdout.write('\n');
      resolve(resp);
    });
    rl.stdoutMuted = true;
  });
}

const b64 = (bytes) => Buffer.from(bytes).toString('base64');

async function hashSenha(senha, saltB64) {
  const salt = Buffer.from(saltB64, 'base64');
  const chave = await crypto.subtle.importKey('raw', new TextEncoder().encode(senha), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    chave,
    256
  );
  return b64(new Uint8Array(bits));
}

async function gravarSecret(nome, valor) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CONTA}/workers/scripts/${SCRIPT}/secrets`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: nome, text: valor, type: 'secret_text' }),
    }
  );
  const d = await res.json().catch(() => ({}));
  const ok = res.ok && d.success;
  console.log(`  ${ok ? 'ok  ' : 'ERRO'} ${nome}`);
  if (!ok) console.log('       ', JSON.stringify(d.errors || d).slice(0, 200));
  return ok;
}

const senha = await perguntarSenha(`Senha para ${EMAIL}: `);
if (!senha || senha.length < 12) {
  console.error('\nUse pelo menos 12 caracteres. Painel exposto na internet com senha curta e risco real.');
  process.exit(1);
}

const salt = b64(crypto.getRandomValues(new Uint8Array(16)));
const hash = await hashSenha(senha, salt);
const secretSessao = b64(crypto.getRandomValues(new Uint8Array(32)));

console.log('\nGravando secrets no Worker...');
let tudo = true;
tudo = (await gravarSecret('ADMIN_EMAIL', EMAIL.toLowerCase())) && tudo;
tudo = (await gravarSecret('ADMIN_PASSWORD_HASH', hash)) && tudo;
tudo = (await gravarSecret('ADMIN_PASSWORD_SALT', salt)) && tudo;
tudo = (await gravarSecret('ADMIN_SESSION_SECRET', secretSessao)) && tudo;

if (!tudo) {
  console.error('\nAlgum secret falhou. O painel responde 503 ate todos existirem.');
  process.exit(1);
}

console.log(`
Pronto.

  Painel: https://iatools.online/en/admin
  Login:  ${EMAIL}
  Senha:  a que voce acabou de digitar (nao foi gravada em lugar nenhum)

Os secrets ficam no Worker e nao aparecem no painel da Cloudflare depois de
gravados — nem para voce. Se esquecer a senha, rode este script de novo.
`);
