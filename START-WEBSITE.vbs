On Error Resume Next
Dim sh, fso, logPath, desk, proj, cmd
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

desk = sh.SpecialFolders("Desktop")
logPath = desk & "\BZL-DESKTOP-LOG.txt"
proj = "D:\Projects\brandon-zelma-land"

' Always write a log on Desktop first thing
Dim ts
Set ts = fso.CreateTextFile(logPath, True)
ts.WriteLine "VBS clicked at " & Now
ts.WriteLine "Desktop=" & desk
ts.WriteLine "Project=" & proj
If fso.FolderExists(proj) Then
  ts.WriteLine "Project folder: EXISTS"
Else
  ts.WriteLine "Project folder: MISSING"
End If
ts.Close

If Not fso.FolderExists(proj) Then
  MsgBox "Project folder not found:" & vbCrLf & proj, 16, "Brandon Zelma Land"
  WScript.Quit 1
End If

If Not fso.FileExists("C:\Program Files\nodejs\node.exe") Then
  MsgBox "Node.js is not installed." & vbCrLf & vbCrLf & "1. Install LTS from nodejs.org" & vbCrLf & "2. Restart your PC" & vbCrLf & "3. Click this again", 16, "Brandon Zelma Land"
  sh.Run "https://nodejs.org", 1, False
  WScript.Quit 1
End If

MsgBox "Starting website..." & vbCrLf & vbCrLf & "A black window will open." & vbCrLf & "Browser goes to http://localhost:3000" & vbCrLf & vbCrLf & "Log: Desktop\BZL-DESKTOP-LOG.txt", 64, "Brandon Zelma Land"

' -NoExit keeps window open; Bypass avoids policy block
cmd = "powershell.exe -NoExit -ExecutionPolicy Bypass -File """ & proj & "\Start-Site.ps1"""
sh.Run cmd, 1, False