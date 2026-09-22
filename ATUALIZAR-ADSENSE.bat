@echo off
chcp 65001 >nul
title World Hub Pro - AdSense
color 0A
echo ====================================================
echo   AdSense ca-pub-3588158822524146
echo   iatools.online - Inject Script + ads.txt
echo ====================================================
git add .
git commit -m "feat: adsense ca-pub-3588158822524146 + ads.txt"
set /p GH_TOKEN= Cole seu token ghp_... : 
git remote set-url origin https://iatools1989-star:%GH_TOKEN%@github.com/iatools1989-star/world-hub-pro.git
git push
git remote set-url origin https://github.com/iatools1989-star/world-hub-pro.git
set GH_TOKEN=
echo.
echo Pronto! Aguarde Vercel verde e clique em
echo AdSense -> "Ja coloquei o codigo" -> Solicitar analise
pause
