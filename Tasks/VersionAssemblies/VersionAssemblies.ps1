[CmdletBinding(DefaultParameterSetName = 'None')]
param(
	[string][Parameter(Mandatory=$true)][ValidateNotNullOrEmpty()] $sourcePath,
    [string][Parameter(Mandatory=$true)][ValidateNotNullOrEmpty()] $filePattern,
    [string][Parameter(Mandatory=$true)][ValidateNotNullOrEmpty()] $buildRegex,
    [string]$replaceRegex,
    [string]$buildNumber = $env:BUILD_BUILDNUMBER
)

Write-Verbose "Starting Version Assemblies step"

Write-Verbose -Verbose "sourcePath = $sourcePath"
Write-Verbose -Verbose "filePattern = $filePattern"
Write-Verbose -Verbose "buildRegex = $buildRegex"
Write-Verbose -Verbose "replaceRegex = $replaceRegex"
Write-Verbose -Verbose "buildNumber = $buildNumber"

if ($replaceRegex -eq ""){
    $replaceRegex = $buildRegex
}
Write-Verbose "Using $replaceRegex as the replacement regex"

if ($buildNumber -match $filePattern -ne $true) {
    Write-Error "Could not extract a version from [$buildNumber] using pattern [$filePattern]"
    exit 1
} else {
    try {
        $extractedBuildNumber = $Matches[0]
        Write-Host "Using version $extractedBuildNumber in folder $sourcePath"
  
        $files = gci -Path $sourcePath -Filter $filePattern -Recurse
 
        if ($files){
            $files | % {
                $fileToChange = $_.FullName  
                Write-Verbose "  -> Changing version in $($fileToChange)"
                 
                # remove the read-only bit on the file
                sp $fileToChange IsReadOnly $false
  
                # run the regex replace
                (gc $fileToChange) | % { $_ -replace $pattern, $extractedBuildNumber } | sc $fileToChange
            }
        } else {
            Write-Warning "No files found"
        }
  
        Write-Verbose "Replaced version in $($files.length) files"
    } catch {
        Throw-Error $_
    }
}




