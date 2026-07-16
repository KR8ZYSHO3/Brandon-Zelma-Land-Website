# Alternate launcher if the .bat is blocked by Windows policy
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

function Write-Step($msg) { Write-Host ""; Write-Host ">> $msg" -ForegroundColor Cyan }

Write-Host "============================================"
Write-Host " Brandon Zelma Land"
Write-Host "============================================"

# Ensure Node on PATH
$nodeDirs = @(
  "$env:ProgramFiles\nodejs",
  "${env:ProgramFiles(x86)}\nodejs",
  "$env:LOCALAPPDATA\Programs\node"
)
foreach ($d in $nodeDirs) {
  if (Test-Path (Join-Path $d "node.exe")) {
    $env:Path = "$d;$env:Path"
  }
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js not found. Install LTS from https://nodejs.org then restart PC." -ForegroundColor Red
  Start-Process "https://nodejs.org/en/download"
  Read-Host "Press Enter to close"
  exit 1
}

Write-Step "Node $(node -v)"

if (-not (Test-Path "package.json")) {
  Write-Host "package.json missing. Extract the FULL zip first." -ForegroundColor Red
  Read-Host "Press Enter to close"
  exit 1
}

Write-Step "Stopping old servers on 3000/3001 (if any)"
Get-NetTCPConnection -LocalPort 3000,3001 -ErrorAction SilentlyContinue |
  ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }

if (-not (Test-Path "node_modules")) {
  Write-Step "First run: npm install (needs internet)..."
  npm install
  if ($LASTEXITCODE -ne 0) { throw "npm install failed" }
}

if (-not (Test-Path ".env.local") -and (Test-Path ".env.example")) {
  Copy-Item ".env.example" ".env.local"
}

Write-Step "Starting site at http://localhost:3000"
Write-Host "Keep this window open. Press Ctrl+C to stop." -ForegroundColor Yellow

Start-Job -ScriptBlock {
  for ($i = 0; $i -lt 60; $i++) {
    try {
      $r = Invoke-WebRequest "http://localhost:3000" -UseBasicParsing -TimeoutSec 2
      if ($r.StatusCode -ge 200) {
        Start-Process "http://localhost:3000"
        return
      }
    } catch {}
    Start-Sleep 1
  }
  Start-Process "http://localhost:3000"
} | Out-Null

npm run dev
