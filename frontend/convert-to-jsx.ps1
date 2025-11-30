$files = Get-ChildItem -Path ".\src" -Recurse -Filter "*.js" -File

foreach ($file in $files) {
    $newName = $file.FullName -replace '\.js$', '.jsx'
    if ($file.FullName -ne $newName) {
        Write-Host "Renaming $($file.FullName) to $newName"
        Rename-Item -Path $file.FullName -NewName $newName -Force
    }
}

Write-Host "All .js files have been renamed to .jsx"
