# Herotopia Quick Start Script for PowerShell
# Run with: powershell -ExecutionPolicy Bypass -File start.ps1

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host " Herotopia - Educational Chatbot" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "[✓] Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "[✗] Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "    Please install Python 3.8+ from https://www.python.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if virtual environment exists
if (-not (Test-Path "venv\Scripts\Activate.ps1")) {
    Write-Host ""
    Write-Host "[•] Creating virtual environment..." -ForegroundColor Cyan
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[✗] Failed to create virtual environment" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "[✓] Virtual environment created" -ForegroundColor Green
}

# Activate virtual environment
Write-Host ""
Write-Host "[•] Activating virtual environment..." -ForegroundColor Cyan
& venv\Scripts\Activate.ps1
Write-Host "[✓] Virtual environment activated" -ForegroundColor Green

# Install requirements
Write-Host ""
Write-Host "[•] Installing dependencies..." -ForegroundColor Cyan
pip install -q -r requirements.txt 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "[✓] Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "[✗] Failed to install dependencies" -ForegroundColor Red
    Write-Host "    Run: pip install -r requirements.txt" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Run setup script
Write-Host ""
Write-Host "[•] Running setup wizard..." -ForegroundColor Cyan
python setup.py
if ($LASTEXITCODE -ne 0) {
    Write-Host "[!] Setup had some issues, but continuing..." -ForegroundColor Yellow
}

# Run the application
Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host " Starting Herotopia..." -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[•] Application will open at http://localhost:5000" -ForegroundColor Cyan
Write-Host "[•] Press Ctrl+C to stop the server" -ForegroundColor Cyan
Write-Host ""

python app.py

Read-Host "Press Enter to exit"
