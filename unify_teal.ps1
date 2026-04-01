$files = Get-ChildItem -Path "src" -Recurse -File -Include *.tsx,*.ts,*.css

foreach ($file in $files) {
    try {
        $path = $file.FullName
        $content = [System.IO.File]::ReadAllText($path)
        $hasChanges = $false
        
        # Replace pink with teal
        if ($content -match "pink-") {
            $content = $content -replace "pink-", "teal-"
            $hasChanges = $true
            Write-Host "Found pink in $path"
        }
        if ($content -match "prose-pink") {
            $content = $content -replace "prose-pink", "prose-teal"
            $hasChanges = $true
        }
        
        # Standardize all teal-600 to teal-700 (primary action color)
        if ($content -match "teal-600") {
            $content = $content -replace "teal-600", "teal-700"
            $hasChanges = $true
            Write-Host "Found teal-600 in $path"
        }

        if ($hasChanges) {
            [System.IO.File]::WriteAllText($path, $content)
            Write-Host "Updated $path"
        }
    } catch {
        Write-Warning "Failed to process $path : $($_.Exception.Message)"
    }
}
