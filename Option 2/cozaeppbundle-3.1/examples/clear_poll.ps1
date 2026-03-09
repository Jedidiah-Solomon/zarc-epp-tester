# Clear poll messages loop
Write-Host "Starting to clear 145 poll messages..." -ForegroundColor Green

for ($i = 0; $i -lt 145; $i++) {
    Write-Host "Clearing message $($i+1) of 145..." -ForegroundColor Yellow
    
    # Get poll message
    python epp.py --host=ote.zarc.net.za --port=700 login.xml poll_request_1.xml > poll_out.txt
    
    # Extract msgID from the response
    $msgID = Select-String -Path poll_out.txt -Pattern 'id="([^"]+)"' | ForEach-Object { $_.Matches.Groups[1].Value }
    
    if ($msgID) {
        Write-Host "Acknowledging msgID: $msgID" -ForegroundColor Cyan
        
        # Update poll_ack_1.xml with the msgID
        (Get-Content poll_ack_1.xml) -replace 'msgID="[^"]*"', "msgID=`"$msgID`"" | Set-Content temp_ack.xml
        
        # Send ack
        python epp.py --host=ote.zarc.net.za --port=700 login.xml temp_ack.xml
    }
    
    Start-Sleep -Seconds 1
}

# Cleanup
Remove-Item temp_ack.xml -ErrorAction SilentlyContinue
Remove-Item poll_out.txt -ErrorAction SilentlyContinue

Write-Host "All 145 messages cleared!" -ForegroundColor Green
Write-Host "Run 'python epp.py --host=ote.zarc.net.za --port=700 --verbose login.xml poll_request_1.xml' to check for new messages" -ForegroundColor Yellow