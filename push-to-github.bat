@echo off
echo Initializing Git repository and pushing to GitHub...
echo.

cd /d "%~dp0"

git init
git add .
git commit -m "Initial commit: Etherx PPT project"
git branch -M main
git remote add origin https://github.com/busyatwork-glitch/pre_final_ppt.git
git push -u origin main

echo.
echo Done! Project pushed to GitHub.
pause
