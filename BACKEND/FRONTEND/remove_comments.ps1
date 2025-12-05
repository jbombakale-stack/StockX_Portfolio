
$files = Get-ChildItem -Path "src" -Include *.js,*.jsx -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    $regex = '("(\\.|[^"\\])*"|''(\\.|[^''\\])*''|`(\\.|[^`\\])*`)|(\/\/[^\r\n]*)|(\/\*[\s\S]*?\*\/)'
    
    $evaluator = {
        param($match)
        # If it starts with a quote, it's a string, keep it.
        if ($match.Value.StartsWith('"') -or $match.Value.StartsWith("'") -or $match.Value.StartsWith("`")) {
            return $match.Value
        }
        # Otherwise it's a comment, replace with empty string
        return ""
    }
    
    $newContent = [System.Text.RegularExpressions.Regex]::Replace($content, $regex, $evaluator)
    
    if ($content -ne $newContent) {
        Set-Content -Path $file.FullName -Value $newContent -NoNewline -Encoding UTF8
        Write-Host "Cleaned: $($file.Name)"
    }
}
Write-Host "Comment removal complete."
