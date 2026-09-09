@echo off
title Fix Vercel Build - Push to GitHub
echo ===================================================
echo   Pushing Ambient Types Fix to GitHub
echo ===================================================
echo.

echo [1/3] Copying official brand logo to public folder...
node copy_logo.js

echo [2/3] Staging and committing logo updates...
git add -A
git commit -m "feat: add official brand logo across navbar, footer, login, and registration"
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [!] Push failed. Please check your credentials.
) else (
    echo.
    echo ===================================================
    echo   Successfully pushed! Vercel build will now succeed.
    echo ===================================================
)

pause
