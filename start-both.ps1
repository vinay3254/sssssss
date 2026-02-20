# Start both client and server
Write-Host "Starting EtherXPPT Client and Server..." -ForegroundColor Green

# Start server in background
Write-Host "Starting server on port 3001..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm start" -WindowStyle Normal

# Wait for server to start
Start-Sleep -Seconds 3

# Start client
Write-Host "Starting client on port 5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "Both services are starting..." -ForegroundColor Green
Write-Host "Client: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Server: http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit this script (services will continue running)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")