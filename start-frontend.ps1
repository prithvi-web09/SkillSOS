# SkillSOS Frontend Startup Script (PowerShell)
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "    Starting SkillSOS React Vite Frontend " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$frontendDir = "$PSScriptRoot\frontend"
Set-Location $frontendDir

Write-Host "Starting Vite dev server on http://localhost:5173..." -ForegroundColor Green
npm run dev
