@echo off
title Store Portal Backend Server
cd /d "%~dp0backend"
echo ========================================================
echo Starting Store Portal Backend Server on port 5000...
echo ========================================================
npm start
pause
