@echo off
chcp 65001 >nul
title World Hub Pro - Atualizar
color 0B
echo ====================================================
echo   WORLD-HUB-PRO - Atualizar
echo ====================================================
git status --short
set /p MSG= Mensagem [Enter=atualizacao]: 
if "%MSG%"=="" set MSG=atualizacao world-hub
set /p GH_TOKEN= Cole seu token ghp_... : 
git add .
git commit -m "%MSG%"
git remote set-url origin https://iatools1989-star:%GH_TOKEN%@github.com/iatools1989-star/world-hub-pro.git
git push
git remote set-url origin https://github.com/iatools1989-star/world-hub-pro.git
set GH_TOKEN=
set MSG=
pause
