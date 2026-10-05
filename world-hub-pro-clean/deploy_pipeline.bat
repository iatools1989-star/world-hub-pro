@echo off
setlocal EnableDelayedExpansion

title Automatizador de Deploy e Melhorias - Git Pipeline

set "LOCAL_REPO_PATH=."
set "REMOTE_REPO_URL=https://github.com/iatools1989-star/world-hub-pro.git"
set "BRANCH_NAME=main"
set "DEFAULT_COMMIT_MESSAGE=feat: update tools batch 1 with local qrcode generator and anti-cls ads"
set "REMOTE_NAME=origin"

cls
echo ==============================================================================
echo           PIPELINE DE ATUALIZACAO AUTOMATIZADA E DEPLOY GIT
echo ==============================================================================
echo.

echo [*] Validando diretorio do projeto...
if not exist "%LOCAL_REPO_PATH%" (
    echo [ERRO CRITICO] O caminho "%LOCAL_REPO_PATH%" nao existe.
    goto :EXIT_ERROR
)

cd /d "%LOCAL_REPO_PATH%"
if %errorlevel% neq 0 (
    echo [ERRO CRITICO] Falha ao acessar a pasta do repositorio.
    goto :EXIT_ERROR
)
echo [OK] Diretorio de trabalho: %CD%
echo.

echo [*] Verificando instalacao do Git...
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO CRITICO] Git nao localizado no PATH do sistema.
    goto :EXIT_ERROR
)
for /f "tokens=*" %%v in ('git --version') do echo [OK] %%v detectado.

echo [*] Verificando repositorio Git local...
if not exist ".git" (
    echo [AVISO] Inicializando repositorio Git...
    git init
    git branch -M %BRANCH_NAME%
)

git remote get-url %REMOTE_NAME% >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Configurando remote "%REMOTE_NAME%" com: %REMOTE_REPO_URL%
    git remote add %REMOTE_NAME% "%REMOTE_REPO_URL%"
) else (
    git remote set-url %REMOTE_NAME% "%REMOTE_REPO_URL%"
)
echo [OK] Repositorio remoto verificado: %REMOTE_REPO_URL%
echo.

echo ------------------------------------------------------------------------------
echo ATENCAO: A proxima etapa executara verificacoes e atualizacoes no repositorio.
echo ------------------------------------------------------------------------------
set /p "CONFIRM_RUN=Deseja prosseguir? [S/N]: "
if /i not "%CONFIRM_RUN%"=="S" (
    echo.
    echo [OPERACAO ABORTADA] Nenhuma alteracao foi enviada.
    goto :EXIT_SUCCESS
)
echo.

echo ==============================================================================
echo                     EXECUTANDO MELHORIAS DO PROJETO
echo ==============================================================================
echo.

echo [*] Passo 1/3: Sincronizando e instalando novas dependencias (npm install)...
call npm install
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao instalar dependencias do Node.js.
    goto :FAIL_PIPELINE
)
echo [OK] Dependencias sincronizadas com sucesso.
echo.

echo [*] Passo 2/3: Compilando projeto para producao (npm run build)...
call npm run build
if %errorlevel% neq 0 (
    echo [ERRO CRITICO] O comando de build falhou! Abortando sincronizacao Git.
    goto :FAIL_PIPELINE
)
echo.

echo [*] Passo 3/3: Verificando status dos arquivos...
git status -s
echo.
echo [SUCESSO] Validacoes de codigo concluidas com exito!
echo.

echo ==============================================================================
echo                     SINCRONIZACAO COM O GITHUB
echo ==============================================================================
echo.

set "COMMIT_MSG="
set /p "COMMIT_MSG=Digite a mensagem do commit (Pressione [ENTER] para usar a padrao): "
if "%COMMIT_MSG%"=="" (
    set "COMMIT_MSG=%DEFAULT_COMMIT_MESSAGE%"
)
echo [*] Mensagem selecionada: "%COMMIT_MSG%"
echo.

echo [*] Adicionando alteracoes ao stage...
git add -A

git diff --cached --quiet
if %errorlevel% equ 0 (
    echo [INFO] Nenhuma alteracao pendente para commit.
    goto :PUSH_CHANGES
)

echo [*] Criando commit local...
git commit -m "%COMMIT_MSG%"
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao registrar commit local.
    goto :FAIL_GIT
)
echo [OK] Commit registrado com sucesso.

:PUSH_CHANGES
git checkout -B %BRANCH_NAME% >nul 2>&1

echo [*] Enviando alteracoes para o GitHub (%REMOTE_NAME%/%BRANCH_NAME%)...
git push -u %REMOTE_NAME% %BRANCH_NAME%
if %errorlevel% neq 0 (
    echo.
    echo [AVISO] Push direto rejeitado. Tentando sincronizar com git pull --rebase...
    git pull --rebase %REMOTE_NAME% %BRANCH_NAME%
    if %errorlevel% neq 0 (
        echo.
        echo [CONFLITO OU ERRO] Falha ao sincronizar com a branch remota.
        echo Se desejar sobrescrever o repositorio com a versao nova limpa,
        echo execute manualmente: git push -u origin %BRANCH_NAME% --force
        goto :FAIL_GIT
    )
    echo [*] Re-tentando push apos pull rebase...
    git push -u %REMOTE_NAME% %BRANCH_NAME%
    if %errorlevel% neq 0 (
        echo [ERRO] Falha no push.
        goto :FAIL_GIT
    )
)

echo.
echo ==============================================================================
echo        OPERACAO CONCLUIDA COM SUCESSO: REPOSITORIO ATUALIZADO!
echo ==============================================================================
echo Branch: %BRANCH_NAME%
echo Remote: %REMOTE_REPO_URL%
echo.
goto :EXIT_SUCCESS

:FAIL_PIPELINE
echo.
echo [FALHA NO PIPELINE] Os scripts de verificacao/build geraram erros.
goto :EXIT_ERROR

:FAIL_GIT
echo.
echo [FALHA NO GIT] Ocorreu um erro durante as operacoes do Git.
goto :EXIT_ERROR

:EXIT_ERROR
echo.
echo ------------------------------------------------------------------------------
echo O script foi encerrado com erros. Verifique os logs acima para corrigir.
echo ------------------------------------------------------------------------------
pause
exit /b 1

:EXIT_SUCCESS
echo ------------------------------------------------------------------------------
echo Pressione qualquer tecla para fechar esta janela.
echo ------------------------------------------------------------------------------
pause
exit /b 0
