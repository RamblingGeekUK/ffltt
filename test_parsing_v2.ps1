# Test parsing logic for PowerShell using similar logic to bash
cd "x:\Dev\Projects\forkedfromltt"
$BODY = (Get-Content issue.json | ConvertFrom-Json).body

Write-Host "RAW BODY:"
Write-Host $BODY
Write-Host "---"

# Split the body into lines
$lines = $BODY -split "`r?`n"

# Extract fields by finding the section headers and getting the next non-empty line
$CHANNEL_NAME = ""
$YOUTUBE_URL = ""
$FULLY_FORKED = ""

for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i].Trim()
    
    if ($line -eq "### Channel Name") {
        $i++
        # Skip empty lines and find first non-empty line
        while ($i -lt $lines.Count -and [string]::IsNullOrWhiteSpace($lines[$i])) { $i++ }
        if ($i -lt $lines.Count -and !$lines[$i].StartsWith("###")) {
            $CHANNEL_NAME = $lines[$i].Trim()
        }
    }
    elseif ($line -eq "### YouTube URL") {
        $i++
        # Skip empty lines and find first non-empty line
        while ($i -lt $lines.Count -and [string]::IsNullOrWhiteSpace($lines[$i])) { $i++ }
        if ($i -lt $lines.Count -and !$lines[$i].StartsWith("###")) {
            $YOUTUBE_URL = $lines[$i].Trim()
        }
    }
    elseif ($line -eq "### Fully Forked?") {
        $i++
        # Skip empty lines and find first non-empty line
        while ($i -lt $lines.Count -and [string]::IsNullOrWhiteSpace($lines[$i])) { $i++ }
        if ($i -lt $lines.Count -and !$lines[$i].StartsWith("###")) {
            $FULLY_FORKED = $lines[$i].Trim()
        }
    }
}

Write-Host "CHANNEL_NAME: '$CHANNEL_NAME'"
Write-Host "YOUTUBE_URL: '$YOUTUBE_URL'"
Write-Host "FULLY_FORKED: '$FULLY_FORKED'"

# Normalize fully_forked value
if ($FULLY_FORKED -eq "true" -or $FULLY_FORKED -eq "True") {
    $FULLY_FORKED_BOOL = $true
} else {
    $FULLY_FORKED_BOOL = $false
}

# Extract channelId from YouTube URL
$CHANNEL_ID = ""
if ($YOUTUBE_URL -match "channel/([^/?]+)") {
    $CHANNEL_ID = $matches[1]
}

Write-Host "CHANNEL_ID: '$CHANNEL_ID'"

# Build new channel JSON entry
$NEW_ENTRY = @{
    name = $CHANNEL_NAME
    channelId = $CHANNEL_ID  
    FullyForked = $FULLY_FORKED_BOOL
}

Write-Host "NEW_ENTRY:"
$NEW_ENTRY | ConvertTo-Json -Depth 3
