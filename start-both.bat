@echo off
echo Starting EtherXPPT Client and Server...
echo.

REM Start server in background
echo Starting server on port 3001...
start "EtherXPPT Server" cmd /k "cd server && npm start"

REM Wait a moment for server to start
timeout /t 3 /nobreak >nul

REM Start client
echo Starting client on port 5173...
start "EtherXPPT Client" cmd /k "cd client && npm run dev"

echo.
echo Both client and server are starting...
echo Client will be available at: http://localhost:5173
echo Server will be available at: http://localhost:3001
echo.
echo Press any key to exit this script (servers will continue running)...
pause >nul