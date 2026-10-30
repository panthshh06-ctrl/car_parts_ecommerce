@echo off
TITLE Apex Fitment Platform - E-Commerce & Fitment Database
COLOR 0B
CLS

echo ========================================================
echo   APEX FITMENT - AUTOMOTIVE WHEEL & TYRE PLATFORM
echo ========================================================
echo.

echo [1/4] Generating Prisma Client and verifying database...
call npx prisma generate
call npx prisma db push --skip-generate

echo.
echo [2/4] Seeding demo automotive inventory & fitment database...
call npx ts-node prisma/seed.ts

echo.
echo [3/4] Finding available port starting from 3000...
for /f "usebackq" %%p in (`powershell -Command "$port = 3000; while (Test-NetConnection -ComputerName localhost -Port $port -InformationLevel Quiet) { $port++ }; $port"`) do set PORT=%%p

echo Selected Port: %PORT%
echo.
echo ========================================================
echo   ADMIN LOGIN: http://localhost:%PORT%/admin/login
echo   USERNAME: admin
echo   PASSWORD: admin123
echo ========================================================
echo.
echo [4/4] Starting Next.js Webpack Development Server on port %PORT%...
echo Please wait while the server compiles...
echo.

start cmd /k "npm run dev -- --webpack -p %PORT%"

echo Waiting for server to start on port %PORT%...
powershell -Command "$p = %PORT%; while (-not (Test-NetConnection -ComputerName localhost -Port $p -InformationLevel Quiet).TcpTestSucceeded) { Start-Sleep -Milliseconds 500 }"

echo Server is ready! Opening storefront and admin login...
echo Storefront: http://localhost:%PORT%
echo Admin login: http://localhost:%PORT%/admin/login
echo Admin credentials: admin / admin123
start http://localhost:%PORT%
start http://localhost:%PORT%/admin/login
