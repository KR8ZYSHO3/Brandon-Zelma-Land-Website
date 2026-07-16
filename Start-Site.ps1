$ErrorActionPreference = "Continue"
$proj = "D:\Projects\brandon-zelma-land"
$desk = [Environment]::GetFolderPath("Desktop")
$log = Join-Path $desk "BZL-DESKTOP-LOG.txt"

function Log($m) {
  $line = "$(Get-Date -Format o)  $m"
  Add-Content -Path $log -Value $line
  Write-Host $line
}

try {
  "=== BZL START $(Get-Date) ===" | Set-Content $log
  Log "Script started"
  Log "User=$env:USERNAME Computer=$env:COMPUTERNAME"
  Log "Project=$proj"

  if (-not (Test-Path $proj)) { throw "Project folder missing: $proj" }
  Set-Location $proj
  Log "CD ok: $(Get-Location)"

  $node = "C:\Program Files\nodejs\node.exe"
  $npm  = "C:\Program Files\nodejs\npm.cmd"
  if (-not (Test-Path $node)) { throw "Node not found at $node - install from https://nodejs.org (LTS) and restart PC" }
  Log "Node=$(& $node -v)"

  if (-not (Test-Path "$proj\package.json")) { throw "package.json missing in project" }

  # free ports
  foreach ($port in 3000,3001) {
    Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | ForEach-Object {
      if ($_.OwningProcess -gt 0) {
        Log "Killing PID $($_.OwningProcess) on port $port"
        Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
      }
    }
  }
  Start-Sleep -Seconds 1

  if (-not (Test-Path "$proj\node_modules")) {
    Log "Running npm install..."
    & $npm install
    if ($LASTEXITCODE -ne 0) { throw "npm install failed code $LASTEXITCODE" }
  }

  if (-not (Test-Path "$proj\.env.local") -and (Test-Path "$proj\.env.example")) {
    Copy-Item "$proj\.env.example" "$proj\.env.local" -Force
  }

  Log "Starting next dev..."
  Write-Host ""
  Write-Host "========================================" -ForegroundColor Green
  Write-Host " Website: http://localhost:3000" -ForegroundColor Green
  Write-Host " KEEP THIS WINDOW OPEN" -ForegroundColor Yellow
  Write-Host " Log file on Desktop: BZL-DESKTOP-LOG.txt" -ForegroundColor Cyan
  Write-Host "========================================" -ForegroundColor Green
  Write-Host ""

  # open browser after delay
  Start-Process powershell -ArgumentList '-NoProfile -Command "Start-Sleep 6; Start-Process http://localhost:3000"' -WindowStyle Hidden

  & $npm run dev
  Log "npm run dev exited code $LASTEXITCODE"
}
catch {
  Log "ERROR: $($_.Exception.Message)"
  Log $_.ScriptStackTrace
  Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
  Write-Host "See Desktop file: BZL-DESKTOP-LOG.txt" -ForegroundColor Yellow
  try { notepad $log } catch {}
  Read-Host "Press Enter to close"
  exit 1
}

Log "Ended"
Read-Host "Press Enter to close"
