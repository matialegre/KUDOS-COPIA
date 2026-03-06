@echo off
echo ========================================
echo INICIANDO BOT DE SOPORTE MUNDO OUTDOOR
echo ========================================
echo.

echo 1. Iniciando servidor Python del bot...
cd SupportBotPython
start "Bot Python" cmd /k "python app.py"
echo Bot Python iniciado en http://localhost:5050
echo.

echo 2. Esperando 3 segundos para que el bot inicie...
timeout /t 3 /nobreak >nul

echo 3. Iniciando ngrok para exponer el bot...
start "Ngrok" cmd /k "ngrok http 5050"
echo Ngrok iniciado
echo.

echo 4. Copiando URL de ngrok al portapapeles...
echo Espera unos segundos mientras ngrok genera la URL...
timeout /t 5 /nobreak >nul

echo ========================================
echo LISTO! BOT DE SOPORTE ACTIVO
echo ========================================
echo - Bot Python: http://localhost:5050
echo - Ngrok: Revisa la ventana de ngrok para la URL publica
echo - Dashboard: http://localhost:5050
echo.
echo IMPORTANTE: Copia la URL de ngrok y actualizala en:
echo 1. SupportBot/node/clients/pythonSupport.ts
echo 2. App Settings de support-bot en VTEX
echo ========================================
pause
