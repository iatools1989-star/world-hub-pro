@echo off
chcp 65001 >nul
echo {> vercel.json
echo   "framework": "nextjs",>> vercel.json
echo   "regions": ["gru1"]>> vercel.json
echo }>> vercel.json
type vercel.json
git add vercel.json
git commit -m "fix: vercel.json hobby"
set /p GH_TOKEN= Cole seu token ghp_... : 
git remote set-url origin https://iatools1989-star:%GH_TOKEN%@github.com/iatools1989-star/world-hub-pro.git
git push
git remote set-url origin https://github.com/iatools1989-star/world-hub-pro.git
set GH_TOKEN=
pause
