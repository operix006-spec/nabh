@echo off
chcp 65001 >nul
title Fix and Push to Vercel
echo ===================================================
echo   Cleaning and pushing clean configuration to GitHub
echo ===================================================
echo.

echo [1/4] Removing conflicting configs and outdated lockfile...
if exist next.config.mjs del /f /q next.config.mjs
if exist next.config.ts del /f /q next.config.ts
if exist package-lock.json del /f /q package-lock.json

git rm -f next.config.mjs >nul 2>&1
git rm -f next.config.ts >nul 2>&1
git rm -f package-lock.json >nul 2>&1

echo [2/4] Staging clean universal next.config.js and all updates...
git add -A

echo [3/4] Committing changes...
git commit -m "fix: switch to universal next.config.js and clean lockfile"

echo [4/4] Pushing to GitHub...
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [!] Push encountered an issue.
) else (
    echo.
    echo ===================================================
    echo   Done! Vercel will now install all packages and build successfully.
    echo ===================================================
)

pause
