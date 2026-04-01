@echo off
title Mundo Outdoor - Previews de Email Templates
cd /d "%~dp0"

echo.
echo  =========================================
echo   MUNDO OUTDOOR - ABRIENDO PREVIEWS (10)
echo  =========================================
echo.

start "" "preview-order-confirmation.html"
timeout /t 1 /nobreak >nul
start "" "preview-payment-approved.html"
timeout /t 1 /nobreak >nul
start "" "preview-order-invoiced.html"
timeout /t 1 /nobreak >nul
start "" "preview-order-dispatched.html"
timeout /t 1 /nobreak >nul
start "" "preview-invoice.html"
timeout /t 1 /nobreak >nul
start "" "preview-new-account.html"
timeout /t 1 /nobreak >nul
start "" "preview-canceled-order.html"
timeout /t 1 /nobreak >nul
start "" "preview-order-delivered.html"
timeout /t 1 /nobreak >nul
start "" "preview-abandoned-cart.html"
timeout /t 1 /nobreak >nul
start "" "preview-order-ready-for-pickup.html"

echo  Listo! Se abrieron los 10 previews en el navegador.
echo  Cada preview muestra la maqueta de referencia arriba
echo  y el template implementado abajo.
echo.
pause
