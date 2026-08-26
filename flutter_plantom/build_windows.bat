@echo off
echo ===============================================================================
echo                Plantom (پلنتوم) - Windows Production Build Pipeline
echo ===============================================================================
echo [1/4] Cleaning previous build artifacts...
call flutter clean

echo [2/4] Fetching Flutter dependencies...
call flutter pub get

echo [3/4] Generating Drift SQLite database and Riverpod models...
call dart run build_runner build --delete-conflicting-outputs

echo [4/4] Compiling Native Standalone Windows Release Executable (Plantom.exe)...
call flutter build windows --release

echo ===============================================================================
echo [SUCCESS] Plantom Windows Build Complete!
echo The standalone runnable executable and files are located at:
echo build\windows\x64\runner\Release\plantom.exe
echo ===============================================================================
pause
