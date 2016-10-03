#
# DEBUGGING:
# 1. clone the vsts-task-lib to the same level as cols-agent-tasks
#    Import-Module ..\..\..\vsts-task-lib\powershell\VstsTaskSdk\VstsTaskSdk.psd1 -ArgumentList @{ NonInteractive = $true } -Verbose:$true
# 3. Invoke this script
#

param(
    [string]$pat = (Read-Host -Prompt "PAT")
)

$vstsAcc = "cacdemo"
$rootUri = "https://$vstsAcc.visualstudio.com/"

$base64authinfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(("{0}:{1}" -f "", $pat)))

Import-Module .\ps_modules\VstsTaskSdk\VstsTaskSdk.psd1 -ArgumentList @{ NonInteractive = $true } -Verbose:$true

# system variables
$env:SYSTEM_ACCESSTOKEN=$base64authinfo
$env:SYSTEM_TEAMFOUNDATIONCOLLECTIONURI=$rootUri
$env:SYSTEM_TEAMPROJECTID="ec235bcd-730b-442e-bd5d-b63437c1cb7c" # cacdemo/Demo
$env:SYSTEM_DEFINITIONID=9 # FabFiberExpress-DACPAC

# user inputs
$env:INPUT_DROPNAME="drop"
$env:INPUT_DACPACNAME="fabFiber.Schema"
$env:INPUT_TARGETDACPACPATH="C:\mData\ws\col\dac"
$env:INPUT_EXTRAARGS="/v:Hello=Bye"

# invoke the script
Invoke-VstsTaskScript -ScriptBlock { . .\DacPacReport.ps1 } -Verbose