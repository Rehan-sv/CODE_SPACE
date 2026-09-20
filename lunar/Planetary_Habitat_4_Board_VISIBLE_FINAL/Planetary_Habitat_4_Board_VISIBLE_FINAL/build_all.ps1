$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$unoBoards = @("01_Environment_Monitoring","02_Life_Support_Utilities","03_Safety_Emergency","04_Smart_Infrastructure")
foreach($b in $unoBoards){
  Push-Location (Join-Path $root $b)
  Write-Host "Building $b..."
  arduino-cli compile --fqbn arduino:avr:uno --output-dir build/arduino.avr.uno .
  Pop-Location
}
Push-Location (Join-Path $root "05_Central_Mega_Dashboard")
Write-Host "Building 05_Central_Mega_Dashboard..."
arduino-cli compile --fqbn arduino:avr:mega --output-dir build/arduino.avr.mega .
Pop-Location
Write-Host "All Arduino targets built."
