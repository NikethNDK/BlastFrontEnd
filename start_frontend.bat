@echo off
echo Starting React Frontend Server...
cd /d "D:\Projects_Blast\Blast\INVENTORY\inventory_frontend"
echo Frontend server will be available at: http://[YOUR_IP]:3000
echo.
echo Choose deployment method:
echo 1. Development mode (npm start)
echo 2. Production mode (serve build)
echo.
set /p choice="Enter choice (1 or 2): "

if "%choice%"=="1" (
    echo Starting development server...
    npm start
) else if "%choice%"=="2" (
    echo Starting production server...
    serve -s build -l 3000
) else (
    echo Invalid choice. Starting development server...
    npm start
)
pause
