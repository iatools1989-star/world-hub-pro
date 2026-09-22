@echo off
chcp 65001 >nul
title Fix ads.txt
color 0A
echo Corrigindo ads.txt para iatools.online...
git add .
git commit -m "fix: ads.txt route para AdSense ca-pub-3588158822524146"
set /p GH_TOKEN= Cole seu token ghp_... : 
git remote set-url origin https://iatools1989-star:%GH_TOKEN%@github.com/iatools1989-star/world-hub-pro.git
git push
git remote set-url origin https://github.com/iatools1989-star/world-hub-pro.git
set GH_TOKEN=
echo Pronto! Verifique https://www.iatools.online/ads.txt em 1 min
pause
