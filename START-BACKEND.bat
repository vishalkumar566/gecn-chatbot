@echo off
cd /d "%~dp0backend"
echo Installing backend packages if needed...
npm install
if errorlevel 1 pause & exit /b 1
echo.
echo Starting GECN NVIDIA backend on http://localhost:5000
npm run dev
pause
