@echo off
setlocal
REM Always go to the real project folder (not Desktop / not the zip)
cd /d "D:\Projects\brandon-zelma-land"
if errorlevel 1 (
  echo Cannot find D:\Projects\brandon-zelma-land
  echo Open File Explorer and go to that folder.
  pause
  exit /b 1
)

set "LOG=D:\Projects\brandon-zelma-land\LAUNCH-LOG.txt"
echo === Launch %DATE% %TIME% === > "%LOG%"
echo Folder=%CD% >> "%LOG%"

echo.
echo Brandon Zelma Land
echo Folder: %CD%
echo.

set "PATH=C:\Program Files\nodejs;C:\Program Files (x86)\nodejs;%PATH%"

if not exist "C:\Program Files\nodejs\node.exe" (
  echo Node.js missing. Install LTS from nodejs.org then restart PC.
  echo NODE MISSING >> "%LOG%"
  start https://nodejs.org
  start notepad "%LOG%"
  pause
  exit /b 1
)

"C:\Program Files\nodejs\node.exe" -v
"C:\Program Files\nodejs\node.exe" -v >> "%LOG%" 2>&1

if not exist "package.json" (
  echo package.json missing in project folder.
  echo NO PACKAGE >> "%LOG%"
  start notepad "%LOG%"
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo First time install - please wait...
  call "C:\Program Files\nodejs\npm.cmd" install
  if errorlevel 1 (
    echo npm install failed >> "%LOG%"
    start notepad "%LOG%"
    pause
    exit /b 1
  )
)

echo Starting http://localhost:3000
echo KEEP THIS WINDOW OPEN
echo.

start "bzl-browser" cmd /c "ping -n 8 127.0.0.1 >nul & start http://localhost:3000"
call "C:\Program Files\nodejs\npm.cmd" run dev
echo exit %ERRORLEVEL% >> "%LOG%"
echo.
echo Stopped. If it failed, LAUNCH-LOG.txt is in the project folder.
pause