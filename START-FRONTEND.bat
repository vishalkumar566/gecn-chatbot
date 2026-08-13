@echo off
cd /d "%~dp0frontend"
echo Installing frontend packages if needed...
npm install
if errorlevel 1 pause & exit /b 1
echo.
echo Starting GECN frontend on http://localhost:5173
npm run dev
pause
