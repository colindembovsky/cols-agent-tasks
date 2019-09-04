#
# DEBUGGING:
# 1. clone the azure-pipelines-task-lib to the same level as cols-agent-tasks
#    Import-Module ..\..\..\azure-pipelines-task-lib\powershell\VstsTaskSdk -ArgumentList @{ NonInteractive = $true } -Verbose:$true
# 3. Invoke this script
#

param(
    [string]$pat = (Read-Host -Prompt "PAT")
)

$vstsAcc = "cacdemo"
$rootUri = "https://$vstsAcc.visualstudio.com/"

$base64authinfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(("{0}:{1}" -f "", $pat)))

Import-Module .\ps_modules\VstsTaskSdk -ArgumentList @{ NonInteractive = $true } -Verbose:$true

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
#$env:INPUT_USERSQLPACKAGEPATH="c:\foo\foo.exe"

# invoke the script
Invoke-VstsTaskScript -ScriptBlock ([scriptblock]::Create('. .\DacPacReport.ps1')) -Verbose