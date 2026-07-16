@echo off
setlocal EnableExtensions
cd /d "%~dp0"

set "STAGING=%TEMP%\bzl-zip-staging"

echo.
echo  Creating zip for Brandon on Desktop...
echo.

if exist "%STAGING%" rmdir /s /q "%STAGING%"
mkdir "%STAGING%\brandon-zelma-land"

REM Copy project without heavy / secret / build folders
robocopy "%~dp0" "%STAGING%\brandon-zelma-land" /E /XD node_modules .next .git data /XF *.log .env.local >nul

REM Keep empty data folder with sample leads file
mkdir "%STAGING%\brandon-zelma-land\data" 2>nul
echo []> "%STAGING%\brandon-zelma-land\data\leads.json"

REM Prefer D:\Projects (gift location); fall back to Desktop
powershell -NoProfile -Command ^
  "$outDir = if (Test-Path 'D:\Projects') { 'D:\Projects' } else { [Environment]::GetFolderPath('Desktop') }; $out = Join-Path $outDir 'Brandon-Zelma-Land-Website.zip'; if (Test-Path $out) { Remove-Item $out -Force }; Compress-Archive -Path '%STAGING%\brandon-zelma-land' -DestinationPath $out -Force; Write-Output $out"

rmdir /s /q "%STAGING%"

echo.
echo  Done. Zip is at:
echo  D:\Projects\Brandon-Zelma-Land-Website.zip
echo  (or Desktop if D:\Projects is missing)
echo.
echo  Send that zip to Brandon. He unzips and double-clicks:
echo  Start-Brandon-Zelma-Land.bat
echo.
pause
