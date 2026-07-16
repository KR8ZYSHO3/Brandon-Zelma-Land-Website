@echo off
cd /d "D:\Projects\brandon-zelma-land"
echo === DEBUG CLICK WORKED === > "D:\Projects\brandon-zelma-land\LAUNCH-LOG.txt"
echo Folder: %CD% >> "D:\Projects\brandon-zelma-land\LAUNCH-LOG.txt"
echo User: %USERNAME% >> "D:\Projects\brandon-zelma-land\LAUNCH-LOG.txt"
echo Time: %DATE% %TIME% >> "D:\Projects\brandon-zelma-land\LAUNCH-LOG.txt"
if exist "C:\Program Files\nodejs\node.exe" (
  echo Node: YES >> "D:\Projects\brandon-zelma-land\LAUNCH-LOG.txt"
  "C:\Program Files\nodejs\node.exe" -v >> "D:\Projects\brandon-zelma-land\LAUNCH-LOG.txt" 2>&1
) else (
  echo Node: NO >> "D:\Projects\brandon-zelma-land\LAUNCH-LOG.txt"
)
if exist package.json (echo package.json: YES >> "D:\Projects\brandon-zelma-land\LAUNCH-LOG.txt") else (echo package.json: NO >> "D:\Projects\brandon-zelma-land\LAUNCH-LOG.txt")
echo. >> "D:\Projects\brandon-zelma-land\LAUNCH-LOG.txt"
echo If you see this in Notepad, double-click works. >> "D:\Projects\brandon-zelma-land\LAUNCH-LOG.txt"
start notepad "D:\Projects\brandon-zelma-land\LAUNCH-LOG.txt"
echo DEBUG OK - Notepad should open with LAUNCH-LOG.txt
pause