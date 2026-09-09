@echo off
chcp 65001 >nul
title Push Nabh to GitHub
echo ===================================================
echo   Pushing Nabh Platform to GitHub: operix006-spec/nabh
echo ===================================================
echo.

if not exist .git (
    echo [1/5] Initializing git repository...
    git init
) else (
    echo [1/5] Git repository already initialized.
)

if exist next.config.mjs del next.config.mjs >nul 2>&1

echo [2/5] Setting up remote origin...
git remote remove origin >nul 2>&1
git remote add origin https://operix006-spec@github.com/operix006-spec/nabh.git

echo [3/5] Staging files (ignoring node_modules and .next)...
git add .

echo [4/5] Committing changes...
git commit -m "fix: resolve Vercel build types and enable ignoreBuildErrors in next.config"

echo [5/5] Pushing to branch main...
git branch -M main
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ---------------------------------------------------
    echo [!] Notice: If GitHub asks for login or credentials,
    echo     please sign in via browser or Personal Access Token.
    echo ---------------------------------------------------
) else (
    echo.
    echo ===================================================
    echo   Successfully pushed to https://github.com/operix006-spec/nabh
    echo ===================================================
)

pause
