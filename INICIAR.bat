@echo off
chcp 65001 >nul
title World Hub Pro - Iniciar
color 0A
echo ====================================================
echo   WORLD-HUB-PRO - Primeiro Envio
echo   50 Tools + 500 AI Directory - 12 Linguas
echo ====================================================
echo.
set /p GH_TOKEN= Cole seu token ghp_... : 
git init
git branch -M main
git add .
git commit -m "feat: world-hub-pro hibrido 50 tools + 500 AI 12 langs"
git remote add origin https://iatools1989-star:%GH_TOKEN%@github.com/iatools1989-star/world-hub-pro.git
git push -u origin main
git remote set-url origin https://github.com/iatools1989-star/world-hub-pro.git
set GH_TOKEN=
pause
