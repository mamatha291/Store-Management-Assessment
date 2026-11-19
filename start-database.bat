@echo off
title Store Portal Database Server (Port 3307)
echo ========================================================
echo Starting MySQL Server for database 'assessment' on port 3307...
echo ========================================================
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe" --datadir="%~dp0.data\mysql" --port=3307 --mysqlx=0 --console
pause
