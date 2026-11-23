/**
 * Autenticacao do painel.
 *
 * COMO FUNCIONA
 * - A senha NAO fica no codigo: o Worker guarda o hash PBKDF2 (100k iteracoes,
 *   SHA-256) como secret do Cloudflare. Nem o repositorio nem o bundle tem a senha.
 * - O login roda no servidor (/api/admin/login): compara o hash com
 *   timingSafeEqual e, se bater, devolve um cookie HttpOnly assinado com HMAC.
 * - O cookie nao carrega senha nem token: carrega e-mail + validade + assinatura.
 *
 * POR QUE NAO HA TOKEN NO NAVEGADOR
 * A versao anterior pedia um token do GitHub guardado em localStorage. Isso
 * significa que o painel inteiro dependia de um segredo de longa duracao
 * acessivel por qualquer XSS. Aqui o segredo (ADMIN_SESSION_SECRET) nunca sai
 * do Worker, e o cookie expira em 12h.
 *
 * O QUE ISSO AINDA NAO E
 * Nao e multiusuario, nao tem 2FA, nao tem recuperacao de senha por e-mail.
 * Para um site de uma pessoa, e proporcional. Para mais de uma pessoa, precisa
 * de um provedor de identidade — nao de mais codigo aqui.
 */

export const COOKIE_NAME = 'iatools_admin';
export const SESSAO_HORAS = 12;
export const PBKDF2_ITERACOES = 100_000;

/** Deriva o hash PBKDF2 de uma senha, em base64. Roda no Worker e no script de setup. */
export async function derivarSenha(senha: string, saltB64: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = Uint8Array.from(atob(saltB64), (c) => c.charCodeAt(0));
  const chave = await crypto.subtle.importKey('raw', enc.encode(senha), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERACOES, hash: 'SHA-256' },
    chave,
    256
  );
  return btoa(String.fromCharCode(...new Uint8Array(bits)));
}

/** Comparacao em tempo constante. Evita vazar o hash por diferenca de tempo. */
export function iguaisSeguro(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function chaveHmac(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Cookie = base64(payload).base64(hmac)
 * payload = { email, exp } — nada sensivel.
 */
export async function assinarSessao(email: string, secret: string): Promise<string> {
  const exp = Date.now() + SESSAO_HORAS * 3600 * 1000;
  const payload = btoa(JSON.stringify({ email, exp }));
  const assinatura = await crypto.subtle.sign('HMAC', await chaveHmac(secret), new TextEncoder().encode(payload));
  const sig = btoa(String.fromCharCode(...new Uint8Array(assinatura)));
  return `${payload}.${sig}`;
}

export async function verificarSessao(
  cookie: string | undefined,
  secret: string | undefined
): Promise<{ email: string } | null> {
  if (!cookie || !secret) return null;
  const [payload, sig] = cookie.split('.');
  if (!payload || !sig) return null;

  const esperado = await crypto.subtle.sign('HMAC', await chaveHmac(secret), new TextEncoder().encode(payload));
  const sigEsp = btoa(String.fromCharCode(...new Uint8Array(esperado)));
  if (!iguaisSeguro(sig, sigEsp)) return null;

  try {
    const dados = JSON.parse(atob(payload)) as { email: string; exp: number };
    if (!dados.exp || dados.exp < Date.now()) return null;
    return { email: dados.email };
  } catch {
    return null;
  }
}

/** Gera um salt novo, em base64. Usado pelo script de setup. */
export function gerarSalt(): string {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...salt));
}
