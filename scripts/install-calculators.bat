@echo off
REM Installation script for Dynamic Calculators Feature (Windows)

echo Installing required dependencies for Dynamic Calculators...
echo.

REM Install @nestjs/axios and axios if not already installed
call npm install --save @nestjs/axios axios

echo.
echo [32m✓ Dependencies installed successfully[0m
echo.
echo Next steps:
echo 1. Add DynamicCalculatorsModule to your AppModule imports
echo 2. Run database migrations or sync entities
echo 3. Start your application
echo.
echo For detailed instructions, see src/calculators/README.md
pause
