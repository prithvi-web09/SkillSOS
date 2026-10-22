# SkillSOS Full-Stack Launcher (PowerShell)
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "       Launching SkillSOS Full-Stack      " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$backendScript = "$PSScriptRoot\start-backend.ps1"
$frontendScript = "$PSScriptRoot\start-frontend.ps1"

Write-Host "Launching Backend in new window (http://localhost:8080)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-File", "`"$backendScript`""

Start-Sleep -Seconds 2

Write-Host "Launching Frontend in new window (http://localhost:5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-File", "`"$frontendScript`""

Write-Host "Both services launched!" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "Backend:  http://localhost:8080" -ForegroundColor White
Write-Host "Health:   http://localhost:8080/api/health" -ForegroundColor White
