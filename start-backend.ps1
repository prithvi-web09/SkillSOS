# SkillSOS Backend Startup Script (PowerShell)
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Starting SkillSOS Spring Boot Backend  " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$backendDir = "$PSScriptRoot\backend"
$jarPath = "$backendDir\target\skillsos-backend-1.0.0.jar"

if (-not $env:GOOGLE_APPLICATION_CREDENTIALS) {
    Write-Host "[INFO] GOOGLE_APPLICATION_CREDENTIALS environment variable is not currently set." -ForegroundColor Yellow
    Write-Host "[INFO] The backend process will start cleanly. Health check will report DEGRADED until credentials are provided." -ForegroundColor Yellow
    Write-Host "[INFO] To connect Firestore: `$env:GOOGLE_APPLICATION_CREDENTIALS = 'C:\path\to\service-account.json'" -ForegroundColor Yellow
} else {
    Write-Host "[OK] Using GOOGLE_APPLICATION_CREDENTIALS: $env:GOOGLE_APPLICATION_CREDENTIALS" -ForegroundColor Green
}

Set-Location $backendDir

if (Test-Path $jarPath) {
    Write-Host "Launching executable JAR ($jarPath)..." -ForegroundColor Green
    java -jar $jarPath
} else {
    Write-Host "Executable JAR not found, launching with Maven..." -ForegroundColor Yellow
    $scratchToolsMvn = "C:\Users\shett\.gemini\antigravity\scratch\tools\apache-maven-3.9.6\bin\mvn.cmd"
    $mvnCmd = if (Get-Command mvn -ErrorAction SilentlyContinue) { "mvn" } elseif (Test-Path $scratchToolsMvn) { $scratchToolsMvn } else { "mvn" }
    & $mvnCmd spring-boot:run
}
