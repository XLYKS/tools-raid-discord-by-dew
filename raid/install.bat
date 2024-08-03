@echo off
title Installation Script - RAID Bot
color 0A

echo.
echo ==============================================
echo           Installation Script - RAID Bot
echo ==============================================
echo.

REM Vérification de l'installation de Node.js
echo Vérification de l'installation de Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo Node.js n'est pas installé. Veuillez installer Node.js depuis https://nodejs.org/ et réessayez.
    pause
    exit /b
) else (
    color 0A
    echo Node.js est installé.
)

echo.
echo ==============================================
echo         Installation des dépendances
echo ==============================================
echo.

REM Navigation vers le répertoire contenant ce script
cd /d "%~dp0"

REM Vérification de l'existence de package.json
if not exist package.json (
    color 0C
    echo Le fichier package.json n'a pas été trouvé. Assurez-vous que ce script est dans le bon répertoire.
    pause
    exit /b
)

REM Installation des dépendances
npm install

if %errorlevel% neq 0 (
    color 0C
    echo L'installation des dépendances a échoué. Assurez-vous d'avoir une connexion Internet active et réessayez.
    pause
    exit /b
) else (
    color 0A
    echo Les dépendances ont été installées avec succès.
)

echo.
echo ==============================================
echo         Installation terminée
echo ==============================================
echo.

color 0B
echo Vous pouvez maintenant lancer le bot en utilisant la commande :
echo   node index.js
pause
