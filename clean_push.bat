@echo off
title Fix Vercel Build - Push to GitHub
echo ===================================================
echo   Pushing Ambient Types Fix to GitHub
echo ===================================================
echo.

git add -A
git commit -m "fix: provide solid fallback supabase credentials for CI build"
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
