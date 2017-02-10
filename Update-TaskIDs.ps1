param (
    [Switch]$Beta
)

if ($Beta) {
    Write-Host -f Magenta "Switching to beta ids"
} else {
    Write-Host -f Magenta "Switching to live ids"
}

$tasks = ConvertFrom-Json (gc .\taskIds.json -Raw)
foreach ($task in $tasks.tasks) {
    Write-Host -f Yellow ("Converting task path {0}" -f $task.path)
    $path = Join-Path -Path "." -ChildPath $task.path
    $path = Join-Path -Path $path -ChildPath "task.json"
    $taskJson = ConvertFrom-Json (gc $path -Raw)
    if ($Beta) {
        $taskJson.id = $task.'beta-id'
    } else {
        $taskJson.id = $task.id
    }
    sc $path -Value (ConvertTo-Json $taskJson -Depth 100)
}

Write-Host "Done!" -f Green