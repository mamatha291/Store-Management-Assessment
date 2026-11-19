@echo off
title Store Portal Frontend App
cd /d "%~dp0frontend"
echo ========================================================
echo Starting Store Portal Frontend at http://localhost:5173...
echo ========================================================
npm run dev
pause
