# Guia de migração para o repositório `canal-youtube`

Este material foi produzido na sessão `arena/9256a22e-world-hub-pro`, cujo token
do GitHub só tem acesso ao repositório `world-hub-pro`. Por isso os arquivos do
canal foram enviados para cá como ponte. A sessão `arena/b07c56d8-canal-youtube`
possui acesso ao repositório `iatools1989-star/canal-youtube` e deve concluir a
migração com os comandos abaixo.

## Conteúdo a migrar (8 arquivos + .gitignore)

- README.md (substitui o README automático do GitHub)
- 01-fundacao-do-canal.md
- 02-video-01-resume-no-experience.md
- 03-video-02-tell-me-about-yourself.md
- 04-shorts-semana-1.md
- 05-servicos-renda-rapida.md
- 06-plano-terca-27-out.md
- 07-lead-magnet-ats-cheat-sheet.md
- .gitignore

## Opção 1 — Token da outra sessão consegue ler o world-hub-pro

```bash
cd /tmp
rm -rf ponte canal-youtube
git clone --depth 1 --branch arena/9256a22e-world-hub-pro \
  https://github.com/iatools1989-star/world-hub-pro.git ponte
git clone https://github.com/iatools1989-star/canal-youtube.git
cp -r ponte/youtube-carreira/. canal-youtube/
cd canal-youtube
git add .
git commit -m "Pacote de lancamento do canal The Career Playbook (semana 1)"
git push origin main
```

O README automático será sobrescrito pelo README.md do pacote (manter o nosso,
que tem o cronograma da semana 1).

## Opção 2 — Token da outra sessão não enxerga o world-hub-pro (403)

1. No GitHub, abrir `iatools1989-star/canal-youtube` > Settings > integrations,
   ou reconectar o GitHub na Arena marcando **All repositories** (ou marcar
   ambos: `world-hub-pro` e `canal-youtube`).
2. Repetir a Opção 1.

## Opção 3 — Sem permissão cross-repo, upload manual pelo navegador

Em `github.com/iatools1989-star/canal-youtube`: Add file > Upload files >
arrastar os 8 arquivos `.md` e o `.gitignore` listados acima > Commit.

## Pós-migração (limpeza da ponte)

Após confirmar que os arquivos estão no `canal-youtube`:

```bash
# na sessao com acesso ao world-hub-pro
git rm -r youtube-carreira
git commit -m "Remove ponte de migracao apos transferencia ao canal-youtube"
git push origin arena/9256a22e-world-hub-pro
```
