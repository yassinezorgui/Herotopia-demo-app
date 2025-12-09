@echo off
REM Herotopia Quick Start Script for Windows
REM This script sets up and runs the application

echo.
echo ====================================================
echo  Herotopia - Educational Chatbot
echo ====================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)

echo [OK] Python found

REM Check if virtual environment exists
if not exist "venv\" (
    echo.
    echo [INFO] Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo [ERROR] Failed to create virtual environment
        pause
        exit /b 1
    )
    echo [OK] Virtual environment created
)

REM Activate virtual environment
echo.
echo [INFO] Activating virtual environment...
call venv\Scripts\activate.bat

REM Install requirements
echo.
echo [INFO] Installing dependencies...
pip install -q -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [OK] Dependencies installed

REM Run setup script
echo.
echo [INFO] Running setup wizard...
python setup.py
if errorlevel 1 (
    echo [WARNING] Setup had some issues, but continuing...
)

REM Run the application
echo.
echo ====================================================
echo  Starting Herotopia...
echo ====================================================
echo.
echo [INFO] Application will open at http://localhost:5000
echo [INFO] Press Ctrl+C to stop the server
echo.

python app.py

pause
