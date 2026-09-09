@echo off
title Nabh Cognitive Platform - Dev Server
echo ===================================================
echo   Starting Nabh Cognitive Platform (Next.js)
echo ===================================================
echo.
npm run dev
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Server stopped with an error.
    pause
)
